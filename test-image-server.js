const express = require('express');
const path = require('path');

const app = express();

// Serve uploads directory for product images
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Serve static files from client/dist
const distPath = path.resolve(process.cwd(), 'client/dist');
app.use(express.static(distPath));

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running', uploadsPath: path.join(process.cwd(), 'uploads') });
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Test server running on port ${port}`);
  console.log(`Uploads path: ${path.join(process.cwd(), 'uploads')}`);
  console.log(`Dist path: ${distPath}`);
});
