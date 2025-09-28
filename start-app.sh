#!/bin/bash
cd /home/ec2-user/reckonix-app
export MONGODB_URL='mongodb+srv://vinay:vinay@cluster0.4adl4tl.mongodb.net/reckonix?retryWrites=true&w=majority'
export NODE_ENV=production
export PORT=5001

# Start the application
nohup npx tsx server/index.ts > app.log 2>&1 &

# Wait a moment and check if it's running
sleep 5
ps aux | grep tsx

echo "Application started. Check app.log for details."


