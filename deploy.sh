#!/bin/bash

# AWS Deployment Script for Reckonix
set -e

echo "🚀 Starting AWS deployment for Reckonix..."

# Check if required environment variables are set
if [ -z "$MONGODB_URL" ]; then
    echo "❌ Error: MONGODB_URL environment variable is required"
    exit 1
fi

# Build the application
echo "📦 Building application..."
npm run build:fullstack

# Create logs directory if it doesn't exist
mkdir -p logs

# Start the application with PM2
echo "🔄 Starting application with PM2..."
npm run pm2:start

echo "✅ Deployment completed successfully!"
echo "🌐 Application is running on port 3000"
echo "📊 Check status with: npm run pm2:status"
echo "📝 View logs with: npm run pm2:logs"



