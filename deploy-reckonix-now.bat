@echo off
echo ========================================
echo    Reckonix AWS Deployment
echo ========================================
echo.
echo Using your EC2 instance details:
echo IP: 13.201.61.147
echo Username: ec2-user
echo.

echo Starting deployment...
echo.

REM Test connection
echo Testing SSH connection...
ssh -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -o ConnectTimeout=10 -o StrictHostKeyChecking=no ec2-user@13.201.61.147 "echo Connection successful"

if errorlevel 1 (
    echo ERROR: Cannot connect to EC2 instance
    echo Please check your security group settings
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
scp -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -o StrictHostKeyChecking=no deploy.zip ec2-user@13.201.61.147:/home/ec2-user/

if errorlevel 1 (
    echo ERROR: Upload failed
    pause
    exit /b 1
)

echo Upload successful!
echo.

REM Deploy on EC2
echo Deploying on EC2 instance...
ssh -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -o StrictHostKeyChecking=no ec2-user@13.201.61.147 "sudo yum update -y && sudo yum install -y unzip docker && sudo systemctl start docker && sudo systemctl enable docker && sudo usermod -aG docker ec2-user && unzip -o deploy.zip -d reckonix-app/ && cd reckonix-app/ && curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash - && sudo yum install -y nodejs && npm ci --production && npm run build:fullstack && mkdir -p logs uploads/products uploads/catalogs uploads/gallery uploads/team uploads/resumes && sudo yum install -y nginx && sudo cp nginx-reckonix.conf /etc/nginx/nginx.conf && sudo nginx -t && sudo systemctl start nginx && sudo systemctl enable nginx && docker-compose -f docker-compose.reckonix.yml up -d && sudo firewall-cmd --permanent --add-port=22/tcp && sudo firewall-cmd --permanent --add-port=80/tcp && sudo firewall-cmd --permanent --add-port=443/tcp && sudo firewall-cmd --permanent --add-port=3000/tcp && sudo firewall-cmd --reload"

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
echo http://13.201.61.147
echo.
echo Admin panel:
echo http://13.201.61.147/reckonix/team/admin
echo.
echo To check status:
echo ssh -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" ec2-user@13.201.61.147 "cd reckonix-app && docker-compose -f docker-compose.reckonix.yml ps"
echo.

REM Clean up
del deploy.zip

pause



