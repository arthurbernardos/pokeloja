module.exports = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:', 'http:', 'https://kairyuutcg.com.br', 'http://kairyuutcg.com.br'],
          'img-src': ["'self'", 'data:', 'blob:', 'https://market-assets.strapi.io'],
          'media-src': ["'self'", 'data:', 'blob:'],
          'frame-src': ["'self'"],
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      header: '*',
      origin: [
        'http://localhost:3000', 
        'http://frontend:3000',
        'http://localhost:1337',
        'http://127.0.0.1:1337',
        'https://kairyuutcg.com.br',
        'http://kairyuutcg.com.br',
        'http://34.68.228.15',
        'https://34.68.228.15'
      ]
    }
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
