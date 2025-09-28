#!/bin/bash

# Setup proper SSL certificate with Let's Encrypt
# Usage: ./setup-proper-ssl.sh yourdomain.com

if [ -z "$1" ]; then
    echo "Usage: $0 <your-domain.com>"
    echo "Example: $0 myapp.tk"
    exit 1
fi

DOMAIN=$1

echo "Setting up SSL certificate for domain: $DOMAIN"

# Install certbot if not already installed
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Create temporary HTTP-only nginx config
sudo tee /etc/nginx/sites-available/reckonix-temp > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /api/ {
        proxy_pass http://localhost:5001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable temporary config
sudo cp /etc/nginx/sites-available/reckonix-temp /etc/nginx/sites-enabled/reckonix
sudo nginx -t && sudo systemctl reload nginx

# Get SSL certificate
echo "Getting SSL certificate from Let's Encrypt..."
sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

# Check if certificate was created
if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "✅ SSL certificate created successfully!"
    echo "Your site is now available at: https://$DOMAIN"
    echo "Certificate will auto-renew every 90 days"
else
    echo "❌ Failed to create SSL certificate"
    echo "Make sure:"
    echo "1. Domain $DOMAIN points to this server IP"
    echo "2. Ports 80 and 443 are open in firewall"
    echo "3. DNS has propagated (wait 5-30 minutes)"
fi





