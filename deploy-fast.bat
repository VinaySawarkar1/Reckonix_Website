@echo off
echo Fast AWS Deployment for Reckonix
echo ================================

set /p EC2_IP="Enter your EC2 instance IP: "

echo Deploying to %EC2_IP%...

powershell -ExecutionPolicy Bypass -Command "
$KeyPath = 'C:\Users\lenovo\Downloads\Reckonixfinal.pem'
$Username = 'ubuntu'
$EC2IP = '%EC2_IP%'

Write-Host 'Testing connection...' -ForegroundColor Yellow
ssh -i $KeyPath -o ConnectTimeout=5 -o StrictHostKeyChecking=no ${Username}@${EC2IP} 'echo Connected'

if ($LASTEXITCODE -ne 0) {
    Write-Host 'Connection failed!' -ForegroundColor Red
    exit 1
}

Write-Host 'Creating package...' -ForegroundColor Yellow
Compress-Archive -Path @('package.json','package-lock.json','tsconfig.json','vite.config.ts','tailwind.config.ts','postcss.config.js','ecosystem.config.js','Dockerfile','docker-compose.reckonix.yml','nginx-reckonix.conf','server','client','shared','prisma','uploads') -DestinationPath 'deploy.zip' -Force

Write-Host 'Uploading...' -ForegroundColor Yellow
scp -i $KeyPath -o StrictHostKeyChecking=no deploy.zip ${Username}@${EC2IP}:/home/${Username}/

Write-Host 'Deploying...' -ForegroundColor Yellow
ssh -i $KeyPath -o StrictHostKeyChecking=no ${Username}@${EC2IP} 'sudo apt-get update -y && sudo apt-get install -y unzip docker.io docker-compose nginx && sudo systemctl start docker && sudo usermod -aG docker $USER && unzip -o deploy.zip -d reckonix-app/ && cd reckonix-app/ && curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs && npm ci --production && npm run build:fullstack && mkdir -p logs uploads/products uploads/catalogs uploads/gallery uploads/team uploads/resumes && sudo cp nginx-reckonix.conf /etc/nginx/nginx.conf && sudo nginx -t && sudo systemctl reload nginx && docker-compose -f docker-compose.reckonix.yml up -d && sudo ufw allow 22/tcp && sudo ufw allow 80/tcp && sudo ufw allow 443/tcp && sudo ufw allow 3000/tcp && sudo ufw --force enable && echo Deployment complete!'

Write-Host 'Deployment completed!' -ForegroundColor Green
Write-Host 'Website: http://%EC2_IP%' -ForegroundColor Cyan
Write-Host 'Admin: http://%EC2_IP%/reckonix/team/admin' -ForegroundColor Cyan

Remove-Item deploy.zip -Force
"

pause



