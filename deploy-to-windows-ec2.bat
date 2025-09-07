@echo off
echo Starting deployment to Windows EC2 instance...

REM Configuration
set EC2_HOST=13.62.105.14
set EC2_USER=Administrator
set PEM_FILE=C:\Users\lenovo\Downloads\reckonix.pem
set REMOTE_PATH=C:\reckonix-app

echo Building application locally...
call npm run build:fullstack
if %errorlevel% neq 0 (
    echo Local build failed. Exiting.
    pause
    exit /b 1
)

echo Creating deployment package...
if exist deploy-package.zip del deploy-package.zip
powershell Compress-Archive -Path "client,server,shared,uploads,package.json,package-lock.json,Dockerfile,docker-compose.windows.yml,deploy-reckonix-windows.ps1" -DestinationPath "deploy-package.zip"

echo Transferring files to EC2 instance...
scp -i "%PEM_FILE%" -o StrictHostKeyChecking=no deploy-package.zip %EC2_USER%@%EC2_HOST%:%REMOTE_PATH%\

echo Connecting to EC2 and deploying...
ssh -i "%PEM_FILE%" -o StrictHostKeyChecking=no %EC2_USER%@%EC2_HOST% "powershell -Command \"cd %REMOTE_PATH%; Expand-Archive -Path deploy-package.zip -DestinationPath . -Force; .\deploy-reckonix-windows.ps1\""

echo Deployment completed!
echo.
echo Your application should now be running at:
echo http://13.62.105.14:3000
echo.
echo Admin panel: http://13.62.105.14:3000/reckonix/team/admin
echo Username: admin
echo Password: Reckonix@#$12345
echo.
pause
