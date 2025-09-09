'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/analytics/popular-categories',
      handler: 'analytics.getPopularCategories',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/analytics/track',
      handler: 'analytics.track',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};