@echo off
echo ========================================
echo    RECKONIX AWS DEPLOYMENT SCRIPT
echo ========================================
echo.

REM Get AWS IP from user
set /p AWS_IP="Enter your AWS IP address: "

REM Get PEM file path from user
set /p PEM_FILE="Enter path to your .pem file (e.g., C:\Users\lenovo\Downloads\your-key.pem): "

echo.
echo Starting deployment to AWS...
echo AWS IP: %AWS_IP%
echo PEM File: %PEM_FILE%
echo.

REM Create project directory on AWS
echo Creating project directory on AWS...
ssh -i "%PEM_FILE%" ec2-user@%AWS_IP% "mkdir -p /home/ec2-user/reckonix"

REM Upload essential files
echo Uploading package files...
scp -i "%PEM_FILE%" package.json ec2-user@%AWS_IP%:/home/ec2-user/reckonix/
scp -i "%PEM_FILE%" package-lock.json ec2-user@%AWS_IP%:/home/ec2-user/reckonix/
scp -i "%PEM_FILE%" .env ec2-user@%AWS_IP%:/home/ec2-user/reckonix/

REM Upload server files
echo Uploading server files...
scp -i "%PEM_FILE%" -r server/ ec2-user@%AWS_IP%:/home/ec2-user/reckonix/

REM Upload client files
echo Uploading client files...
scp -i "%PEM_FILE%" -r client/ ec2-user@%AWS_IP%:/home/ec2-user/reckonix/

REM Upload configuration files
echo Uploading configuration files...
scp -i "%PEM_FILE%" tsconfig.json ec2-user@%AWS_IP%:/home/ec2-user/reckonix/
scp -i "%PEM_FILE%" vite.config.ts ec2-user@%AWS_IP%:/home/ec2-user/reckonix/
scp -i "%PEM_FILE%" tailwind.config.ts ec2-user@%AWS_IP%:/home/ec2-user/reckonix/
scp -i "%PEM_FILE%" postcss.config.js ec2-user@%AWS_IP%:/home/ec2-user/reckonix/

REM Upload nginx configuration
echo Uploading nginx configuration...
scp -i "%PEM_FILE%" nginx.conf ec2-user@%AWS_IP%:/home/ec2-user/reckonix/

echo.
echo ========================================
echo    FILES UPLOADED SUCCESSFULLY!
echo ========================================
echo.

echo Now running deployment commands on AWS server...
echo.

REM Run deployment commands on AWS
ssh -i "%PEM_FILE%" ec2-user@%AWS_IP% << 'EOF'
cd /home/ec2-user/reckonix

echo Installing dependencies...
npm install --production --no-optional

echo Building client...
npm run build

echo Stopping existing processes...
pkill -f "tsx server/index.ts" || true
pkill -f "node" || true

echo Starting server...
nohup npx tsx server/index.ts > server.log 2>&1 &

echo Waiting for server to start...
sleep 5

echo Checking server status...
ps aux | grep tsx

echo Restarting nginx...
sudo systemctl restart nginx

echo Testing server...
curl -s http://localhost:5001/api/products | head -5

echo.
echo ========================================
echo    DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Server is running on port 5001
echo Check logs with: tail -f server.log
echo.
EOF

echo.
echo ========================================
echo    DEPLOYMENT FINISHED!
echo ========================================
echo.
echo Your website should now be live at:
echo http://%AWS_IP%
echo.
echo To check server status, run:
echo ssh -i "%PEM_FILE%" ec2-user@%AWS_IP% "ps aux | grep tsx"
echo.
echo To view server logs, run:
echo ssh -i "%PEM_FILE%" ec2-user@%AWS_IP% "tail -f /home/ec2-user/reckonix/server.log"
echo.
pause
