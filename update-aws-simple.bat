@echo off
echo Uploading files to AWS...

REM Upload server files
scp -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -r server/ ec2-user@ec2-65-2-184-89.ap-south-1.compute.amazonaws.com:/home/ec2-user/reckonix/

REM Upload client files
scp -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -r client/ ec2-user@ec2-65-2-184-89.ap-south-1.compute.amazonaws.com:/home/ec2-user/reckonix/

REM Upload package files
scp -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" package.json ec2-user@ec2-65-2-184-89.ap-south-1.compute.amazonaws.com:/home/ec2-user/reckonix/
scp -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" package-lock.json ec2-user@ec2-65-2-184-89.ap-south-1.compute.amazonaws.com:/home/ec2-user/reckonix/

echo Files uploaded successfully!
echo.
echo Now run these commands on AWS:
echo ssh -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" ec2-user@ec2-65-2-184-89.ap-south-1.compute.amazonaws.com
echo cd /home/ec2-user/reckonix
echo npm install --production --no-optional
echo npm run build
echo pkill -f "tsx server/index.ts"
echo nohup npx tsx server/index.ts > server.log 2>&1 &
echo sudo systemctl restart nginx
echo.
pause
