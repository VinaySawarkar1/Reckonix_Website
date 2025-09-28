@echo off
echo ========================================
echo    Reckonix Deployment Status Check
echo ========================================
echo.

echo Checking if your website is accessible...
curl -I http://13.201.61.147

echo.
echo Checking if the application is running on the server...
ssh -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -o StrictHostKeyChecking=no ec2-user@13.201.61.147 "ps aux | grep node"

echo.
echo Checking if nginx is running...
ssh -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -o StrictHostKeyChecking=no ec2-user@13.201.61.147 "sudo systemctl status nginx"

echo.
echo ========================================
echo    DEPLOYMENT STATUS SUMMARY
echo ========================================
echo.
echo Your website should be accessible at:
echo http://13.201.61.147
echo.
echo Admin panel:
echo http://13.201.61.147/reckonix/team/admin
echo.
echo If the website is not accessible, please check:
echo 1. Security group allows HTTP (port 80) and HTTPS (port 443)
echo 2. Application is running on the server
echo 3. Nginx is properly configured
echo.

pause



