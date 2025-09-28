# HTTPS Setup Guide for Reckonix AWS Application

## Problem
Your nginx configuration has syntax errors with malformed proxy headers that are causing nginx to fail to start.

## Solution

### Step 1: Connect to your AWS EC2 instance
```bash
ssh -i "$env:USERPROFILE\Downloads\reckonix.pem" ubuntu@ec2-13-48-10-254.eu-north-1.compute.amazonaws.com
```

### Step 2: Fix the nginx configuration
The current configuration has PowerShell variable syntax that's not being interpreted correctly. Replace the content of `/etc/nginx/sites-enabled/reckonix` with:

```nginx
server {
    listen 80;
    server_name 13.48.10.254;

    # Redirect all HTTP requests to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name 13.48.10.254;

    # SSL configuration
    ssl_certificate /etc/ssl/certs/reckonix.crt;
    ssl_certificate_key /etc/ssl/private/reckonix.key;
    
    # SSL security settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
    }

    location /api/ {
        proxy_pass http://localhost:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
    }
}
```

### Step 3: Generate SSL certificate
```bash
# Install certbot if not already installed
sudo apt update
sudo apt install -y certbot

# Create SSL certificate directory
sudo mkdir -p /etc/ssl/private
sudo mkdir -p /etc/ssl/certs

# Generate self-signed certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/reckonix.key \
    -out /etc/ssl/certs/reckonix.crt \
    -subj '/C=US/ST=State/L=City/O=Reckonix/CN=13.48.10.254'

# Set proper permissions
sudo chmod 600 /etc/ssl/private/reckonix.key
sudo chmod 644 /etc/ssl/certs/reckonix.crt
```

### Step 4: Test and restart nginx
```bash
# Test nginx configuration
sudo nginx -t

# If test passes, restart nginx
sudo systemctl restart nginx

# Check nginx status
sudo systemctl status nginx
```

### Step 5: Verify HTTPS is working
```bash
# Test HTTPS connection
curl -k https://13.48.10.254 -I

# Check if services are running
ps aux | grep -E '(nginx|node|pm2)'
netstat -tlnp | grep -E ':(80|443|3000|5001)'
```

## Alternative: Use Let's Encrypt for proper SSL certificate

If you have a domain name pointing to your server, you can get a free SSL certificate:

```bash
# Install certbot with nginx plugin
sudo apt install -y certbot python3-certbot-nginx

# Get certificate (replace your-domain.com with your actual domain)
sudo certbot --nginx -d your-domain.com --non-interactive --agree-tos --email your-email@example.com
```

## Security Notes

1. The self-signed certificate will show a security warning in browsers
2. For production, use a proper SSL certificate from Let's Encrypt or a commercial CA
3. The configuration includes security headers for better protection
4. All HTTP traffic is redirected to HTTPS

## Troubleshooting

If nginx still fails to start:
1. Check nginx error logs: `sudo tail -f /var/log/nginx/error.log`
2. Verify the configuration syntax: `sudo nginx -t`
3. Make sure your application services are running on ports 3000 and 5001
4. Check firewall settings to ensure ports 80 and 443 are open
