@echo off
echo Starting AWS Deployment...

REM Replace these with your actual values
set AWS_IP=your-aws-ip-here
set PEM_FILE=C:\Users\lenovo\Downloads\your-key.pem

echo Uploading files to AWS...
scp -i "%PEM_FILE%" -r client/ ec2-user@%AWS_IP%:/home/ec2-user/reckonix/
scp -i "%PEM_FILE%" -r server/ ec2-user@%AWS_IP%:/home/ec2-user/reckonix/
scp -i "%PEM_FILE%" package.json ec2-user@%AWS_IP%:/home/ec2-user/reckonix/
scp -i "%PEM_FILE%" package-lock.json ec2-user@%AWS_IP%:/home/ec2-user/reckonix/
scp -i "%PEM_FILE%" .env ec2-user@%AWS_IP%:/home/ec2-user/reckonix/

echo Files uploaded successfully!
echo.
echo Next steps:
echo 1. SSH into your AWS server: ssh -i "%PEM_FILE%" ec2-user@%AWS_IP%
echo 2. Run the deployment commands on the server
echo.
pause
