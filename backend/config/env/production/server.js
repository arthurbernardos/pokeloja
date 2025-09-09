module.exports = ({ env }) => ({
  url: env('PUBLIC_URL', 'https://kairyuutcg.com.br'),
  proxy: {
    enabled: true,
    ssl: true,
    host: 'kairyuutcg.com.br',
    port: 443,
  },
});