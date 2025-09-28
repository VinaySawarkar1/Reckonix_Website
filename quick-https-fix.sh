#!/bin/bash

echo "=== Quick HTTPS Fix for Reckonix ==="

# Backup current nginx config
sudo cp /etc/nginx/sites-enabled/reckonix /etc/nginx/sites-enabled/reckonix.backup

# Create new nginx configuration
sudo tee /etc/nginx/sites-enabled/reckonix > /dev/null << 'EOF'
server {
    listen 80;
    server_name 13.48.10.254;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name 13.48.10.254;

    ssl_certificate /etc/ssl/certs/reckonix.crt;
    ssl_certificate_key /etc/ssl/private/reckonix.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

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
EOF

# Create SSL certificate if it doesn't exist
if [ ! -f /etc/ssl/certs/reckonix.crt ]; then
    echo "Creating SSL certificate..."
    sudo mkdir -p /etc/ssl/private /etc/ssl/certs
    sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/ssl/private/reckonix.key \
        -out /etc/ssl/certs/reckonix.crt \
        -subj '/C=US/ST=State/L=City/O=Reckonix/CN=13.48.10.254'
    sudo chmod 600 /etc/ssl/private/reckonix.key
    sudo chmod 644 /etc/ssl/certs/reckonix.crt
fi

# Test nginx configuration
echo "Testing nginx configuration..."
if sudo nginx -t; then
    echo "Configuration is valid. Restarting nginx..."
    sudo systemctl restart nginx
    echo "Nginx restarted successfully!"
    echo "HTTPS should now be working at: https://13.48.10.254"
    echo "Note: You'll see a security warning due to self-signed certificate"
else
    echo "Nginx configuration test failed!"
    echo "Restoring backup configuration..."
    sudo cp /etc/nginx/sites-enabled/reckonix.backup /etc/nginx/sites-enabled/reckonix
    exit 1
fi
