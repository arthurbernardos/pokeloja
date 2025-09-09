'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/custom-orders',
      handler: 'custom-orders.create',
      config: {
        auth: false, // Allow public access
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/custom-orders',
      handler: 'custom-orders.info',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    }
  ],
};