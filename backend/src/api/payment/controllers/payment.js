'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const asaasService = require('../../../services/asaas');

module.exports = createCoreController('api::payment.payment', ({ strapi }) => ({
  async createPixPayment(ctx) {
    try {
      const { orderId, customerData } = ctx.request.body;
      
      // Verify user is authenticated
      if (!ctx.state.user) {
        return ctx.unauthorized('Login necessário');
      }
      
      // Get order details
      const order = await strapi.db.query('api::order.order').findOne({
        where: { id: orderId },
        populate: ['customer']
      });

      if (!order) {
        return ctx.badRequest('Pedido não encontrado');
      }

      // Verify order belongs to authenticated user (compare by email)
      if (order.customer.email !== ctx.state.user.email) {
        return ctx.forbidden('Este pedido não pertence a você');
      }

      // Create or get customer in Asaas
      let asaasCustomer;
      try {
        asaasCustomer = await asaasService.createCustomer({
          name: customerData.name,
          email: customerData.email,
          cpfCnpj: customerData.cpfCnpj?.replace(/[^\d]/g, ''),
          phone: customerData.phone,
          mobilePhone: customerData.mobilePhone,
          address: customerData.address,
          addressNumber: customerData.addressNumber,
          complement: customerData.complement,
          province: customerData.province,
          city: customerData.city,
          postalCode: customerData.postalCode?.replace(/[^\d]/g, ''),
          externalReference: `customer_${order.id}`
        });
      } catch (error) {
        console.log('Customer might already exist, continuing...');
        // If customer already exists, we'll use the existing one
        asaasCustomer = { id: customerData.asaasCustomerId };
      }

      // Create PIX payment
      const paymentData = {
        value: order.valor_total,
        description: `Pedido #${order.numero_pedido} - Kaiyruu TCG`,
        externalReference: `order_${order.id}`,
        discountValue: 0
      };

      const pixPayment = await asaasService.createPixPayment(asaasCustomer.id, paymentData);

      // Save payment in database
      const payment = await strapi.db.query('api::payment.payment').create({
        data: {
          asaas_payment_id: pixPayment.id,
          asaas_customer_id: asaasCustomer.id,
          order: order.id,
          payment_type: 'PIX',
          status: 'PENDING',
          value: order.valor_total,
          net_value: pixPayment.netValue,
          due_date: pixPayment.dueDate,
          pix_qr_code: pixPayment.pixQrCode,
          pix_code: pixPayment.pixCode,
          external_reference: paymentData.externalReference,
          description: paymentData.description,
          asaas_raw_response: pixPayment
        }
      });

      // Update order status
      await strapi.db.query('api::order.order').update({
        where: { id: orderId },
        data: { status: 'Aguardando Pagamento' }
      });

      return {
        success: true,
        payment: {
          id: payment.asaas_payment_id,
          status: payment.status,
          value: payment.value,
          dueDate: payment.due_date,
          pixQrCode: payment.pix_qr_code,
          pixCode: payment.pix_code
        }
      };
    } catch (error) {
      console.error('Erro ao criar pagamento PIX:', error);
      return ctx.internalServerError('Erro ao processar pagamento PIX');
    }
  },

  async createCreditCardPayment(ctx) {
    try {
      const { orderId, customerData, cardData } = ctx.request.body;
      
      // Verify user is authenticated
      if (!ctx.state.user) {
        return ctx.unauthorized('Login necessário');
      }
      
      // Get order details
      const order = await strapi.db.query('api::order.order').findOne({
        where: { id: orderId },
        populate: ['customer']
      });

      if (!order) {
        return ctx.badRequest('Pedido não encontrado');
      }

      // Verify order belongs to authenticated user (compare by email)
      if (order.customer.email !== ctx.state.user.email) {
        return ctx.forbidden('Este pedido não pertence a você');
      }

      // Validate card data
      if (!cardData.holderName || !cardData.number || !cardData.expiryMonth || 
          !cardData.expiryYear || !cardData.ccv) {
        return ctx.badRequest('Dados do cartão incompletos');
      }

      // Create or get customer in Asaas
      let asaasCustomer;
      try {
        asaasCustomer = await asaasService.createCustomer({
          name: customerData.name,
          email: customerData.email,
          cpfCnpj: customerData.cpfCnpj?.replace(/[^\d]/g, ''),
          phone: customerData.phone,
          mobilePhone: customerData.mobilePhone,
          address: customerData.address,
          addressNumber: customerData.addressNumber,
          complement: customerData.complement,
          province: customerData.province,
          city: customerData.city,
          postalCode: customerData.postalCode?.replace(/[^\d]/g, ''),
          externalReference: `customer_${order.id}`
        });
      } catch (error) {
        asaasCustomer = { id: customerData.asaasCustomerId };
      }

      // Create credit card payment
      const paymentData = {
        value: order.valor_total,
        description: `Pedido #${order.numero_pedido} - Kaiyruu TCG`,
        externalReference: `order_${order.id}`,
        installmentCount: cardData.installmentCount || 1
      };

      const cardPayment = await asaasService.createCreditCardPayment(
        asaasCustomer.id, 
        paymentData, 
        {
          ...cardData,
          email: customerData.email,
          cpfCnpj: customerData.cpfCnpj?.replace(/[^\d]/g, ''),
          postalCode: customerData.postalCode?.replace(/[^\d]/g, ''),
          addressNumber: customerData.addressNumber,
          phone: customerData.phone
        }
      );

      // Save payment in database
      const payment = await strapi.db.query('api::payment.payment').create({
        data: {
          asaas_payment_id: cardPayment.id,
          asaas_customer_id: asaasCustomer.id,
          order: order.id,
          payment_type: 'CREDIT_CARD',
          status: cardPayment.status || 'PENDING',
          value: order.valor_total,
          net_value: cardPayment.netValue,
          due_date: new Date(),
          installment_count: cardData.installmentCount || 1,
          external_reference: paymentData.externalReference,
          description: paymentData.description,
          asaas_raw_response: cardPayment
        }
      });

      // Update order status based on payment result
      const orderStatus = cardPayment.status === 'CONFIRMED' ? 'Processando' : 'Aguardando Pagamento';
      await strapi.db.query('api::order.order').update({
        where: { id: orderId },
        data: { status: orderStatus }
      });

      return {
        success: true,
        payment: {
          id: payment.asaas_payment_id,
          status: payment.status,
          value: payment.value,
          installmentCount: payment.installment_count
        }
      };
    } catch (error) {
      console.error('Erro ao processar cartão de crédito:', error);
      return ctx.internalServerError('Erro ao processar cartão de crédito');
    }
  },

  async createBoletoPayment(ctx) {
    try {
      const { orderId, customerData } = ctx.request.body;
      
      // Verify user is authenticated
      if (!ctx.state.user) {
        return ctx.unauthorized('Login necessário');
      }
      
      // Get order details
      const order = await strapi.db.query('api::order.order').findOne({
        where: { id: orderId },
        populate: ['customer']
      });

      if (!order) {
        return ctx.badRequest('Pedido não encontrado');
      }

      // Verify order belongs to authenticated user (compare by email)
      if (order.customer.email !== ctx.state.user.email) {
        return ctx.forbidden('Este pedido não pertence a você');
      }

      // Create or get customer in Asaas
      let asaasCustomer;
      try {
        asaasCustomer = await asaasService.createCustomer({
          name: customerData.name,
          email: customerData.email,
          cpfCnpj: customerData.cpfCnpj?.replace(/[^\d]/g, ''),
          phone: customerData.phone,
          mobilePhone: customerData.mobilePhone,
          address: customerData.address,
          addressNumber: customerData.addressNumber,
          complement: customerData.complement,
          province: customerData.province,
          city: customerData.city,
          postalCode: customerData.postalCode?.replace(/[^\d]/g, ''),
          externalReference: `customer_${order.id}`
        });
      } catch (error) {
        asaasCustomer = { id: customerData.asaasCustomerId };
      }

      // Create boleto payment
      const paymentData = {
        value: order.valor_total,
        description: `Pedido #${order.numero_pedido} - Kaiyruu TCG`,
        externalReference: `order_${order.id}`,
        discountValue: 0
      };

      const boletoPayment = await asaasService.createBoletoPayment(asaasCustomer.id, paymentData);

      // Save payment in database
      const payment = await strapi.db.query('api::payment.payment').create({
        data: {
          asaas_payment_id: boletoPayment.id,
          asaas_customer_id: asaasCustomer.id,
          order: order.id,
          payment_type: 'BOLETO',
          status: 'PENDING',
          value: order.valor_total,
          net_value: boletoPayment.netValue,
          due_date: boletoPayment.dueDate,
          boleto_url: boletoPayment.bankSlipUrl,
          invoice_url: boletoPayment.invoiceUrl,
          external_reference: paymentData.externalReference,
          description: paymentData.description,
          asaas_raw_response: boletoPayment
        }
      });

      // Update order status
      await strapi.db.query('api::order.order').update({
        where: { id: orderId },
        data: { status: 'Aguardando Pagamento' }
      });

      return {
        success: true,
        payment: {
          id: payment.asaas_payment_id,
          status: payment.status,
          value: payment.value,
          dueDate: payment.due_date,
          boletoUrl: payment.boleto_url,
          invoiceUrl: payment.invoice_url
        }
      };
    } catch (error) {
      console.error('Erro ao criar boleto:', error);
      return ctx.internalServerError('Erro ao processar boleto');
    }
  },

  async handleWebhook(ctx) {
    try {
      const webhookData = ctx.request.body;
      console.log('Webhook recebido:', webhookData);

      // Verify webhook authenticity (implement based on Asaas documentation)
      const event = webhookData.event;
      const payment = webhookData.payment;

      if (!payment || !payment.id) {
        return ctx.badRequest('Webhook inválido');
      }

      // Find payment in database
      const localPayment = await strapi.db.query('api::payment.payment').findOne({
        where: { asaas_payment_id: payment.id },
        populate: ['order']
      });

      if (!localPayment) {
        console.error('Pagamento não encontrado:', payment.id);
        return ctx.notFound('Pagamento não encontrado');
      }

      // Update payment status
      await strapi.db.query('api::payment.payment').update({
        where: { id: localPayment.id },
        data: {
          status: payment.status,
          payment_date: payment.paymentDate ? new Date(payment.paymentDate) : null,
          net_value: payment.netValue
        }
      });

      // Update order status based on payment status
      let orderStatus = localPayment.order.status;
      switch (payment.status) {
        case 'RECEIVED':
        case 'CONFIRMED':
          orderStatus = 'Processando';
          break;
        case 'OVERDUE':
          orderStatus = 'Vencido';
          break;
        case 'REFUNDED':
          orderStatus = 'Cancelado';
          break;
      }

      if (orderStatus !== localPayment.order.status) {
        await strapi.db.query('api::order.order').update({
          where: { id: localPayment.order.id },
          data: { status: orderStatus }
        });
      }

      // TODO: Send email notification to customer
      // await sendPaymentStatusEmail(localPayment.order, payment.status);

      return { received: true };
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      return ctx.internalServerError('Erro ao processar webhook');
    }
  },

  async getPaymentStatus(ctx) {
    try {
      const { paymentId } = ctx.params;
      
      const payment = await strapi.db.query('api::payment.payment').findOne({
        where: { asaas_payment_id: paymentId },
        populate: ['order']
      });

      if (!payment) {
        return ctx.notFound('Pagamento não encontrado');
      }

      // Get updated status from Asaas
      try {
        const asaasPayment = await asaasService.getPaymentStatus(paymentId);
        
        // Update local status if different
        if (asaasPayment.status !== payment.status) {
          await strapi.db.query('api::payment.payment').update({
            where: { id: payment.id },
            data: { 
              status: asaasPayment.status,
              payment_date: asaasPayment.paymentDate ? new Date(asaasPayment.paymentDate) : null
            }
          });
        }

        return {
          id: payment.asaas_payment_id,
          status: asaasPayment.status,
          value: payment.value,
          paymentDate: asaasPayment.paymentDate,
          dueDate: payment.due_date,
          order: payment.order.numero_pedido
        };
      } catch (error) {
        // Return local data if Asaas is unavailable
        return {
          id: payment.asaas_payment_id,
          status: payment.status,
          value: payment.value,
          paymentDate: payment.payment_date,
          dueDate: payment.due_date,
          order: payment.order.numero_pedido
        };
      }
    } catch (error) {
      console.error('Erro ao consultar status do pagamento:', error);
      return ctx.internalServerError('Erro ao consultar pagamento');
    }
  }
}));