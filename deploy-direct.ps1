# Direct AWS Deployment - Fast Version
param(
    [string]$EC2IP = "3.110.123.45"  # Replace with your actual EC2 IP
)

$KeyPath = "C:\Users\lenovo\Downloads\Reckonixfinal.pem"
$Username = "ubuntu"

Write-Host "Deploying to EC2: $EC2IP" -ForegroundColor Green

# Test connection
ssh -i $KeyPath -o ConnectTimeout=5 -o StrictHostKeyChecking=no ${Username}@${EC2IP} "echo 'Connected'"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Connection failed. Please check your EC2 IP and ensure:" -ForegroundColor Red
    Write-Host "1. EC2 instance is running" -ForegroundColor Yellow
    Write-Host "2. Security group allows SSH from your IP" -ForegroundColor Yellow
    Write-Host "3. Update the EC2IP in this script with your actual IP" -ForegroundColor Yellow
    exit 1
}

# Create and upload package
Write-Host "Creating deployment package..." -ForegroundColor Yellow
Compress-Archive -Path @("package.json", "package-lock.json", "tsconfig.json", "vite.config.ts", "tailwind.config.ts", "postcss.config.js", "ecosystem.config.js", "Dockerfile", "docker-compose.reckonix.yml", "nginx-reckonix.conf", "server", "client", "shared", "prisma", "uploads") -DestinationPath "deploy.zip" -Force

Write-Host "Uploading..." -ForegroundColor Yellow
scp -i $KeyPath -o StrictHostKeyChecking=no deploy.zip ${Username}@${EC2IP}:/home/${Username}/

# Deploy on server
Write-Host "Deploying on server..." -ForegroundColor Yellow
ssh -i $KeyPath -o StrictHostKeyChecking=no ${Username}@${EC2IP} @"
sudo apt-get update -y
sudo apt-get install -y unzip docker.io docker-compose nginx
sudo systemctl start docker
sudo usermod -aG docker \$USER

unzip -o deploy.zip -d reckonix-app/
cd reckonix-app/

if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

npm ci --production
npm run build:fullstack

mkdir -p logs uploads/products uploads/catalogs uploads/gallery uploads/team uploads/resumes

sudo cp nginx-reckonix.conf /etc/nginx/nginx.conf
sudo nginx -t && sudo systemctl reload nginx

docker-compose -f docker-compose.reckonix.yml up -d

sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw --force enable

echo 'Deployment complete!'
echo 'Website: http://$EC2IP'
echo 'Admin: http://$EC2IP/reckonix/team/admin'
"@

Write-Host "Deployment completed!" -ForegroundColor Green
Write-Host "Website: http://$EC2IP" -ForegroundColor Cyan
Write-Host "Admin: http://$EC2IP/reckonix/team/admin" -ForegroundColor Cyan

Remove-Item deploy.zip -Force



