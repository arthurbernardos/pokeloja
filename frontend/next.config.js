/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'pokeloja-backend'],
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
    ],
  },
  env: {
    NEXT_PUBLIC_STRAPI_API_URL: process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api',
    NEXT_PUBLIC_STRAPI_UPLOADS_URL: process.env.NEXT_PUBLIC_STRAPI_UPLOADS_URL || 'http://localhost:1337',
  },
}

module.exports = nextConfig
