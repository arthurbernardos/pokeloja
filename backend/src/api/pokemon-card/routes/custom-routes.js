module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/pokemon-cards/stats',
      handler: 'pokemon-card.stats',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/pokemon-cards/search',
      handler: 'pokemon-card.search',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/pokemon-cards/featured',
      handler: 'pokemon-card.featured',
      config: {
        auth: false,
      },
    }
  ]
};
