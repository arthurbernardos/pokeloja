#!/bin/bash

# Kaiyuu TCG Deployment Script for GCP VM
# Usage: ./deploy.sh [VM_IP] [optional: production]

VM_IP=$1
IS_PRODUCTION=$2

if [ -z "$VM_IP" ]; then
    echo "Usage: ./deploy.sh YOUR_GCP_VM_IP [production]"
    echo "Example: ./deploy.sh 34.123.45.67 production"
    exit 1
fi

echo "🚀 Deploying Kaiyuu TCG to GCP VM: $VM_IP"

# Update frontend environment
echo "📝 Updating frontend configuration..."
cat > frontend/.env.local << EOF
NEXT_PUBLIC_STRAPI_API_URL=http://$VM_IP:1337/api
NEXT_PUBLIC_STRAPI_UPLOADS_URL=http://$VM_IP:1337
EOF

# Update backend environment
echo "📝 Updating backend configuration..."
if [ "$IS_PRODUCTION" == "production" ]; then
    cat > backend/.env << EOF
DATABASE_CLIENT=better-sqlite3
DATABASE_FILENAME=.tmp/data.db
HOST=0.0.0.0
PORT=1337
APP_KEYS=strapi-app-key-1,strapi-app-key-2,strapi-app-key-3,strapi-app-key-4
API_TOKEN_SALT=api-token-salt-here
ADMIN_JWT_SECRET=admin-jwt-secret-here
TRANSFER_TOKEN_SALT=transfer-token-salt-here
JWT_SECRET=jwt-secret-here
ASAAS_API_KEY=YOUR_PRODUCTION_ASAAS_API_KEY_HERE
NODE_ENV=production
PUBLIC_URL=http://$VM_IP:1337
FRONTEND_URL=http://$VM_IP:3000
EOF
    echo "⚠️  Remember to replace YOUR_PRODUCTION_ASAAS_API_KEY_HERE with your actual production API key!"
else
    cat > backend/.env << EOF
DATABASE_CLIENT=better-sqlite3
DATABASE_FILENAME=.tmp/data.db
HOST=0.0.0.0
PORT=1337
APP_KEYS=strapi-app-key-1,strapi-app-key-2,strapi-app-key-3,strapi-app-key-4
API_TOKEN_SALT=api-token-salt-here
ADMIN_JWT_SECRET=admin-jwt-secret-here
TRANSFER_TOKEN_SALT=transfer-token-salt-here
JWT_SECRET=jwt-secret-here
ASAAS_API_KEY=aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAwMDAwMDA6OiRhYXNfMGU5MzE4YmEtNDY0Yy00NGY0LWFlYzQtOWNkZGE4NzY0YTE3
NODE_ENV=development
PUBLIC_URL=http://$VM_IP:1337
FRONTEND_URL=http://$VM_IP:3000
EOF
    echo "🧪 Using sandbox mode for testing"
fi

echo "✅ Configuration updated for VM IP: $VM_IP"
echo "📦 Next steps:"
echo "   1. Copy files to your GCP VM"
echo "   2. Run 'npm install' in both frontend and backend directories"
echo "   3. Start backend: 'npm run develop' (or 'npm start' for production)"
echo "   4. Start frontend: 'npm run dev' (or 'npm run build && npm start' for production)"
echo "   5. Configure Asaas webhook: http://$VM_IP:1337/api/payments/webhook"