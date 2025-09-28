# Reckonix AWS Deployment Guide

## Prerequisites
- AWS Account with appropriate permissions
- Docker installed (for containerized deployment)
- Node.js 18+ installed
- MongoDB Atlas database (already configured)

## Deployment Options

### Option 1: Docker Deployment (Recommended)

#### Using Docker Compose
```bash
# Build and start the application
npm run docker:compose:build

# Start the application
npm run docker:compose

# Stop the application
npm run docker:compose:down
```

#### Using Docker directly
```bash
# Build the Docker image
npm run docker:build

# Run the container
npm run docker:run
```

### Option 2: Direct Server Deployment

#### Using PM2 (Process Manager)
```bash
# Deploy to AWS EC2
npm run aws:deploy

# Check application status
npm run pm2:status

# View logs
npm run pm2:logs

# Restart application
npm run pm2:restart
```

## AWS Services Setup

### 1. EC2 Instance Setup
- Launch an EC2 instance (t3.medium or larger recommended)
- Install Node.js 18+, Docker, and PM2
- Configure security groups to allow HTTP (80), HTTPS (443), and SSH (22)

### 2. Application Load Balancer (Optional)
- Create an ALB for high availability
- Configure target groups pointing to your EC2 instances
- Set up SSL certificates for HTTPS

### 3. RDS Database (Optional)
- If not using MongoDB Atlas, set up RDS MongoDB-compatible database
- Configure security groups and VPC settings

### 4. S3 for File Storage (Recommended)
- Create S3 bucket for product images and uploads
- Configure IAM roles for application access
- Update application to use S3 for file storage

## Environment Variables

Create a `.env` file with the following variables:

```env
NODE_ENV=production
PORT=3000
MONGODB_URL=your_mongodb_connection_string
# Add other required environment variables
```

## Security Considerations

### 1. Nginx Configuration
The included `nginx.conf` provides:
- Rate limiting for API endpoints
- Security headers
- Gzip compression
- Static file caching

### 2. Docker Security
- Non-root user execution
- Health checks
- Resource limits
- Security headers

### 3. AWS Security
- Use IAM roles instead of access keys
- Enable VPC for network isolation
- Configure security groups properly
- Use AWS Secrets Manager for sensitive data

## Monitoring and Logging

### 1. PM2 Monitoring
```bash
# View real-time monitoring
pm2 monit

# View logs
pm2 logs

# Restart on file changes
pm2 start ecosystem.config.js --watch
```

### 2. AWS CloudWatch
- Set up CloudWatch logs for application monitoring
- Configure alarms for CPU, memory, and disk usage
- Set up log aggregation

## Scaling

### Horizontal Scaling
- Use Application Load Balancer with multiple EC2 instances
- Configure auto-scaling groups
- Use container orchestration (ECS/EKS) for Docker deployments

### Vertical Scaling
- Monitor resource usage
- Upgrade instance types as needed
- Optimize application performance

## Backup and Recovery

### 1. Database Backups
- Configure MongoDB Atlas automated backups
- Set up cross-region replication

### 2. Application Backups
- Use AWS AMI for EC2 instance backups
- Store application code in version control
- Backup configuration files

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Ensure port 3000 is available
   - Check security group settings

2. **Database Connection**
   - Verify MongoDB connection string
   - Check network connectivity

3. **Memory Issues**
   - Monitor memory usage with PM2
   - Adjust PM2 memory limits in ecosystem.config.js

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed

### Log Locations
- Application logs: `./logs/`
- PM2 logs: `~/.pm2/logs/`
- Docker logs: `docker logs <container_name>`

## Performance Optimization

### 1. Application Level
- Enable gzip compression
- Optimize database queries
- Use caching strategies
- Implement CDN for static assets

### 2. Infrastructure Level
- Use appropriate instance types
- Configure auto-scaling
- Implement load balancing
- Use AWS CloudFront for global distribution

## Cost Optimization

### 1. Instance Types
- Start with smaller instances and scale up
- Use spot instances for non-critical workloads
- Implement auto-scaling to handle traffic spikes

### 2. Storage
- Use S3 for file storage instead of EBS
- Implement lifecycle policies for log retention
- Use CloudFront for content delivery

## Support and Maintenance

### Regular Tasks
- Monitor application performance
- Update dependencies regularly
- Review and rotate security credentials
- Backup data and configurations
- Monitor AWS costs and usage



