# Reckonix.co.in Domain Configuration

## Domain Setup Instructions

### 1. DNS Configuration
Point your domain `reckonix.co.in` to your AWS EC2 instance:

**A Records:**
- `reckonix.co.in` → `YOUR_EC2_PUBLIC_IP`
- `www.reckonix.co.in` → `YOUR_EC2_PUBLIC_IP`

**CNAME Records (Optional):**
- `www` → `reckonix.co.in`

### 2. SSL Certificate Setup

#### Option A: Let's Encrypt (Recommended)
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d reckonix.co.in -d www.reckonix.co.in

# Auto-renewal setup
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Option B: Custom SSL Certificate
1. Upload your SSL certificate files to:
   - Certificate: `/etc/ssl/certs/reckonix.co.in.crt`
   - Private Key: `/etc/ssl/private/reckonix.co.in.key`

2. Update nginx configuration:
   ```bash
   sudo nano /etc/nginx/nginx.conf
   # Uncomment and update SSL certificate paths
   ```

### 3. Deployment Commands

#### Quick Deployment
```bash
# Clone repository
git clone https://github.com/VinaySawarkar1/Reckonix_Website.git
cd Reckonix_Website

# Set environment variables
export MONGODB_URL="your_mongodb_connection_string"

# Deploy with domain configuration
npm run deploy:reckonix
```

#### Docker Deployment
```bash
# Build and start with domain configuration
npm run docker:reckonix:build

# Or manually
docker-compose -f docker-compose.reckonix.yml up -d
```

### 4. Verification

#### Check Domain Resolution
```bash
# Test DNS resolution
nslookup reckonix.co.in
dig reckonix.co.in

# Test HTTP/HTTPS
curl -I http://reckonix.co.in
curl -I https://reckonix.co.in
```

#### Check SSL Certificate
```bash
# Test SSL certificate
openssl s_client -connect reckonix.co.in:443 -servername reckonix.co.in

# Online SSL test
# Visit: https://www.ssllabs.com/ssltest/
```

### 5. Admin Panel Access

- **URL**: `https://reckonix.co.in/reckonix/team/admin`
- **Username**: `admin`
- **Password**: `Reckonix@#$12345`

### 6. Monitoring

#### Check Application Status
```bash
# Docker services
docker-compose -f docker-compose.reckonix.yml ps

# Application logs
docker-compose -f docker-compose.reckonix.yml logs -f

# Nginx status
sudo systemctl status nginx

# SSL certificate status
sudo certbot certificates
```

#### Health Check
- **Endpoint**: `https://reckonix.co.in/health`
- **Expected Response**: `{"status": "ok", "timestamp": "..."}`

### 7. Security Features

- ✅ HTTPS redirect (HTTP → HTTPS)
- ✅ WWW redirect (www → non-www)
- ✅ Security headers (HSTS, XSS protection, etc.)
- ✅ Rate limiting on API endpoints
- ✅ Admin panel protection
- ✅ SSL certificate auto-renewal

### 8. File Structure

```
/var/www/reckonix/
├── nginx-reckonix.conf          # Domain-specific nginx config
├── docker-compose.reckonix.yml  # Domain-specific docker compose
├── deploy-reckonix.sh          # Domain-specific deployment script
└── ssl/
    ├── reckonix.co.in.crt      # SSL certificate
    └── reckonix.co.in.key      # SSL private key
```

### 9. Troubleshooting

#### Common Issues

1. **SSL Certificate Not Working**
   ```bash
   # Check certificate files
   sudo ls -la /etc/ssl/certs/reckonix.co.in.crt
   sudo ls -la /etc/ssl/private/reckonix.co.in.key
   
   # Test nginx configuration
   sudo nginx -t
   sudo systemctl reload nginx
   ```

2. **Domain Not Resolving**
   ```bash
   # Check DNS propagation
   dig reckonix.co.in @8.8.8.8
   nslookup reckonix.co.in
   ```

3. **Application Not Starting**
   ```bash
   # Check logs
   docker-compose -f docker-compose.reckonix.yml logs
   
   # Restart services
   docker-compose -f docker-compose.reckonix.yml restart
   ```

### 10. Performance Optimization

- ✅ Gzip compression enabled
- ✅ Static file caching (1 year)
- ✅ HTTP/2 support
- ✅ SSL session caching
- ✅ Rate limiting configured
- ✅ Security headers optimized
