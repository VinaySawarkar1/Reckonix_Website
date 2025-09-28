@echo off
echo ========================================
echo    UPDATING RECKONIX ON AWS
echo ========================================
echo.

set AWS_IP=ec2-65-2-184-89.ap-south-1.compute.amazonaws.com
set PEM_FILE=C:\Users\lenovo\Downloads\Reckonixfinal.pem

echo Uploading updated files to AWS...
echo.

REM Upload server files
echo Uploading server files...
scp -i "%PEM_FILE%" -r server/ ec2-user@%AWS_IP%:/home/ec2-user/reckonix/

REM Upload client files  
echo Uploading client files...
scp -i "%PEM_FILE%" -r client/ ec2-user@%AWS_IP%:/home/ec2-user/reckonix/

REM Upload package files
echo Uploading package files...
scp -i "%PEM_FILE%" package.json ec2-user@%AWS_IP%:/home/ec2-user/reckonix/
scp -i "%PEM_FILE%" package-lock.json ec2-user@%AWS_IP%:/home/ec2-user/reckonix/

echo.
echo Files uploaded! Now updating server...
echo.

REM Run update commands on AWS
ssh -i "%PEM_FILE%" ec2-user@%AWS_IP% << 'EOF'
cd /home/ec2-user/reckonix

echo Installing dependencies...
npm install --production --no-optional

echo Building client...
npm run build

echo Stopping existing server...
pkill -f "tsx server/index.ts" || true
pkill -f "node" || true

echo Starting updated server...
nohup npx tsx server/index.ts > server.log 2>&1 &

echo Waiting for server to start...
sleep 5

echo Checking server status...
ps aux | grep tsx

echo Restarting nginx...
sudo systemctl restart nginx

echo Testing server...
curl -s http://localhost:5001/api/products | head -3

echo.
echo ========================================
echo    UPDATE COMPLETE!
echo ========================================
echo.
EOF

echo.
echo ========================================
echo    WEBSITE UPDATED SUCCESSFULLY!
echo ========================================
echo.
echo Your website is now updated at:
echo http://%AWS_IP%
echo.
pause
