# 🧪 Kaiyruu TCG - Testing Guide

## 🏠 Localhost Testing

### Prerequisites
1. Node.js 20.x installed
2. Asaas account created (even for sandbox)
3. Sandbox API key from Asaas dashboard

### Quick Start
```bash
# Terminal 1 - Start Backend
cd backend
npm run develop

# Terminal 2 - Start Frontend  
cd frontend
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend Admin: http://localhost:1337/admin
- API: http://localhost:1337/api

## 💳 Payment Testing (Localhost)

### 1. Create Test Account
1. Go to http://localhost:3000/cadastro
2. Register with test data:
   - Name: Test User
   - Email: test@example.com
   - Password: 123456

### 2. Test Shopping Flow
1. Browse products: http://localhost:3000
2. Add items to cart
3. Go to cart: http://localhost:3000/carrinho
4. Click "Finalizar Compra"
5. Choose payment method

### 3. Payment Methods Testing

#### PIX Testing
- Choose PIX payment
- You'll get a QR code and PIX code
- **For testing:** Payments expire in 24h
- **Status updates:** Currently manual (webhooks need public URL)

#### Credit Card Testing
```
Test Cards (Asaas Sandbox):
✅ APPROVED: 4000000000000010
❌ REJECTED: 4000000000000002
CVV: Any 3 digits
Expiry: Any future date
Name: Any name
```

#### Boleto Testing
- Choose Boleto
- You'll get a boleto URL
- **For testing:** Boletos auto-approve after 1 minute in sandbox

## 🚀 GCP VM Deployment

### 1. Get Your VM Ready
```bash
# SSH into your GCP VM
gcloud compute ssh your-vm-name

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2
```

### 2. Deploy Your Code
```bash
# On your local machine
./deploy.sh YOUR_GCP_VM_IP

# Copy files to VM (replace with your actual IP)
scp -r . username@YOUR_GCP_VM_IP:~/kaiyruu-tcg/

# SSH into VM
ssh username@YOUR_GCP_VM_IP

# Setup and start
cd kaiyruu-tcg
cd backend && npm install && pm2 start "npm run develop" --name "kaiyruu-backend"
cd ../frontend && npm install && npm run build && pm2 start "npm start" --name "kaiyruu-frontend"
```

### 3. Configure Firewall
```bash
# Allow ports 1337 and 3000
gcloud compute firewall-rules create kaiyruu-backend --allow tcp:1337
gcloud compute firewall-rules create kaiyruu-frontend --allow tcp:3000
```

**Access Your Deployed Site:**
- Frontend: http://YOUR_GCP_VM_IP:3000
- Backend: http://YOUR_GCP_VM_IP:1337/admin

## 🪝 Webhook Configuration

### For Local Testing
**Problem:** Asaas can't reach localhost webhooks
**Solutions:**
1. **ngrok** (recommended for testing):
   ```bash
   # Install ngrok
   npm install -g ngrok
   
   # Expose localhost:1337
   ngrok http 1337
   
   # Use the ngrok URL for webhook:
   # https://abc123.ngrok.io/api/payments/webhook
   ```

2. **Skip webhooks during local testing** (status updates will be manual)

### For GCP VM
**Webhook URL:** `http://YOUR_GCP_VM_IP:1337/api/payments/webhook`

1. Go to Asaas Dashboard → Settings → Webhooks
2. Add webhook URL above
3. Enable events:
   - Payment received
   - Payment confirmed  
   - Payment overdue
   - Payment refunded

## 🧪 Test Scenarios

### Complete Purchase Flow
1. **Register/Login** → **Browse Products** → **Add to Cart**
2. **Checkout** → **Choose Payment** → **Complete Payment**
3. **Check Order Status** in account page

### Payment Status Updates
1. Make a test payment
2. Check status in account: "Aguardando Pagamento"
3. After webhook/manual update: "Processando" or "Confirmado"

### Admin Testing
1. Access backend admin: http://localhost:1337/admin (or VM IP)
2. Check Orders collection - see real orders
3. Check Payments collection - see Asaas integration
4. Check Analytics collection - see user interactions

## 🐛 Troubleshooting

### Common Issues
1. **CORS errors:** Check environment URLs match your setup
2. **Payment fails:** Verify Asaas API key in backend .env
3. **Webhooks not working:** Use ngrok for localhost or check firewall for VM
4. **Database errors:** Delete .tmp/data.db and restart backend

### API Key Issues
```bash
# Check if API key is loaded
cd backend
node -e "console.log(process.env.ASAAS_API_KEY)"
```

### Test API Connection
```bash
# Test Asaas API directly
curl -H "access_token: YOUR_API_KEY" https://sandbox.asaas.com/api/v3/customers
```

## 📊 Monitoring

### Check Logs
```bash
# Backend logs
pm2 logs kaiyruu-backend

# Frontend logs  
pm2 logs kaiyruu-frontend

# All logs
pm2 logs
```

### Database Check
Access Strapi admin → Content Manager to verify:
- Orders are being created
- Payments are being recorded
- Analytics are being tracked

---

**Need help?** Check the console logs in both frontend (browser) and backend (terminal/PM2) for detailed error messages.