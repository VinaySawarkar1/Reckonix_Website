@echo off
echo Uploading Reckonix to EC2...
scp -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -r server ec2-user@ec2-3-7-37-81.ap-south-1.compute.amazonaws.com:/var/www/reckonix/
scp -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -r client ec2-user@ec2-3-7-37-81.ap-south-1.compute.amazonaws.com:/var/www/reckonix/
scp -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" -r shared ec2-user@ec2-3-7-37-81.ap-south-1.compute.amazonaws.com:/var/www/reckonix/
scp -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" package.json ec2-user@ec2-3-7-37-81.ap-south-1.compute.amazonaws.com:/var/www/reckonix/
scp -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" package-lock.json ec2-user@ec2-3-7-37-81.ap-south-1.compute.amazonaws.com:/var/www/reckonix/
scp -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" tsconfig.json ec2-user@ec2-3-7-37-81.ap-south-1.compute.amazonaws.com:/var/www/reckonix/
scp -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" vite.config.ts ec2-user@ec2-3-7-37-81.ap-south-1.compute.amazonaws.com:/var/www/reckonix/
scp -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" tailwind.config.ts ec2-user@ec2-3-7-37-81.ap-south-1.compute.amazonaws.com:/var/www/reckonix/
scp -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" postcss.config.js ec2-user@ec2-3-7-37-81.ap-south-1.compute.amazonaws.com:/var/www/reckonix/
scp -i "C:\Users\lenovo\Downloads\Reckonixfinal.pem" ecosystem.config.js ec2-user@ec2-3-7-37-81.ap-south-1.compute.amazonaws.com:/var/www/reckonix/
echo Upload complete!

