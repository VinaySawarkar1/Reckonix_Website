#!/bin/bash

# Reckonix.co.in Domain Deployment Script
set -e

echo "🚀 Starting deployment for reckonix.co.in domain..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running on EC2
if [ ! -f /sys/hypervisor/uuid ] || [ `head -c 3 /sys/hypervisor/uuid` != "ec2" ]; then
    echo -e "${YELLOW}⚠️  Warning: This script is designed to run on AWS EC2 instances${NC}"
fi

# Check if required environment variables are set
if [ -z "$MONGODB_URL" ]; then
    echo -e "${RED}❌ Error: MONGODB_URL environment variable is required${NC}"
    echo "Please set it with: export MONGODB_URL='your_mongodb_connection_string'"
    exit 1
fi

# Update system packages
echo "📦 Updating system packages..."
sudo apt-get update -y

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 if not present
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    sudo npm install -g pm2
fi

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    sudo apt-get install -y docker.io
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker $USER
fi

# Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null; then
    echo "📦 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Install Nginx if not present
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing Nginx..."
    sudo apt-get install -y nginx
fi

# Install Certbot for SSL certificates
if ! command -v certbot &> /dev/null; then
    echo "📦 Installing Certbot for SSL certificates..."
    sudo apt-get install -y certbot python3-certbot-nginx
fi

# Install dependencies
echo "📦 Installing application dependencies..."
npm ci --production

# Build the application
echo "🔨 Building application..."
npm run build:fullstack

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p logs
mkdir -p uploads/products
mkdir -p uploads/catalogs
mkdir -p uploads/gallery
mkdir -p uploads/team
mkdir -p uploads/resumes

# Set proper permissions
chmod +x deploy.sh
chmod +x deploy-reckonix.sh

# Stop existing services
echo "🔄 Stopping existing services..."
sudo systemctl stop nginx 2>/dev/null || true
docker-compose -f docker-compose.reckonix.yml down 2>/dev/null || true

# Setup SSL certificates
echo "🔒 Setting up SSL certificates..."
if [ ! -f "/etc/ssl/certs/reckonix.co.in.crt" ]; then
    echo "📋 Obtaining SSL certificate for reckonix.co.in..."
    sudo certbot --nginx -d reckonix.co.in -d www.reckonix.co.in --non-interactive --agree-tos --email admin@reckonix.co.in
else
    echo "✅ SSL certificate already exists"
fi

# Copy nginx configuration
echo "🌐 Configuring Nginx for reckonix.co.in..."
sudo cp nginx-reckonix.conf /etc/nginx/nginx.conf
sudo nginx -t && sudo systemctl reload nginx

# Start the application with Docker Compose
echo "🚀 Starting application with Docker Compose..."
docker-compose -f docker-compose.reckonix.yml up -d

# Setup firewall (UFW)
echo "🔥 Configuring firewall..."
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw allow 3000/tcp # Application port
sudo ufw --force enable

# Setup SSL certificate auto-renewal
echo "🔄 Setting up SSL certificate auto-renewal..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo "🌐 Website is now live at: https://reckonix.co.in"
echo "🔐 Admin panel: https://reckonix.co.in/reckonix/team/admin"
echo "📊 Check status with: docker-compose -f docker-compose.reckonix.yml ps"
echo "📝 View logs with: docker-compose -f docker-compose.reckonix.yml logs"
echo "🔄 Restart with: docker-compose -f docker-compose.reckonix.yml restart"
echo ""
echo "🔧 Next steps:"
echo "1. Verify DNS settings point to this server's IP"
echo "2. Test SSL certificate: https://www.ssllabs.com/ssltest/"
echo "3. Set up monitoring and backups"
echo "4. Configure email notifications"
