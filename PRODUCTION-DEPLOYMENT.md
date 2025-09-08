# 🚀 Production Deployment Guide - kaiyruutcg.com.br

## 📋 **Final URL Structure**
After deployment, your TCG store will be accessible at:

- **🛍️ Main Store**: `https://kaiyruutcg.com.br`
- **⚙️ Admin Panel**: `https://api.kaiyruutcg.com.br/admin`
- **📡 API Endpoint**: `https://api.kaiyruutcg.com.br/api`
- **🪝 Asaas Webhook**: `https://api.kaiyruutcg.com.br/api/payments/webhook`

---

## 🏗️ **Step-by-Step Deployment**

### **Step 1: Buy Domain (registro.br)**
1. Go to https://registro.br
2. Search for `kaiyruutcg.com.br`
3. Complete purchase and registration

### **Step 2: Setup Cloudflare (Free SSL + CDN)**
1. Create account at https://cloudflare.com
2. **Add Site**: Enter `kaiyruutcg.com.br`
3. **Choose Plan**: Free (sufficient for start)
4. **Add DNS Records**:
   ```
   Type    Name    Content           Proxy Status
   A       @       YOUR_GCP_VM_IP    🟠 Proxied
   A       www     YOUR_GCP_VM_IP    🟠 Proxied
   A       api     YOUR_GCP_VM_IP    🟠 Proxied
   ```
5. **Change Nameservers**: Update in registro.br with Cloudflare's nameservers
6. **SSL/TLS Settings**:
   - SSL/TLS → Overview → Set to "Flexible" 
   - SSL/TLS → Edge Certificates → Enable "Always Use HTTPS"

### **Step 3: Create GCP VM**
```bash
# Create production VM
gcloud compute instances create kaiyruu-tcg-prod \
  --zone=us-central1-a \
  --machine-type=e2-medium \
  --boot-disk-size=50GB \
  --boot-disk-type=pd-ssd \
  --image-family=ubuntu-2004-lts \
  --image-project=ubuntu-os-cloud \
  --tags=http-server,https-server

# Allow HTTP/HTTPS traffic
gcloud compute firewall-rules create kaiyruu-web-ports \
  --allow tcp:80,tcp:443,tcp:3000,tcp:1337 \
  --source-ranges 0.0.0.0/0 \
  --description "Allow web traffic for Kaiyruu TCG"

# Get external IP
gcloud compute instances describe kaiyruu-tcg-prod \
  --zone=us-central1-a \
  --format="value(networkInterfaces[0].accessConfigs[0].natIP)"
```

### **Step 4: Server Setup**
```bash
# SSH into VM
gcloud compute ssh kaiyruu-tcg-prod --zone=us-central1-a

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for Docker permissions
exit
```

### **Step 5: Deploy Application**
```bash
# SSH back in
gcloud compute ssh kaiyruu-tcg-prod --zone=us-central1-a

# Clone repository
git clone https://github.com/yourusername/kaiyruu-tcg.git
cd kaiyruu-tcg

# Set up production environment
./deploy-docker.sh kaiyruutcg.com.br YOUR_ASAAS_PRODUCTION_API_KEY

# Start production services
docker-compose -f docker-compose.prod.yml up -d

# Check if everything is running
docker-compose -f docker-compose.prod.yml ps
```

### **Step 6: Configure Asaas Webhook**
1. Login to your Asaas dashboard
2. Go to **Settings → Webhooks**
3. **Add Webhook URL**: `https://api.kaiyruutcg.com.br/api/payments/webhook`
4. **Enable Events**:
   - ✅ Payment received
   - ✅ Payment confirmed  
   - ✅ Payment overdue
   - ✅ Payment cancelled

### **Step 7: Create Admin User**
```bash
# SSH into your VM
gcloud compute ssh kaiyruu-tcg-prod --zone=us-central1-a

# Enter backend container
docker exec -it kaiyruu-backend-prod bash

# Create admin user
npm run strapi admin:create-user -- \
  --firstname="Admin" \
  --lastname="Kaiyruu" \
  --email="admin@kaiyruutcg.com.br" \
  --password="YourStrongPassword123!"

# Exit container
exit
```

---

## ✅ **Verification Checklist**

### **Frontend (Store) - https://kaiyruutcg.com.br**
- [ ] Homepage loads correctly
- [ ] Product catalog displays cards  
- [ ] User registration works with validation
- [ ] User login/logout functions
- [ ] Cart functionality works
- [ ] Checkout process completes
- [ ] Toast notifications appear
- [ ] All images load properly

### **Backend (API) - https://api.kaiyruutcg.com.br**
- [ ] Admin panel accessible at `/admin`
- [ ] Can login to admin panel
- [ ] API endpoints respond at `/api`
- [ ] Database contains sample products
- [ ] File uploads work
- [ ] Payment endpoints respond

### **Payment System**
- [ ] PIX payment creates QR code
- [ ] Credit card validation works  
- [ ] Boleto generation works
- [ ] Webhook receives payment updates
- [ ] Orders created in admin panel
- [ ] Email notifications sent (if configured)

---

## 🔧 **Maintenance Commands**

### **View Logs**
```bash
# All services
docker-compose -f docker-compose.prod.yml logs

# Specific service
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend
```

### **Update Application**
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### **Database Backup**
```bash
# Create backup
docker exec kaiyruu-db-prod pg_dump -U kaiyruu_user kaiyruu_tcg > backup_$(date +%Y%m%d).sql

# Restore backup
cat backup_20240101.sql | docker exec -i kaiyruu-db-prod psql -U kaiyruu_user kaiyruu_tcg
```

### **SSL Certificate Renewal (if not using Cloudflare)**
```bash
# Using Let's Encrypt (if you decide not to use Cloudflare)
certbot --nginx -d kaiyruutcg.com.br -d api.kaiyruutcg.com.br
```

---

## 🚀 **Go Live Process**

1. **Complete all steps above** ✅
2. **Test thoroughly** on https://kaiyruutcg.com.br ✅
3. **Add products** via admin panel ✅
4. **Test payments** with Asaas sandbox → switch to production ✅
5. **Configure email delivery** (optional) ✅
6. **Set up monitoring** (optional) ✅

---

## 🎯 **Production Checklist**

### **Security**
- [ ] Changed all default passwords
- [ ] Updated JWT secrets in production
- [ ] HTTPS enabled via Cloudflare
- [ ] Rate limiting configured
- [ ] CORS properly configured

### **Performance**  
- [ ] Nginx caching enabled
- [ ] Image optimization working
- [ ] Database indexed properly
- [ ] CDN enabled via Cloudflare

### **Monitoring**
- [ ] Server monitoring (optional: Uptime Robot)
- [ ] Error tracking (optional: Sentry)
- [ ] Performance monitoring (optional)

---

## 🆘 **Troubleshooting**

### **Site not loading**
1. Check DNS propagation: https://whatsmydns.net/
2. Verify Cloudflare DNS settings
3. Check VM is running: `gcloud compute instances list`

### **API errors**
```bash
# Check backend logs
docker-compose -f docker-compose.prod.yml logs backend

# Check database connection
docker exec kaiyruu-db-prod psql -U kaiyruu_user -d kaiyruu_tcg -c "SELECT version();"
```

### **Payment issues**
1. Verify Asaas API key is production key
2. Check webhook URL in Asaas dashboard
3. Test webhook: `curl -X POST https://api.kaiyruutcg.com.br/api/payments/webhook`

---

## 📞 **Support**

Your production TCG store will be live at **https://kaiyruutcg.com.br** with professional SSL, fast CDN, and payment processing ready! 🎉

**Estimated Setup Time**: 2-3 hours
**Monthly Costs**: 
- Domain: ~R$30/year
- GCP VM: ~R$30-50/month  
- Cloudflare: Free
- **Total**: ~R$30-50/month