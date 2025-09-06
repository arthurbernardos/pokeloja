/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  images: {
    domains: ['localhost', 'pokeloja-backend', 'api.kaiyuutcg.com.br'],
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
        protocol: 'https',
        hostname: 'api.kaiyuutcg.com.br',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_STRAPI_API_URL: process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api',
    NEXT_PUBLIC_STRAPI_UPLOADS_URL: process.env.NEXT_PUBLIC_STRAPI_UPLOADS_URL || 'http://localhost:1337',
  },
}

module.exports = nextConfig
