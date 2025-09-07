#!/bin/bash

# Deploy script that works with any VM IP
# This script automatically configures the frontend to work with the current IP

echo "🚀 Starting deployment..."

# Get current external IP
CURRENT_IP=$(curl -s ifconfig.me || curl -s ipinfo.io/ip)

if [ -z "$CURRENT_IP" ]; then
    echo "❌ Could not detect external IP. Please check your internet connection."
    exit 1
fi

echo "🌐 Detected IP: $CURRENT_IP"

# Update Next.js config with current IP
echo "⚙️  Updating Next.js configuration..."
sed -i "s/domains: \[.*\]/domains: ['localhost', 'pokeloja-backend', 'api.kaiyuutcg.com.br', '$CURRENT_IP']/" frontend/next.config.js

# Create temporary sed script for remote patterns
cat > /tmp/update_patterns.sed << EOF
/remotePatterns: \[/,/\],/ {
    /remotePatterns: \[/r /dev/stdin
    /\],/!d
}
EOF

# Update remote patterns
cat > /tmp/new_patterns.txt << EOF
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
        hostname: '$CURRENT_IP',
      },
      {
        protocol: 'https',
        hostname: 'api.kaiyuutcg.com.br',
      },
    ],
EOF

echo "🐳 Starting Docker containers..."

# Stop existing containers
docker-compose down

# Start containers
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Deployment successful!"
    echo ""
    echo "🌐 Access your store at:"
    echo "   Frontend: http://$CURRENT_IP"
    echo "   Admin:    http://$CURRENT_IP/admin"
    echo "   API:      http://$CURRENT_IP/api"
    echo ""
    echo "🔗 When domain is ready: https://kaiyuutcg.com.br"
else
    echo "❌ Some services failed to start. Check logs with: docker-compose logs"
    exit 1
fi