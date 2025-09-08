#!/bin/bash

# Kaiyruu TCG Docker Deployment Script
# Usage: ./deploy-docker.sh [DOMAIN_OR_IP] [ASAAS_API_KEY] [ENVIRONMENT]

DOMAIN_OR_IP=$1
ASAAS_API_KEY=$2
ENVIRONMENT=${3:-production}

echo "🐳 Deploying Kaiyruu TCG with Docker"

if [ -z "$DOMAIN_OR_IP" ]; then
    echo "📍 Setting up for localhost testing..."
    cat > .env << EOF
NODE_ENV=development
ASAAS_API_KEY=${ASAAS_API_KEY:-aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAwMDAwMDA6OiRhYXNfMGU5MzE4YmEtNDY0Yy00NGY0LWFlYzQtOWNkZGE4NzY0YTE3}
PUBLIC_URL=http://localhost:1337
FRONTEND_URL=http://localhost:3000
EOF
    
    cat > frontend/.env.local << EOF
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337/api
NEXT_PUBLIC_STRAPI_UPLOADS_URL=http://localhost:1337
EOF
    
    echo "✅ Localhost configuration created"
    echo "🚀 Run: docker-compose up -d"
    echo "🌐 Access: http://localhost:3000"
    echo "⚙️  Admin: http://localhost:1337/admin"
else
    # Detect if it's kaiyruutcg.com.br (production)
    if [[ $DOMAIN_OR_IP == "kaiyruutcg.com.br" ]]; then
        echo "🌐 Setting up for PRODUCTION: $DOMAIN_OR_IP"
        
        cat > .env << EOF
NODE_ENV=production
ASAAS_API_KEY=$ASAAS_API_KEY
PUBLIC_URL=https://api.kaiyruutcg.com.br
FRONTEND_URL=https://kaiyruutcg.com.br
EOF
        
        cat > frontend/.env.local << EOF
NEXT_PUBLIC_STRAPI_API_URL=https://api.kaiyruutcg.com.br/api
NEXT_PUBLIC_STRAPI_UPLOADS_URL=https://api.kaiyruutcg.com.br
EOF
        
        echo "✅ Production configuration created for kaiyruutcg.com.br"
        echo "🚀 Run: docker-compose -f docker-compose.prod.yml up -d"
        echo "🌐 Store: https://kaiyruutcg.com.br"
        echo "⚙️  Admin: https://api.kaiyruutcg.com.br/admin"
        echo "📡 API: https://api.kaiyruutcg.com.br/api"
        echo "🪝 Webhook: https://api.kaiyruutcg.com.br/api/payments/webhook"
        
    # Detect if it's an IP address (testing)
    elif [[ $DOMAIN_OR_IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        echo "📍 Setting up for GCP VM IP: $DOMAIN_OR_IP"
        
        cat > .env << EOF
NODE_ENV=development
ASAAS_API_KEY=$ASAAS_API_KEY
PUBLIC_URL=http://$DOMAIN_OR_IP:1337
FRONTEND_URL=http://$DOMAIN_OR_IP:3000
EOF
        
        cat > frontend/.env.local << EOF
NEXT_PUBLIC_STRAPI_API_URL=http://$DOMAIN_OR_IP:1337/api
NEXT_PUBLIC_STRAPI_UPLOADS_URL=http://$DOMAIN_OR_IP:1337
EOF
        
        echo "✅ IP configuration created for: $DOMAIN_OR_IP"
        echo "🚀 Run: docker-compose up -d"
        echo "🌐 Access: http://$DOMAIN_OR_IP:3000"
        echo "⚙️  Admin: http://$DOMAIN_OR_IP:1337/admin"
        echo "🪝 Webhook: http://$DOMAIN_OR_IP:1337/api/payments/webhook"
    else
        echo "❌ Unknown domain format: $DOMAIN_OR_IP"
        echo "💡 Use: kaiyruutcg.com.br (production) or IP address (testing)"
        exit 1
    fi
fi

echo ""
echo "📋 Next Steps:"
echo "1. Run 'docker-compose up -d' to start all services"
echo "2. Wait 2-3 minutes for services to start"
echo "3. Create admin user at the admin URL above"
echo "4. Configure Asaas webhook in your Asaas dashboard"
echo ""
echo "💳 Test Credit Card: 4000000000000010"
echo "🧪 Test PIX: Use any CPF like 11144477735"