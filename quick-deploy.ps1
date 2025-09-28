# Quick Deploy Script for Reckonix
Write-Host "Starting Reckonix deployment..." -ForegroundColor Green

# Upload essential files
Write-Host "Uploading files..." -ForegroundColor Yellow
scp -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -r server ec2-user@ec2-3-7-37-81.ap-south-1.compute.amazonaws.com:/var/www/reckonix/
scp -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -r client ec2-user@ec2-3-7-37-81.ap-south-1.compute.amazonaws.com:/var/www/reckonix/
scp -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" package.json ec2-user@ec2-3-7-37-81.ap-south-1.compute.amazonaws.com:/var/www/reckonix/
scp -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" tsconfig.json ec2-user@ec2-3-7-37-81.ap-south-1.compute.amazonaws.com:/var/www/reckonix/

# Setup and start the application
Write-Host "Setting up application..." -ForegroundColor Yellow
ssh -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" ec2-user@ec2-3-7-37-81.ap-south-1.compute.amazonaws.com "
cd /var/www/reckonix
npm install
cd server && npm install
cd ..
npm run build
sudo systemctl start nginx
sudo systemctl enable nginx
"

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Your application should be running at: http://ec2-3-7-37-81.ap-south-1.compute.amazonaws.com" -ForegroundColor Cyan