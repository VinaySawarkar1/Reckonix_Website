@echo off
echo ========================================
echo    Reckonix AWS Deployment
echo ========================================
echo.
echo Please provide your EC2 instance details:
echo.

set /p EC2_IP="EC2 Instance IP Address: "
set /p EC2_USER="EC2 Username (ubuntu/ec2-user): "

if "%EC2_USER%"=="" set EC2_USER=ubuntu

echo.
echo Starting deployment to %EC2_IP%...
echo.

REM Test connection
echo Testing SSH connection...
ssh -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -o ConnectTimeout=10 -o StrictHostKeyChecking=no %EC2_USER%@%EC2_IP% "echo Connection successful"

if errorlevel 1 (
    echo ERROR: Cannot connect to EC2 instance
    echo Please check:
    echo 1. EC2 instance is running
    echo 2. Security group allows SSH from your IP
    echo 3. Username is correct
    pause
    exit /b 1
)

echo Connection successful!
echo.

REM Create deployment package
echo Creating deployment package...
powershell -Command "Compress-Archive -Path @('package.json','package-lock.json','tsconfig.json','vite.config.ts','tailwind.config.ts','postcss.config.js','ecosystem.config.js','Dockerfile','docker-compose.reckonix.yml','nginx-reckonix.conf','server','client','shared','prisma','uploads') -DestinationPath 'deploy.zip' -Force"

REM Upload to EC2
echo Uploading to EC2...
scp -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -o StrictHostKeyChecking=no deploy.zip %EC2_USER%@%EC2_IP%:/home/%EC2_USER%/

if errorlevel 1 (
    echo ERROR: Upload failed
    pause
    exit /b 1
)

echo Upload successful!
echo.

REM Deploy on EC2
echo Deploying on EC2 instance...
ssh -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -o StrictHostKeyChecking=no %EC2_USER%@%EC2_IP% "sudo apt-get update -y && sudo apt-get install -y unzip docker.io docker-compose nginx && sudo systemctl start docker && sudo usermod -aG docker $USER && unzip -o deploy.zip -d reckonix-app/ && cd reckonix-app/ && curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs && npm ci --production && npm run build:fullstack && mkdir -p logs uploads/products uploads/catalogs uploads/gallery uploads/team uploads/resumes && sudo cp nginx-reckonix.conf /etc/nginx/nginx.conf && sudo nginx -t && sudo systemctl reload nginx && docker-compose -f docker-compose.reckonix.yml up -d && sudo ufw allow 22/tcp && sudo ufw allow 80/tcp && sudo ufw allow 443/tcp && sudo ufw allow 3000/tcp && sudo ufw --force enable"

if errorlevel 1 (
    echo ERROR: Deployment failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo    DEPLOYMENT COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Your website is now live at:
echo http://%EC2_IP%
echo.
echo Admin panel:
echo http://%EC2_IP%/reckonix/team/admin
echo.
echo To check status:
echo ssh -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" %EC2_USER%@%EC2_IP% "cd reckonix-app && docker-compose -f docker-compose.reckonix.yml ps"
echo.

REM Clean up
del deploy.zip

pause



