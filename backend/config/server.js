module.exports = ({ env }) => {
  const isProduction = env('NODE_ENV') === 'production';
  const publicUrl = env('PUBLIC_URL', 'http://localhost:1337');
  
  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    url: publicUrl,
    proxy: {
      enabled: true,
      ssl: true, // Force SSL when behind proxy
      host: 'kairyuutcg.com.br',
      port: 443,
    },
    app: {
      keys: env.array('APP_KEYS'),
    },
    webhooks: {
      populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
    },
  };
};
