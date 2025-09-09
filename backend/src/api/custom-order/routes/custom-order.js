'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/custom-orders',
      handler: 'custom-order.create',
      config: {
        policies: [],
        middlewares: [],
        auth: false, // Allow anonymous custom orders
      },
    }
  ],
};