const http = require('http');

const testEndpoints = [
  { path: '/api/test', name: 'Test Endpoint' },
  { path: '/health', name: 'Health Check' },
  { path: '/api/products', name: 'Products' },
  { path: '/api/categories', name: 'Categories' },
  { path: '/api/team', name: 'Team' },
  { path: '/api/customers', name: 'Customers' },
  { path: '/api/events', name: 'Events' },
  { path: '/api/testimonials', name: 'Testimonials' },
  { path: '/api/industries', name: 'Industries' },
  { path: '/api/jobs', name: 'Jobs' },
  { path: '/api/gallery', name: 'Gallery' },
  { path: '/api/quotes', name: 'Quotes' },
  { path: '/api/messages', name: 'Messages' },
  { path: '/api/analytics', name: 'Analytics' },
  { path: '/api/media/settings', name: 'Media Settings' }
];

const results = { passed: 0, failed: 0, errors: [] };

function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5001,
      path: endpoint.path,
      method: 'GET',
      timeout: 5000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ ${endpoint.name}: ${res.statusCode}`);
          results.passed++;
        } else {
          console.log(`❌ ${endpoint.name}: ${res.statusCode}`);
          results.failed++;
          results.errors.push(`${endpoint.name}: ${res.statusCode}`);
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${endpoint.name}: ${error.message}`);
      results.failed++;
      results.errors.push(`${endpoint.name}: ${error.message}`);
      resolve();
    });

    req.on('timeout', () => {
      console.log(`⏰ ${endpoint.name}: Timeout`);
      results.failed++;
      results.errors.push(`${endpoint.name}: Timeout`);
      req.destroy();
      resolve();
    });

    req.end();
  });
}

async function runTests() {
  console.log('🚀 Quick API Testing...\n');
  
  for (const endpoint of testEndpoints) {
    await testEndpoint(endpoint);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n📊 Results:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
  
  if (results.errors.length > 0) {
    console.log('\n🚨 Errors:');
    results.errors.forEach((error, i) => console.log(`${i+1}. ${error}`));
  }
}

runTests();



