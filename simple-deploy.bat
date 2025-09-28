@echo off
echo Deploying Reckonix to AWS EC2...
echo IP: 13.201.61.147
echo.

echo Step 1: Creating deployment package...
powershell -Command "if (Test-Path 'deploy.zip') { Remove-Item 'deploy.zip' }; Compress-Archive -Path 'package.json','package-lock.json','tsconfig.json','vite.config.ts','tailwind.config.ts','postcss.config.js','ecosystem.config.js','Dockerfile','docker-compose.reckonix.yml','nginx-reckonix.conf','server','client','shared','prisma','uploads' -DestinationPath 'deploy.zip'"

echo Step 2: Testing connection...
ssh -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -o ConnectTimeout=5 -o StrictHostKeyChecking=no ec2-user@13.201.61.147 "echo Connected to EC2"

if errorlevel 1 (
    echo Connection failed! Please check your security group settings.
    echo Make sure port 22 (SSH) is open for your IP address.
    pause
    exit /b 1
)

echo Step 3: Uploading files...
scp -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -o StrictHostKeyChecking=no deploy.zip ec2-user@13.201.61.147:/home/ec2-user/

echo Step 4: Deploying on server...
ssh -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -o StrictHostKeyChecking=no ec2-user@13.201.61.147 "sudo yum update -y"
ssh -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -o StrictHostKeyChecking=no ec2-user@13.201.61.147 "sudo yum install -y unzip docker"
ssh -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -o StrictHostKeyChecking=no ec2-user@13.201.61.147 "sudo systemctl start docker"
ssh -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -o StrictHostKeyChecking=no ec2-user@13.201.61.147 "sudo usermod -aG docker ec2-user"
ssh -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -o StrictHostKeyChecking=no ec2-user@13.201.61.147 "unzip -o deploy.zip -d reckonix-app/"
ssh -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -o StrictHostKeyChecking=no ec2-user@13.201.61.147 "cd reckonix-app && curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -"
ssh -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -o StrictHostKeyChecking=no ec2-user@13.201.61.147 "cd reckonix-app && sudo yum install -y nodejs"
ssh -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -o StrictHostKeyChecking=no ec2-user@13.201.61.147 "cd reckonix-app && npm ci --production"
ssh -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -o StrictHostKeyChecking=no ec2-user@13.201.61.147 "cd reckonix-app && npm run build:fullstack"
ssh -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -o StrictHostKeyChecking=no ec2-user@13.201.61.147 "cd reckonix-app && mkdir -p logs uploads/products uploads/catalogs uploads/gallery uploads/team uploads/resumes"
ssh -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -o StrictHostKeyChecking=no ec2-user@13.201.61.147 "sudo yum install -y nginx"
ssh -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -o StrictHostKeyChecking=no ec2-user@13.201.61.147 "cd reckonix-app && sudo cp nginx-reckonix.conf /etc/nginx/nginx.conf"
ssh -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -o StrictHostKeyChecking=no ec2-user@13.201.61.147 "sudo systemctl start nginx"
ssh -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -o StrictHostKeyChecking=no ec2-user@13.201.61.147 "cd reckonix-app && docker-compose -f docker-compose.reckonix.yml up -d"

echo.
echo ========================================
echo    DEPLOYMENT COMPLETED!
echo ========================================
echo.
echo Your website is now live at:
echo http://13.201.61.147
echo.
echo Admin panel:
echo http://13.201.61.147/reckonix/team/admin
echo.

del deploy.zip
pause
