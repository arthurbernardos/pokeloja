module.exports = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:', 'http:', 'https://kairyuutcg.com.br', 'http://kairyuutcg.com.br', 'https://api.kairyuutcg.com.br', 'https://analytics.strapi.io'],
          'img-src': ["'self'", 'data:', 'blob:', 'https://market-assets.strapi.io', 'https://strapi.io'],
          'media-src': ["'self'", 'data:', 'blob:'],
          'frame-src': ["'self'"],
          'script-src': ["'self'", "'unsafe-inline'"],
          'style-src': ["'self'", "'unsafe-inline'"],
          'font-src': ["'self'", 'data:'],
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
        'https://api.kairyuutcg.com.br',
        'http://api.kairyuutcg.com.br',
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
