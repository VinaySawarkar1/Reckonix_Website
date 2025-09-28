@echo off
echo AWS EC2 Deployment for Reckonix
echo ================================

set /p EC2_IP="Enter your EC2 instance IP address: "
set /p EC2_USER="Enter EC2 username (default: ubuntu): "

if "%EC2_USER%"=="" set EC2_USER=ubuntu

echo.
echo Deploying to EC2 instance: %EC2_IP%
echo Using username: %EC2_USER%
echo.

powershell -ExecutionPolicy Bypass -File "deploy-to-aws.ps1" -EC2InstanceIP "%EC2_IP%" -Username "%EC2_USER%"

pause



