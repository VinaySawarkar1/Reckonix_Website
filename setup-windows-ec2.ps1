# Reckonix Application Setup Script for Windows EC2
# Run this script on your Windows EC2 instance as Administrator

Write-Host "🚀 Setting up Reckonix application on Windows EC2..." -ForegroundColor Green

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script requires Administrator privileges. Please run as Administrator." -ForegroundColor Red
    exit 1
}

# Set execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force

# Install Chocolatey if not present
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Installing Chocolatey..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
}

# Install required software
Write-Host "📦 Installing Node.js..." -ForegroundColor Yellow
choco install nodejs -y

Write-Host "📦 Installing Git..." -ForegroundColor Yellow
choco install git -y

Write-Host "📦 Installing Docker Desktop..." -ForegroundColor Yellow
choco install docker-desktop -y

# Refresh environment variables
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host "⏳ Waiting for Docker to install..." -ForegroundColor Yellow
Start-Sleep -Seconds 60

# Create application directory
$appDir = "C:\reckonix-app"
if (Test-Path $appDir) {
    Remove-Item $appDir -Recurse -Force
}
New-Item -ItemType Directory -Path $appDir -Force
Set-Location $appDir

Write-Host "📥 Cloning repository..." -ForegroundColor Yellow
git clone https://github.com/VinaySawarkar1/Reckonix_Website.git .

# Set environment variables
$env:NODE_ENV = "production"
$env:PORT = "3000"
$env:MONGODB_URL = "mongodb+srv://vinay:vinay@cluster0.4adl4tl.mongodb.net/reckonix?retryWrites=true&w=majority"
$env:DOMAIN = "reckonix.co.in"

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

# Configure Windows Firewall
Write-Host "🔥 Configuring Windows Firewall..." -ForegroundColor Yellow
New-NetFirewallRule -DisplayName "Reckonix HTTP" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow -ErrorAction SilentlyContinue
New-NetFirewallRule -DisplayName "Reckonix HTTPS" -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow -ErrorAction SilentlyContinue
New-NetFirewallRule -DisplayName "Reckonix App" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow -ErrorAction SilentlyContinue
New-NetFirewallRule -DisplayName "Reckonix RDP" -Direction Inbound -Protocol TCP -LocalPort 3389 -Action Allow -ErrorAction SilentlyContinue

Write-Host "⏳ Waiting for Docker to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

Write-Host "🚀 Starting application..." -ForegroundColor Yellow
docker-compose -f docker-compose.windows.yml up --build -d

Write-Host "⏳ Waiting for application to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

Write-Host "✅ Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Your application is now running at:" -ForegroundColor Cyan
Write-Host "   http://13.62.105.14:3000" -ForegroundColor White
Write-Host ""
Write-Host "🔐 Admin panel:" -ForegroundColor Cyan
Write-Host "   http://13.62.105.14:3000/reckonix/team/admin" -ForegroundColor White
Write-Host "   Username: admin" -ForegroundColor White
Write-Host "   Password: Reckonix@#$12345" -ForegroundColor White
Write-Host ""
Write-Host "📊 Useful commands:" -ForegroundColor Yellow
Write-Host "   Check status: docker-compose -f docker-compose.windows.yml ps" -ForegroundColor White
Write-Host "   View logs: docker-compose -f docker-compose.windows.yml logs" -ForegroundColor White
Write-Host "   Restart: docker-compose -f docker-compose.windows.yml restart" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure DNS: reckonix.co.in → 13.62.105.14" -ForegroundColor White
Write-Host "2. Set up SSL certificate" -ForegroundColor White
Write-Host "3. Configure AWS Security Group for ports 80, 443, 3000" -ForegroundColor White

Read-Host "Press Enter to continue"
