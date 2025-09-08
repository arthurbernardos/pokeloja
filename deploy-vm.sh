#!/bin/bash

# Deploy script that works with any VM IP
# Usage: ./deploy-vm.sh [ASAAS_API_KEY]

echo "🚀 Starting deployment..."

# Check if ASAAS API key is provided
if [ -n "$1" ]; then
    export ASAAS_API_KEY="$1"
    echo "🔑 Using provided Asaas API key"
elif [ -z "$ASAAS_API_KEY" ]; then
    echo "⚠️  Warning: No Asaas API key provided. Payment features will not work."
    echo "   Usage: ./deploy-vm.sh YOUR_ASAAS_API_KEY"
    echo "   Or set: export ASAAS_API_KEY=your_key"
fi

# Get current external IP
CURRENT_IP=$(curl -s ifconfig.me || curl -s ipinfo.io/ip)

if [ -z "$CURRENT_IP" ]; then
    echo "❌ Could not detect external IP. Please check your internet connection."
    exit 1
fi

echo "🌐 Detected IP: $CURRENT_IP"

# Set environment variables for backend
export PUBLIC_URL="http://$CURRENT_IP"
export FRONTEND_URL="http://$CURRENT_IP"

# Update Next.js config with current IP
echo "⚙️  Updating Next.js configuration..."
sed -i "s/domains: \[.*\]/domains: ['localhost', 'pokeloja-backend', 'api.kaiyruutcg.com.br', '$CURRENT_IP']/" frontend/next.config.js

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
        hostname: 'api.kaiyruutcg.com.br',
      },
    ],
EOF

echo "🐳 Starting Docker containers..."

# Stop existing containers
docker compose down

# Start containers
docker compose up -d

echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker compose ps | grep -q "Up"; then
    echo "✅ Deployment successful!"
    echo ""
    echo "🌐 Access your store at:"
    echo "   Frontend: http://$CURRENT_IP"
    echo "   Admin:    http://$CURRENT_IP/admin"
    echo "   API:      http://$CURRENT_IP/api"
    echo ""
    echo "🔗 When domain is ready: https://kaiyruutcg.com.br"
else
    echo "❌ Some services failed to start. Check logs with: docker compose logs"
    exit 1
fi