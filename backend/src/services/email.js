'use strict';

const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Only create transporter if SMTP is configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      this.emailEnabled = true;
    } else {
      console.log('📧 Email not configured - emails will be logged only');
      this.emailEnabled = false;
    }

    this.adminEmail = process.env.ADMIN_EMAIL || 'admin@kairyuutcg.com.br';
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@kairyuutcg.com.br';
  }

  async sendEmail(mailOptions) {
    if (!this.emailEnabled) {
      console.log('📧 EMAIL WOULD BE SENT:');
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('Content:', mailOptions.html?.substring(0, 100) + '...');
      return;
    }

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('📧 Email sent to:', mailOptions.to);
    } catch (error) {
      console.error('❌ Email error:', error);
    }
  }

  async sendWelcomeEmail(user) {
    const mailOptions = {
      from: this.fromEmail,
      to: user.email,
      subject: 'Bem-vindo à Kairyuu TCG! 🎴',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1E40AF; color: white; padding: 20px; text-align: center;">
            <h1>Bem-vindo à Kairyuu TCG!</h1>
          </div>
          <div style="padding: 20px; background: #f8f9fa;">
            <h2>Olá, ${user.nome || user.username}!</h2>
            <p>Sua conta foi criada com sucesso. Agora você pode:</p>
            <ul>
              <li>📦 Fazer pedidos de cartas Pokémon</li>
              <li>🎯 Solicitar pedidos personalizados</li>
              <li>📱 Acompanhar seus pedidos</li>
              <li>💳 Pagar com PIX, cartão ou boleto</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://kairyuutcg.com.br" style="background: #F59E0B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Começar a Comprar
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">
              Se você não criou esta conta, ignore este email.
            </p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent to:', user.email);
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  async sendOrderConfirmation(order, user) {
    const mailOptions = {
      from: this.fromEmail,
      to: user.email,
      subject: `Pedido Confirmado #${order.numero_pedido} - Kairyuu TCG`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #16A34A; color: white; padding: 20px; text-align: center;">
            <h1>Pedido Confirmado! ✅</h1>
          </div>
          <div style="padding: 20px; background: #f8f9fa;">
            <h2>Pedido #${order.numero_pedido}</h2>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Total:</strong> R$ ${order.valor_total?.toFixed(2)}</p>
            
            <h3>Itens do Pedido:</h3>
            <div style="background: white; padding: 15px; border-radius: 5px;">
              ${order.items?.map(item => `
                <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                  <strong>${item.product?.nome || 'Produto'}</strong><br>
                  Quantidade: ${item.quantity} | Preço: R$ ${item.unit_price?.toFixed(2)}
                </div>
              `).join('') || '<p>Itens sendo processados...</p>'}
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://kairyuutcg.com.br/conta" style="background: #1E40AF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Acompanhar Pedido
              </a>
            </div>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Order confirmation sent to:', user.email);
    } catch (error) {
      console.error('Error sending order confirmation:', error);
    }
  }

  async sendOrderStatusUpdate(order, user, newStatus) {
    const statusMessages = {
      'Processando': 'Seu pedido está sendo preparado! 📦',
      'Enviado': 'Seu pedido foi enviado! 🚚',
      'Entregue': 'Seu pedido foi entregue! 🎉',
      'Cancelado': 'Seu pedido foi cancelado 😔',
    };

    const mailOptions = {
      from: this.fromEmail,
      to: user.email,
      subject: `Atualização do Pedido #${order.numero_pedido} - ${newStatus}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1E40AF; color: white; padding: 20px; text-align: center;">
            <h1>${statusMessages[newStatus] || 'Atualização do Pedido'}</h1>
          </div>
          <div style="padding: 20px; background: #f8f9fa;">
            <h2>Pedido #${order.numero_pedido}</h2>
            <p><strong>Novo Status:</strong> ${newStatus}</p>
            <p><strong>Total:</strong> R$ ${order.valor_total?.toFixed(2)}</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://kairyuutcg.com.br/conta" style="background: #1E40AF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Ver Detalhes
              </a>
            </div>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Order status update sent to:', user.email);
    } catch (error) {
      console.error('Error sending order status update:', error);
    }
  }

  async notifyAdminNewOrder(order, user) {
    const mailOptions = {
      from: this.fromEmail,
      to: this.adminEmail,
      subject: `🔔 Novo Pedido #${order.numero_pedido} - R$ ${order.valor_total?.toFixed(2)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #DC2626; color: white; padding: 20px; text-align: center;">
            <h1>Novo Pedido Recebido! 🛒</h1>
          </div>
          <div style="padding: 20px; background: #f8f9fa;">
            <h2>Pedido #${order.numero_pedido}</h2>
            <p><strong>Cliente:</strong> ${user.nome || user.username} (${user.email})</p>
            <p><strong>Total:</strong> R$ ${order.valor_total?.toFixed(2)}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            
            <h3>Itens:</h3>
            <div style="background: white; padding: 15px; border-radius: 5px;">
              ${order.items?.map(item => `
                <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                  <strong>${item.product?.nome || 'Produto'}</strong><br>
                  Quantidade: ${item.quantity} | Preço: R$ ${item.unit_price?.toFixed(2)}
                </div>
              `).join('') || '<p>Itens sendo carregados...</p>'}
            </div>

            <p><strong>Endereço de Entrega:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 5px;">
              ${order.shipping_address ? `
                ${order.shipping_address.endereco}, ${order.shipping_address.numero}<br>
                ${order.shipping_address.bairro} - ${order.shipping_address.cidade}/${order.shipping_address.estado}<br>
                CEP: ${order.shipping_address.cep}
              ` : 'Endereço não informado'}
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://api.kairyuutcg.com.br/admin" style="background: #1E40AF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Ver no Admin
              </a>
            </div>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Admin notification sent for order:', order.numero_pedido);
    } catch (error) {
      console.error('Error sending admin notification:', error);
    }
  }

  async notifyAdminCustomOrder(customOrderData) {
    const mailOptions = {
      from: this.fromEmail,
      to: this.adminEmail,
      subject: `🎯 Novo Pedido Personalizado de ${customOrderData.nome}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #9333EA; color: white; padding: 20px; text-align: center;">
            <h1>Novo Pedido Personalizado! 🎯</h1>
          </div>
          <div style="padding: 20px; background: #f8f9fa;">
            <h2>Detalhes do Cliente:</h2>
            <p><strong>Nome:</strong> ${customOrderData.nome}</p>
            <p><strong>Email:</strong> ${customOrderData.email}</p>
            <p><strong>Telefone:</strong> ${customOrderData.telefone}</p>
            
            <h2>Solicitação:</h2>
            <div style="background: white; padding: 15px; border-radius: 5px;">
              ${customOrderData.descricao || 'Descrição não fornecida'}
            </div>

            ${customOrderData.orcamento ? `
              <h2>Orçamento Esperado:</h2>
              <p style="font-size: 18px; color: #16A34A;"><strong>R$ ${customOrderData.orcamento}</strong></p>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:${customOrderData.email}" style="background: #16A34A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Responder Cliente
              </a>
            </div>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Custom order notification sent to admin');
    } catch (error) {
      console.error('Error sending custom order notification:', error);
    }
  }
}

module.exports = new EmailService();