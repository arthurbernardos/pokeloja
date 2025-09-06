const axios = require('axios');

class AsaasService {
  constructor() {
    this.apiKey = process.env.ASAAS_API_KEY;
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? 'https://www.asaas.com/api/v3' 
      : 'https://sandbox.asaas.com/api/v3';
    
    this.http = axios.create({
      baseURL: this.baseURL,
      headers: {
        'access_token': this.apiKey,
        'Content-Type': 'application/json'
      }
    });
  }

  async createCustomer(customerData) {
    try {
      const response = await this.http.post('/customers', {
        name: customerData.name,
        email: customerData.email,
        cpfCnpj: customerData.cpfCnpj,
        phone: customerData.phone,
        mobilePhone: customerData.mobilePhone,
        address: customerData.address,
        addressNumber: customerData.addressNumber,
        complement: customerData.complement,
        province: customerData.province,
        city: customerData.city,
        postalCode: customerData.postalCode,
        externalReference: customerData.externalReference
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao criar cliente no Asaas:', error);
      throw new Error('Falha ao criar cliente no gateway de pagamento');
    }
  }

  async createPixPayment(customerId, paymentData) {
    try {
      const response = await this.http.post('/payments', {
        customer: customerId,
        billingType: 'PIX',
        value: paymentData.value,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: paymentData.description,
        externalReference: paymentData.externalReference,
        discount: {
          value: paymentData.discountValue || 0,
          dueDateLimitDays: 0
        },
        fine: {
          value: 0
        },
        interest: {
          value: 0
        }
      });

      const payment = response.data;

      // Get PIX QR Code
      const pixResponse = await this.http.get(`/payments/${payment.id}/pixQrCode`);
      
      return {
        ...payment,
        pixQrCode: pixResponse.data.encodedImage,
        pixCode: pixResponse.data.payload
      };
    } catch (error) {
      console.error('Erro ao criar pagamento PIX:', error);
      throw new Error('Falha ao criar pagamento PIX');
    }
  }

  async createCreditCardPayment(customerId, paymentData, cardData) {
    try {
      const response = await this.http.post('/payments', {
        customer: customerId,
        billingType: 'CREDIT_CARD',
        value: paymentData.value,
        dueDate: new Date().toISOString().split('T')[0],
        description: paymentData.description,
        externalReference: paymentData.externalReference,
        installmentCount: paymentData.installmentCount || 1,
        creditCard: {
          holderName: cardData.holderName,
          number: cardData.number,
          expiryMonth: cardData.expiryMonth,
          expiryYear: cardData.expiryYear,
          ccv: cardData.ccv
        },
        creditCardHolderInfo: {
          name: cardData.holderName,
          email: cardData.email,
          cpfCnpj: cardData.cpfCnpj,
          postalCode: cardData.postalCode,
          addressNumber: cardData.addressNumber,
          phone: cardData.phone
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao criar pagamento com cartão:', error);
      throw new Error('Falha ao processar cartão de crédito');
    }
  }

  async createBoletoPayment(customerId, paymentData) {
    try {
      const response = await this.http.post('/payments', {
        customer: customerId,
        billingType: 'BOLETO',
        value: paymentData.value,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: paymentData.description,
        externalReference: paymentData.externalReference,
        discount: {
          value: paymentData.discountValue || 0,
          dueDateLimitDays: 0
        },
        fine: {
          value: 2
        },
        interest: {
          value: 1
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao criar boleto:', error);
      throw new Error('Falha ao criar boleto');
    }
  }

  async getPaymentStatus(paymentId) {
    try {
      const response = await this.http.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao consultar status do pagamento:', error);
      throw new Error('Falha ao consultar pagamento');
    }
  }

  async cancelPayment(paymentId) {
    try {
      const response = await this.http.delete(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao cancelar pagamento:', error);
      throw new Error('Falha ao cancelar pagamento');
    }
  }

  // Helper method to validate CPF/CNPJ
  validateDocument(document) {
    const cleanDocument = document.replace(/[^\d]/g, '');
    
    if (cleanDocument.length === 11) {
      // CPF validation logic
      return this.validateCPF(cleanDocument);
    } else if (cleanDocument.length === 14) {
      // CNPJ validation logic
      return this.validateCNPJ(cleanDocument);
    }
    
    return false;
  }

  validateCPF(cpf) {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit1 = 11 - (sum % 11);
    if (digit1 > 9) digit1 = 0;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let digit2 = 11 - (sum % 11);
    if (digit2 > 9) digit2 = 0;
    
    return cpf.charAt(9) == digit1 && cpf.charAt(10) == digit2;
  }

  validateCNPJ(cnpj) {
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
    
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cnpj.charAt(i)) * weights1[i];
    }
    let digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    
    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cnpj.charAt(i)) * weights2[i];
    }
    let digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    
    return cnpj.charAt(12) == digit1 && cnpj.charAt(13) == digit2;
  }
}

module.exports = new AsaasService();