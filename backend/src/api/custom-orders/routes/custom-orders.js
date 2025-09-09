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
    }
  ],
};