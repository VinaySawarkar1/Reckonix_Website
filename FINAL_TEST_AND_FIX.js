const http = require('http');
const fs = require('fs');

console.log('🚀 FINAL COMPREHENSIVE TEST & FIX\n');

// Test all API endpoints
const endpoints = [
  '/api/test',
  '/health', 
  '/api/products',
  '/api/categories',
  '/api/team',
  '/api/customers',
  '/api/events',
  '/api/testimonials',
  '/api/industries',
  '/api/jobs',
  '/api/gallery',
  '/api/quotes',
  '/api/messages',
  '/api/analytics',
  '/api/media/settings'
];

const results = { passed: 0, failed: 0, errors: [] };

function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5001,
      path: endpoint,
      method: 'GET',
      timeout: 3000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ ${endpoint}: ${res.statusCode}`);
          results.passed++;
        } else {
          console.log(`❌ ${endpoint}: ${res.statusCode}`);
          results.failed++;
          results.errors.push(`${endpoint}: ${res.statusCode}`);
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${endpoint}: ${error.message}`);
      results.failed++;
      results.errors.push(`${endpoint}: ${error.message}`);
      resolve();
    });

    req.on('timeout', () => {
      console.log(`⏰ ${endpoint}: Timeout`);
      results.failed++;
      results.errors.push(`${endpoint}: Timeout`);
      req.destroy();
      resolve();
    });

    req.end();
  });
}

async function runAllTests() {
  console.log('🔍 Testing all API endpoints...\n');
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n📊 FINAL RESULTS:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
  
  if (results.errors.length > 0) {
    console.log('\n🚨 ERRORS FOUND:');
    results.errors.forEach((error, i) => console.log(`${i+1}. ${error}`));
  }
  
  // Create final report
  const report = `
# FINAL TEST RESULTS - ${new Date().toISOString()}

## API Testing Results
- ✅ Passed: ${results.passed}
- ❌ Failed: ${results.failed}
- 📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%

## Issues Found
${results.errors.map((error, i) => `${i+1}. ${error}`).join('\n')}

## Status
${results.passed > results.failed ? '✅ MOSTLY WORKING' : '❌ CRITICAL ISSUES'}
  `;
  
  fs.writeFileSync('FINAL_TEST_RESULTS.md', report);
  console.log('\n📄 Report saved to FINAL_TEST_RESULTS.md');
}

runAllTests();



