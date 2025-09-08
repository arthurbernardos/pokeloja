#!/bin/bash

# Generate self-signed SSL certificate for Cloudflare Full mode
# This is only for the connection between Cloudflare and your server
# Users will see Cloudflare's valid certificate

echo "🔐 Generating self-signed SSL certificate for nginx..."

# Create SSL directory
mkdir -p nginx/ssl

# Generate self-signed certificate valid for 10 years
openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
    -keyout nginx/ssl/self-signed.key \
    -out nginx/ssl/self-signed.crt \
    -subj "/C=BR/ST=SP/L=Sao Paulo/O=Kairyuu TCG/CN=kairyuutcg.com.br"

echo "✅ SSL certificate generated successfully!"
echo "📁 Files created:"
echo "   - nginx/ssl/self-signed.crt"
echo "   - nginx/ssl/self-signed.key"