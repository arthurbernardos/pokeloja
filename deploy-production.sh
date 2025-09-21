#!/bin/bash

# Production deployment script
# Usage: ./deploy-production.sh

echo "🚀 Starting PRODUCTION deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create it with production values."
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Verify required variables
if [ -z "$PUBLIC_URL" ] || [ -z "$ASAAS_API_KEY" ] || [ -z "$SMTP_PASS" ]; then
    echo "❌ Missing required environment variables in .env"
    echo "   Required: PUBLIC_URL, ASAAS_API_KEY, SMTP_PASS"
    exit 1
fi

echo "📦 Using production configuration..."
echo "   PUBLIC_URL: $PUBLIC_URL"
echo "   FRONTEND_URL: $FRONTEND_URL"
echo "   NODE_ENV: production"

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Use production docker-compose with overrides
echo "🐳 Starting production containers..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Wait for services
echo "⏳ Waiting for services to start..."
sleep 10

# Check services
if docker-compose ps | grep -q "Up"; then
    echo "✅ Production deployment successful!"
    echo ""
    echo "🌐 Access your store at:"
    echo "   Frontend: $FRONTEND_URL"
    echo "   Admin:    $PUBLIC_URL/admin"
    echo "   API:      $PUBLIC_URL/api"
    echo ""
    echo "📝 Remember to:"
    echo "   - Set up Strapi admin user if first deployment"
    echo "   - Configure public permissions in Strapi admin"
    echo "   - Test payment integration with Asaas"
else
    echo "❌ Some services failed to start. Check logs with:"
    echo "   docker-compose logs"
    exit 1
fi