'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/analytics/popular-categories',
      handler: 'analytics.getPopularCategories',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/analytics/track',
      handler: 'analytics.track',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};