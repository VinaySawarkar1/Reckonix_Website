# Windows EC2 Deployment Guide for reckonix.co.in

## Prerequisites
- Windows EC2 instance running (IP: 13.62.105.14)
- RDP access to the instance
- Downloaded .pem file: `C:\Users\lenovo\Downloads\reckonix.pem`

## Step 1: Connect to Your Windows EC2 Instance

### Option A: Using RDP (Recommended)
1. Download the RDP file from AWS Console
2. Double-click the RDP file to connect
3. Use username: `Administrator`
4. Get the password using your .pem file:
   ```powershell
   # In PowerShell on your local machine
   $pemFile = "C:\Users\lenovo\Downloads\reckonix.pem"
   $password = aws ec2 get-password-data --instance-id i-0ec424e0269ffb949 --priv-launch-key $pemFile
   ```

### Option B: Using AWS Systems Manager Session Manager
1. Go to AWS Console → EC2 → Instances
2. Select your instance → Connect → Session Manager
3. Click "Connect"

## Step 2: Prepare the Windows EC2 Instance

Once connected to your Windows instance, run these commands in PowerShell as Administrator:

```powershell
# 1. Install Chocolatey
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# 2. Install required software
choco install nodejs -y
choco install git -y
choco install docker-desktop -y

# 3. Restart the instance to ensure Docker starts properly
Restart-Computer
```

## Step 3: Download and Deploy the Application

After restarting and reconnecting:

```powershell
# 1. Create application directory
mkdir C:\reckonix-app
cd C:\reckonix-app

# 2. Clone the repository
git clone https://github.com/VinaySawarkar1/Reckonix_Website.git .

# 3. Set environment variables
$env:NODE_ENV = "production"
$env:PORT = "3000"
$env:MONGODB_URL = "mongodb+srv://vinay:vinay@cluster0.4adl4tl.mongodb.net/reckonix?retryWrites=true&w=majority"
$env:DOMAIN = "reckonix.co.in"

# 4. Install dependencies
npm ci --production

# 5. Build the application
npm run build:fullstack

# 6. Create necessary directories
New-Item -ItemType Directory -Force -Path "logs"
New-Item -ItemType Directory -Force -Path "uploads\products"
New-Item -ItemType Directory -Force -Path "uploads\catalogs"
New-Item -ItemType Directory -Force -Path "uploads\gallery"
New-Item -ItemType Directory -Force -Path "uploads\team"
New-Item -ItemType Directory -Force -Path "uploads\resumes"

# 7. Start with Docker Compose
docker-compose -f docker-compose.windows.yml up --build -d
```

## Step 4: Configure Windows Firewall

```powershell
# Allow ports through Windows Firewall
New-NetFirewallRule -DisplayName "Reckonix HTTP" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow
New-NetFirewallRule -DisplayName "Reckonix HTTPS" -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow
New-NetFirewallRule -DisplayName "Reckonix App" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
New-NetFirewallRule -DisplayName "Reckonix RDP" -Direction Inbound -Protocol TCP -LocalPort 3389 -Action Allow
```

## Step 5: Configure AWS Security Group

In AWS Console:
1. Go to EC2 → Security Groups
2. Find your instance's security group
3. Add these inbound rules:
   - Type: HTTP, Port: 80, Source: 0.0.0.0/0
   - Type: HTTPS, Port: 443, Source: 0.0.0.0/0
   - Type: Custom TCP, Port: 3000, Source: 0.0.0.0/0
   - Type: RDP, Port: 3389, Source: Your IP

## Step 6: Test the Application

1. **Local test**: http://13.62.105.14:3000
2. **Admin panel**: http://13.62.105.14:3000/reckonix/team/admin
   - Username: `admin`
   - Password: `Reckonix@#$12345`

## Step 7: Configure Domain (Optional)

1. **DNS Configuration**: Point `reckonix.co.in` to `13.62.105.14`
2. **SSL Certificate**: Use Let's Encrypt or your preferred SSL provider

## Troubleshooting

### Check if application is running:
```powershell
docker-compose -f docker-compose.windows.yml ps
```

### View logs:
```powershell
docker-compose -f docker-compose.windows.yml logs
```

### Restart application:
```powershell
docker-compose -f docker-compose.windows.yml restart
```

### Check Windows Firewall:
```powershell
Get-NetFirewallRule -DisplayName "*Reckonix*"
```

## Monitoring Commands

```powershell
# Check Docker status
docker ps

# Check application health
curl http://localhost:3000/health

# View application logs
docker-compose -f docker-compose.windows.yml logs -f
```

## Next Steps

1. ✅ Application deployed and running
2. 🔄 Configure DNS for reckonix.co.in
3. 🔒 Set up SSL certificate
4. 📊 Set up monitoring and backups
5. 📧 Configure email notifications
