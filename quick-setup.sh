#!/bin/bash
cd /var/www/reckonix

# Create a simple Node.js server
cat > server.js << 'EOF'
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Reckonix</title></head>
      <body>
        <h1>Reckonix is Running!</h1>
        <p>Server is working correctly.</p>
        <p>Time: ${new Date().toISOString()}</p>
      </body>
    </html>
  `);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Reckonix Server is running!' });
});

const port = process.env.PORT || 5001;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
EOF

# Install express
npm install express

# Start the server
node server.js &

