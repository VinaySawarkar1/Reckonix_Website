# EC2 Security Group Configuration

## Required Inbound Rules

Add these rules to your EC2 instance security group:

### 1. HTTP (Port 80)
- **Type**: HTTP
- **Protocol**: TCP
- **Port Range**: 80
- **Source**: 0.0.0.0/0 (Anywhere)

### 2. HTTPS (Port 443)
- **Type**: HTTPS
- **Protocol**: TCP
- **Port Range**: 443
- **Source**: 0.0.0.0/0 (Anywhere)

### 3. Custom TCP (Port 5001)
- **Type**: Custom TCP
- **Protocol**: TCP
- **Port Range**: 5001
- **Source**: 0.0.0.0/0 (Anywhere)

### 4. SSH (Port 22) - Should already exist
- **Type**: SSH
- **Protocol**: TCP
- **Port Range**: 22
- **Source**: Your IP or 0.0.0.0/0

## How to Add Rules:

1. Go to AWS Console → EC2 → Security Groups
2. Find your instance's security group
3. Click "Edit inbound rules"
4. Click "Add rule" for each port above
5. Save changes

## Quick Test:
After adding rules, test these URLs:
- http://ec2-3-7-37-81.ap-south-1.compute.amazonaws.com
- https://ec2-3-7-37-81.ap-south-1.compute.amazonaws.com
- http://ec2-3-7-37-81.ap-south-1.compute.amazonaws.com:5001

