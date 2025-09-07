# Reckonix.co.in Domain Deployment Script for Windows EC2
param(
    [string]$MongoDBUrl = "mongodb+srv://vinay:vinay@cluster0.4adl4tl.mongodb.net/reckonix?retryWrites=true&w=majority"
)

Write-Host "🚀 Starting deployment for reckonix.co.in domain on Windows EC2..." -ForegroundColor Green

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script requires Administrator privileges. Please run as Administrator." -ForegroundColor Red
    exit 1
}

# Set environment variables
$env:NODE_ENV = "production"
$env:PORT = "3000"
$env:MONGODB_URL = $MongoDBUrl
$env:DOMAIN = "reckonix.co.in"

Write-Host "📦 Installing Chocolatey package manager..." -ForegroundColor Yellow
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

Write-Host "📦 Installing Node.js..." -ForegroundColor Yellow
choco install nodejs -y

Write-Host "📦 Installing Git..." -ForegroundColor Yellow
choco install git -y

Write-Host "📦 Installing Docker Desktop..." -ForegroundColor Yellow
choco install docker-desktop -y

# Wait for Docker to start
Write-Host "⏳ Waiting for Docker to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

Write-Host "📦 Installing PM2..." -ForegroundColor Yellow
npm install -g pm2

Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm ci --production

Write-Host "🔨 Building application..." -ForegroundColor Yellow
npm run build:fullstack

Write-Host "📁 Creating directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "logs"
New-Item -ItemType Directory -Force -Path "uploads\products"
New-Item -ItemType Directory -Force -Path "uploads\catalogs"
New-Item -ItemType Directory -Force -Path "uploads\gallery"
New-Item -ItemType Directory -Force -Path "uploads\team"
New-Item -ItemType Directory -Force -Path "uploads\resumes"

Write-Host "🔄 Stopping existing services..." -ForegroundColor Yellow
docker-compose -f docker-compose.reckonix.yml down 2>$null

Write-Host "🚀 Starting application with Docker Compose..." -ForegroundColor Yellow
docker-compose -f docker-compose.reckonix.yml up --build -d

Write-Host "⏳ Waiting for application to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Website is now live at: http://13.62.105.14:3000" -ForegroundColor Cyan
Write-Host "🔐 Admin panel: http://13.62.105.14:3000/reckonix/team/admin" -ForegroundColor Cyan
Write-Host "📊 Check status with: docker-compose -f docker-compose.reckonix.yml ps" -ForegroundColor Cyan
Write-Host "📝 View logs with: docker-compose -f docker-compose.reckonix.yml logs" -ForegroundColor Cyan
Write-Host "🔄 Restart with: docker-compose -f docker-compose.reckonix.yml restart" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔧 Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure DNS: reckonix.co.in → 13.62.105.14" -ForegroundColor White
Write-Host "2. Set up SSL certificate with Let's Encrypt" -ForegroundColor White
Write-Host "3. Configure Windows Firewall for ports 80, 443, 3000" -ForegroundColor White
Write-Host "4. Set up monitoring and backups" -ForegroundColor White
