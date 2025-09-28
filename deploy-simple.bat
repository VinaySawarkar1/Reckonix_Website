@echo off
echo Deploying Reckonix to EC2...

echo Step 1: Uploading server files...
scp -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -r server ec2-user@ec2-3-7-37-81.ap-south-1.compute.amazonaws.com:/var/www/reckonix/

echo Step 2: Uploading client files...
scp -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -r client ec2-user@ec2-3-7-37-81.ap-south-1.compute.amazonaws.com:/var/www/reckonix/

echo Step 3: Uploading config files...
scp -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" package.json ec2-user@ec2-3-7-37-81.ap-south-1.compute.amazonaws.com:/var/www/reckonix/
scp -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" tsconfig.json ec2-user@ec2-3-7-37-81.ap-south-1.compute.amazonaws.com:/var/www/reckonix/

echo Step 4: Setting up application...
ssh -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" ec2-user@ec2-3-7-37-81.ap-south-1.compute.amazonaws.com "cd /var/www/reckonix && npm install"

echo Step 5: Starting services...
ssh -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" ec2-user@ec2-3-7-37-81.ap-south-1.compute.amazonaws.com "sudo systemctl start nginx && sudo systemctl enable nginx"

echo Deployment complete!
echo Test your application at: http://ec2-3-7-37-81.ap-south-1.compute.amazonaws.com
pause

