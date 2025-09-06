# 🌐 Domain Setup for Kaiyuu TCG

## 🎯 **Quick Overview - 3 Options:**

1. **🚀 Simple**: Domain → GCP VM IP (what we'll do first)
2. **⚡ Better**: Google Cloud Load Balancer + SSL
3. **🏆 Best**: Cloudflare + SSL + CDN (recommended)

---

## 🚀 **Option 1: Simple Domain Pointing (Start Here)**

### **Step 1: Buy a Domain**
- **Namecheap**: ~$10/year (.com)
- **Google Domains**: ~$12/year (.com) 
- **Godaddy**: ~$15/year (.com)

### **Step 2: Point Domain to Your GCP VM**

In your domain registrar's DNS settings:

```dns
Type    Name    Value                TTL
A       @       YOUR_GCP_VM_IP       300
A       www     YOUR_GCP_VM_IP       300
```

**Example with `kaiyuutcg.com`:**
```dns
A       @       34.123.45.67         300
A       www     34.123.45.67         300
```

### **Step 3: Update Your Deployment**

```bash
# Deploy with domain instead of IP
./deploy-docker.sh kaiyuutcg.com your_asaas_api_key

# This updates all configs automatically
docker-compose up -d
```

### **Step 4: Test**
- Wait 15-30 minutes for DNS propagation
- Visit: `http://kaiyuutcg.com:3000`
- Admin: `http://kaiyuutcg.com:1337/admin`

---

## ⚡ **Option 2: Google Cloud Load Balancer + SSL**

### **Why This is Better:**
- ✅ Free SSL certificate (HTTPS)
- ✅ No need to specify port numbers
- ✅ Better performance
- ✅ Professional URLs

### **Setup Steps:**

#### **1. Reserve Static IP**
```bash
gcloud compute addresses create kaiyuu-ip --global

# Get the IP
gcloud compute addresses describe kaiyuu-ip --global
```

#### **2. Update DNS to Point to Static IP**
```dns
A       @       YOUR_STATIC_IP       300
A       www     YOUR_STATIC_IP       300
```

#### **3. Create Load Balancer**
```bash
# Create health check
gcloud compute health-checks create http kaiyuu-health-check \
    --port 3000 \
    --request-path /

# Create backend service
gcloud compute backend-services create kaiyuu-backend \
    --protocol HTTP \
    --health-checks kaiyuu-health-check \
    --global

# Add your VM to backend
gcloud compute backend-services add-backend kaiyuu-backend \
    --instance-group your-vm-name \
    --instance-group-zone your-zone \
    --global

# Create URL map
gcloud compute url-maps create kaiyuu-map \
    --default-service kaiyuu-backend

# Create target proxy
gcloud compute target-http-proxies create kaiyuu-proxy \
    --url-map kaiyuu-map

# Create forwarding rule
gcloud compute forwarding-rules create kaiyuu-forwarding-rule \
    --address kaiyuu-ip \
    --global \
    --target-http-proxy kaiyuu-proxy \
    --ports 80
```

---

## 🏆 **Option 3: Cloudflare (Recommended)**

### **Why Cloudflare is Best:**
- ✅ **Free SSL** (automatic HTTPS)
- ✅ **Free CDN** (faster worldwide)
- ✅ **DDoS protection**
- ✅ **Analytics**
- ✅ **Easy setup**
- ✅ **Clean URLs** (no port numbers)

### **Setup Steps:**

#### **1. Buy Domain + Add to Cloudflare**
1. Buy domain from any registrar
2. Go to https://cloudflare.com
3. Add your domain
4. Change nameservers to Cloudflare's

#### **2. Configure DNS in Cloudflare**
```dns
Type    Name    Content           Proxy
A       @       YOUR_GCP_VM_IP    ✅ Proxied
A       www     YOUR_GCP_VM_IP    ✅ Proxied
```

#### **3. Setup Page Rules for Port Forwarding**
In Cloudflare → Page Rules:

```
kaiyuutcg.com/*
- Forwarding URL: 301
- Destination: https://kaiyuutcg.com:3000/$1

kaiyuutcg.com/admin*  
- Forwarding URL: 301
- Destination: https://kaiyuutcg.com:1337/admin$1

kaiyuutcg.com/api/*
- Forwarding URL: 301  
- Destination: https://kaiyuutcg.com:1337/api/$1
```

#### **4. Enable SSL**
Cloudflare → SSL/TLS → Overview:
- Set to **"Flexible"** or **"Full"**
- Enable **"Always Use HTTPS"**

---

## 🔧 **Update Your App for Domain**

### **Update Docker Environment:**
```bash
# For kaiyuutcg.com example
./deploy-docker.sh kaiyuutcg.com your_asaas_api_key
```

### **Manual Configuration:**
Update `.env`:
```env
ASAAS_API_KEY=your_key_here
PUBLIC_URL=https://kaiyuutcg.com
FRONTEND_URL=https://kaiyuutcg.com
```

Update `frontend/.env.local`:
```env
NEXT_PUBLIC_STRAPI_API_URL=https://kaiyuutcg.com/api
NEXT_PUBLIC_STRAPI_UPLOADS_URL=https://kaiyuutcg.com
```

### **Restart Services:**
```bash
docker-compose down
docker-compose up -d
```

---

## 🪝 **Update Asaas Webhook**

Change webhook URL in Asaas dashboard:
- **Old**: `http://34.123.45.67:1337/api/payments/webhook`
- **New**: `https://kaiyuutcg.com/api/payments/webhook`

---

## 🎯 **Recommended Setup for Your TCG Store**

### **Phase 1: Start Simple (Today)**
```bash
# 1. Buy domain (kaiyuutcg.com)
# 2. Point A records to your GCP VM IP
# 3. Deploy with domain
./deploy-docker.sh kaiyuutcg.com your_asaas_api_key
docker-compose up -d
```

**Result**: `http://kaiyuutcg.com:3000`

### **Phase 2: Add Cloudflare (This Week)**  
1. Add domain to Cloudflare
2. Configure DNS and Page Rules
3. Enable SSL
4. Update webhook URL

**Result**: `https://kaiyuutcg.com` (clean, fast, secure)

---

## 📊 **Cost Comparison**

| Option | Setup Time | Monthly Cost | Features |
|--------|------------|--------------|----------|
| **Simple** | 15 minutes | $0 | Basic domain |
| **GCP Load Balancer** | 2 hours | ~$5 | SSL, no ports |
| **Cloudflare** | 30 minutes | $0 | SSL, CDN, DDoS |

**Winner: Cloudflare** 🏆

---

## 🚀 **Ready to Deploy with Domain?**

### **Quick Start:**
1. **Buy domain** (I recommend Namecheap or Google Domains)
2. **Add to Cloudflare** (free account)
3. **Run our script:**
   ```bash
   ./deploy-docker.sh yourdomain.com your_asaas_api_key
   docker-compose up -d
   ```

Your professional TCG store will be live at `https://yourdomain.com` with SSL, CDN, and all features working perfectly! 🎉