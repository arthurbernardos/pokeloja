'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/payments/pix',
      handler: 'payment.createPixPayment',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: ['authenticated']
        }
      },
    },
    {
      method: 'POST',
      path: '/payments/credit-card',
      handler: 'payment.createCreditCardPayment',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: ['authenticated']
        }
      },
    },
    {
      method: 'POST',
      path: '/payments/boleto',
      handler: 'payment.createBoletoPayment',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: ['authenticated']
        }
      },
    },
    {
      method: 'POST',
      path: '/payments/webhook',
      handler: 'payment.handleWebhook',
      config: {
        policies: [],
        middlewares: [],
        auth: false, // Webhooks don't require authentication
      },
    },
    {
      method: 'GET',
      path: '/payments/:paymentId/status',
      handler: 'payment.getPaymentStatus',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};