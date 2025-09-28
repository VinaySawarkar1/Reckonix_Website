@echo off
echo ========================================
echo    DEPLOYING TO NEW AWS INSTANCE
echo ========================================
echo.

set AWS_IP=ec2-65-0-185-9.ap-south-1.compute.amazonaws.com
set PEM_FILE=C:\Users\lenovo\Downloads\Reckonixfinal.pem

echo Creating project directory...
ssh -i "%PEM_FILE%" ec2-user@%AWS_IP% "mkdir -p /home/ec2-user/reckonix"

echo Uploading server files...
scp -i "%PEM_FILE%" -r server/ ec2-user@%AWS_IP%:/home/ec2-user/reckonix/

echo Uploading client files...
scp -i "%PEM_FILE%" -r client/ ec2-user@%AWS_IP%:/home/ec2-user/reckonix/

echo Uploading package files...
scp -i "%PEM_FILE%" package.json ec2-user@%AWS_IP%:/home/ec2-user/reckonix/
scp -i "%PEM_FILE%" package-lock.json ec2-user@%AWS_IP%:/home/ec2-user/reckonix/
scp -i "%PEM_FILE%" .env ec2-user@%AWS_IP%:/home/ec2-user/reckonix/

echo Uploading configuration files...
scp -i "%PEM_FILE%" tsconfig.json ec2-user@%AWS_IP%:/home/ec2-user/reckonix/
scp -i "%PEM_FILE%" vite.config.ts ec2-user@%AWS_IP%:/home/ec2-user/reckonix/
scp -i "%PEM_FILE%" tailwind.config.ts ec2-user@%AWS_IP%:/home/ec2-user/reckonix/
scp -i "%PEM_FILE%" postcss.config.js ec2-user@%AWS_IP%:/home/ec2-user/reckonix/

echo.
echo ========================================
echo    FILES UPLOADED SUCCESSFULLY!
echo ========================================
echo.

echo Now setting up server...
ssh -i "%PEM_FILE%" ec2-user@%AWS_IP% << 'EOF'
cd /home/ec2-user/reckonix

echo Installing dependencies...
npm install --production --no-optional

echo Building client...
npm run build

echo Starting server...
nohup npx tsx server/index.ts > server.log 2>&1 &

echo Restarting nginx...
sudo systemctl restart nginx

echo Checking server status...
ps aux | grep tsx

echo Testing server...
curl -s http://localhost:5001/api/products | head -3

echo.
echo ========================================
echo    DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your website is now live at:
echo http://ec2-65-0-185-9.ap-south-1.compute.amazonaws.com
echo.
EOF

echo.
echo ========================================
echo    DEPLOYMENT FINISHED!
echo ========================================
echo.
echo Your website is now live at:
echo http://%AWS_IP%
echo.
pause
