# Reckonix AWS Deployment

This project has been configured for AWS deployment with multiple deployment options.

## Quick Start

### Option 1: AWS CLI Deployment (Recommended)
```bash
# Prerequisites: AWS CLI installed and configured
./aws-cli-deploy.sh
```

### Option 2: Docker Deployment
```bash
# Using Docker Compose
npm run docker:compose:build

# Using Docker directly
npm run docker:build
npm run docker:run
```

### Option 3: Manual EC2 Deployment
```bash
# Deploy to EC2 instance
./aws-deploy.sh
```

## Deployment Files

### Core Configuration
- `Dockerfile` - Multi-stage Docker build for containerized deployment
- `docker-compose.yml` - Docker Compose configuration with nginx
- `nginx.conf` - Nginx reverse proxy configuration
- `ecosystem.config.js` - PM2 process manager configuration

### AWS Infrastructure
- `cloudformation-template.yaml` - Complete AWS infrastructure as code
- `aws-cli-deploy.sh` - Automated deployment using AWS CLI
- `aws-deploy.sh` - Manual EC2 deployment script

### Environment & Documentation
- `env.production.template` - Production environment variables template
- `AWS_DEPLOYMENT.md` - Detailed deployment guide
- `.dockerignore` - Docker build optimization

## Prerequisites

### For AWS CLI Deployment
1. AWS CLI installed and configured
2. EC2 key pair created
3. MongoDB Atlas database
4. AWS account with appropriate permissions

### For Docker Deployment
1. Docker and Docker Compose installed
2. MongoDB Atlas database
3. Environment variables configured

## Environment Variables

Copy `env.production.template` to `.env` and configure:

```env
NODE_ENV=production
PORT=3000
MONGODB_URL=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
# Add other required variables
```

## Architecture

The AWS deployment includes:

- **EC2 Auto Scaling Group** - Handles traffic spikes
- **Application Load Balancer** - Distributes traffic
- **VPC with Public Subnet** - Network isolation
- **Security Groups** - Firewall rules
- **S3 Bucket** - File storage
- **CloudWatch** - Monitoring and logging
- **IAM Roles** - Secure access management

## Security Features

- Non-root Docker containers
- Security headers via nginx
- Rate limiting for API endpoints
- VPC network isolation
- IAM role-based access
- Encrypted data transmission

## Monitoring

- PM2 process monitoring
- CloudWatch logs and metrics
- Health checks on all services
- Auto-scaling based on load

## Cost Optimization

- Auto-scaling to handle traffic spikes
- S3 for cost-effective file storage
- CloudFront for global content delivery
- Spot instances for non-critical workloads

## Support

For deployment issues, check:
1. AWS CloudFormation stack events
2. EC2 instance logs
3. Application logs via PM2
4. CloudWatch logs

## Migration from Render

The following Render-specific files have been removed:
- `render.yaml`
- `Procfile`
- `DEPLOYMENT.md` (replaced with `AWS_DEPLOYMENT.md`)

All deployment functionality has been migrated to AWS-compatible configurations.



