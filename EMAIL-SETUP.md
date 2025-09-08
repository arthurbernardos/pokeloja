# 📧 Email Setup Guide for Kairyuu TCG

## Quick Setup Options:

### Option 1: Google Workspace (Recommended - $6/month)
1. Go to https://workspace.google.com
2. Add your domain `kairyuutcg.com.br`
3. Create admin@kairyuutcg.com.br
4. Use these settings in your .env:

```bash
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=admin@kairyuutcg.com.br
SMTP_PASS=your_app_password
ADMIN_EMAIL=admin@kairyuutcg.com.br
FROM_EMAIL=noreply@kairyuutcg.com.br
```

### Option 2: SendGrid (Free tier available)
1. Sign up at https://sendgrid.com
2. Verify your domain
3. Get API key
4. Use these settings:

```bash
# Email Configuration  
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
ADMIN_EMAIL=admin@kairyuutcg.com.br
FROM_EMAIL=noreply@kairyuutcg.com.br
```

### Option 3: Cloudflare Email + SendGrid
1. Set up email forwarding in Cloudflare (free)
2. Forward admin@kairyuutcg.com.br to your Gmail
3. Use SendGrid for sending emails

## Domain Setup (Required for all options):

### 1. Add MX Records in Cloudflare:
For Google Workspace:
```
Type    Name    Content                 Priority
MX      @       smtp.google.com         1
```

For SendGrid:
```
Type    Name    Content                 Priority  
MX      @       mx.sendgrid.net         10
```

### 2. Add SPF Record:
```
Type    Name    Content
TXT     @       "v=spf1 include:_spf.google.com ~all"
```

### 3. Add DKIM Record:
Follow instructions from your email provider.

## Email Features Implemented:

### For Users:
✅ Welcome email when account is created
✅ Order confirmation email
✅ Order status updates (when status changes)
✅ Payment confirmation emails

### For Admins:
✅ New order notifications
✅ Custom order requests
✅ Payment notifications

## Testing Email Setup:

After adding environment variables, restart your backend:
```bash
# Add email vars to your environment
export SMTP_HOST=smtp.gmail.com
export SMTP_PORT=587
export SMTP_USER=your_email@kairyuutcg.com.br
export SMTP_PASS=your_app_password
export ADMIN_EMAIL=admin@kairyuutcg.com.br
export FROM_EMAIL=noreply@kairyuutcg.com.br

# Restart backend
./deploy-vm.sh
```

## Gmail App Password Setup:
1. Enable 2FA on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Generate app password for "Mail"
4. Use that password in SMTP_PASS

## Troubleshooting:
- Make sure domain is verified with your email provider
- Check SPF/DKIM records are correct
- Test with a simple email first
- Check backend logs for email errors

Your customers will now receive professional emails for all important events! 📧