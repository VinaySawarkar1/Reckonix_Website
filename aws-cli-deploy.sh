#!/bin/bash

# AWS CLI Deployment Script for Reckonix
set -e

echo "🚀 Starting AWS CLI deployment for Reckonix..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
STACK_NAME="reckonix-stack"
REGION="us-east-1"
KEY_PAIR_NAME="reckonix-keypair"
INSTANCE_TYPE="t3.medium"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    echo "Visit: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

# Get MongoDB URL from user
if [ -z "$MONGODB_URL" ]; then
    echo -e "${YELLOW}📝 Please enter your MongoDB connection string:${NC}"
    read -s MONGODB_URL
    echo ""
fi

# Check if key pair exists
echo -e "${BLUE}🔑 Checking for EC2 key pair...${NC}"
if ! aws ec2 describe-key-pairs --key-names "$KEY_PAIR_NAME" --region "$REGION" &> /dev/null; then
    echo -e "${YELLOW}⚠️  Key pair '$KEY_PAIR_NAME' not found.${NC}"
    echo "Please create a key pair first:"
    echo "aws ec2 create-key-pair --key-name $KEY_PAIR_NAME --region $REGION --query 'KeyMaterial' --output text > $KEY_PAIR_NAME.pem"
    echo "chmod 400 $KEY_PAIR_NAME.pem"
    exit 1
fi

# Deploy CloudFormation stack
echo -e "${BLUE}☁️  Deploying CloudFormation stack...${NC}"
aws cloudformation deploy \
    --template-file cloudformation-template.yaml \
    --stack-name "$STACK_NAME" \
    --parameter-overrides \
        KeyPairName="$KEY_PAIR_NAME" \
        InstanceType="$INSTANCE_TYPE" \
        MongoDBURL="$MONGODB_URL" \
    --capabilities CAPABILITY_IAM \
    --region "$REGION"

# Get stack outputs
echo -e "${BLUE}📊 Getting stack outputs...${NC}"
LOAD_BALANCER_DNS=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerDNS`].OutputValue' \
    --output text)

S3_BUCKET=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`S3BucketName`].OutputValue' \
    --output text)

# Wait for instances to be ready
echo -e "${BLUE}⏳ Waiting for instances to be ready...${NC}"
aws ec2 wait instance-running \
    --filters "Name=tag:Name,Values=Reckonix-Instance" \
    --region "$REGION"

# Get instance ID
INSTANCE_ID=$(aws ec2 describe-instances \
    --filters "Name=tag:Name,Values=Reckonix-Instance" "Name=instance-state-name,Values=running" \
    --region "$REGION" \
    --query 'Reservations[0].Instances[0].InstanceId' \
    --output text)

# Get instance public IP
PUBLIC_IP=$(aws ec2 describe-instances \
    --instance-ids "$INSTANCE_ID" \
    --region "$REGION" \
    --query 'Reservations[0].Instances[0].PublicIpAddress' \
    --output text)

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo "🌐 Application URLs:"
echo "   Load Balancer: http://$LOAD_BALANCER_DNS"
echo "   Direct Instance: http://$PUBLIC_IP:3000"
echo ""
echo "📦 S3 Bucket: $S3_BUCKET"
echo "🖥️  Instance ID: $INSTANCE_ID"
echo "🌍 Region: $REGION"
echo ""
echo "🔧 Next steps:"
echo "1. SSH into your instance:"
echo "   ssh -i $KEY_PAIR_NAME.pem ec2-user@$PUBLIC_IP"
echo ""
echo "2. Upload your application code:"
echo "   scp -i $KEY_PAIR_NAME.pem -r . ec2-user@$PUBLIC_IP:/home/ec2-user/reckonix/"
echo ""
echo "3. Run the startup script:"
echo "   ssh -i $KEY_PAIR_NAME.pem ec2-user@$PUBLIC_IP 'cd /home/ec2-user/reckonix && ./start-reckonix.sh'"
echo ""
echo "4. Set up SSL certificate (optional):"
echo "   Use AWS Certificate Manager or Let's Encrypt"
echo ""
echo "📊 Monitor your deployment:"
echo "   aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION"
echo "   aws ec2 describe-instances --instance-ids $INSTANCE_ID --region $REGION"



