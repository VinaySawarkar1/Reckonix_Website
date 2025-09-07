#!/bin/bash

# AWS EC2 Deployment Script for Reckonix
set -e

echo "🚀 Starting AWS EC2 deployment for Reckonix..."

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

# Install Docker if not present (optional)
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    sudo apt-get install -y docker.io
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker $USER
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
chmod +x aws-deploy.sh

# Stop existing PM2 processes
echo "🔄 Stopping existing processes..."
pm2 stop reckonix-calibration 2>/dev/null || true
pm2 delete reckonix-calibration 2>/dev/null || true

# Start the application with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save
pm2 startup

# Setup nginx (optional)
if command -v nginx &> /dev/null; then
    echo "🌐 Configuring nginx..."
    sudo cp nginx.conf /etc/nginx/nginx.conf
    sudo nginx -t && sudo systemctl reload nginx
fi

# Setup firewall (UFW)
echo "🔥 Configuring firewall..."
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw allow 3000/tcp # Application port
sudo ufw --force enable

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo "🌐 Application is running on port 3000"
echo "📊 Check status with: pm2 status"
echo "📝 View logs with: pm2 logs reckonix-calibration"
echo "🔄 Restart with: pm2 restart reckonix-calibration"
echo ""
echo "🔧 Next steps:"
echo "1. Configure your domain to point to this server"
echo "2. Set up SSL certificates (Let's Encrypt recommended)"
echo "3. Configure nginx for reverse proxy"
echo "4. Set up monitoring and backups"
