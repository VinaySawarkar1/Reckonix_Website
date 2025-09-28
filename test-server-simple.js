const http = require('http');

function testServer() {
  console.log('🔍 Testing server connection...');
  
  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/test',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Server responded with status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📄 Response data:', data);
    });
  });

  req.on('error', (error) => {
    console.log('❌ Server connection failed:', error.message);
  });

  req.setTimeout(5000, () => {
    console.log('⏰ Request timeout - server may not be running');
    req.destroy();
  });

  req.end();
}

// Test multiple endpoints
function testMultipleEndpoints() {
  const endpoints = [
    '/api/test',
    '/health',
    '/api/products',
    '/api/categories'
  ];

  endpoints.forEach((endpoint, index) => {
    setTimeout(() => {
      console.log(`\n🔍 Testing ${endpoint}...`);
      
      const options = {
        hostname: 'localhost',
        port: 5001,
        path: endpoint,
        method: 'GET'
      };

      const req = http.request(options, (res) => {
        console.log(`✅ ${endpoint}: ${res.statusCode}`);
      });

      req.on('error', (error) => {
        console.log(`❌ ${endpoint}: ${error.message}`);
      });

      req.setTimeout(3000, () => {
        console.log(`⏰ ${endpoint}: Timeout`);
        req.destroy();
      });

      req.end();
    }, index * 1000);
  });
}

// Run tests
testServer();
setTimeout(() => {
  testMultipleEndpoints();
}, 2000);



