/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
      },
      {
        protocol: 'http',
        hostname: 'backend',
        port: '1337',
      },
      {
        protocol: 'http',
        hostname: 'pokeloja-backend',
      },
      {
        protocol: 'http',
        hostname: '35.223.253.42',
      },
      {
        protocol: 'https',
        hostname: 'api.kairyuutcg.com.br',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_STRAPI_API_URL: process.env.NEXT_PUBLIC_STRAPI_API_URL || '/api',
    NEXT_PUBLIC_STRAPI_UPLOADS_URL: process.env.NEXT_PUBLIC_STRAPI_UPLOADS_URL || '',
  },
}

module.exports = nextConfig
