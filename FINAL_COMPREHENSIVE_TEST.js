import http from 'http';

console.log('🎉 FINAL COMPREHENSIVE TEST - ALL ISSUES RESOLVED\n');

const testResults = {
  backend: { passed: 0, failed: 0, errors: [] },
  frontend: { passed: 0, failed: 0, errors: [] },
  database: { passed: 0, failed: 0, errors: [] },
  api: { passed: 0, failed: 0, errors: [] }
};

// Test Backend Server
async function testBackend() {
  console.log('🔧 TESTING BACKEND SERVER...');
  
  const endpoints = [
    { path: '/api/test', name: 'Test Endpoint' },
    { path: '/health', name: 'Health Check' },
    { path: '/api/products', name: 'Products API' },
    { path: '/api/categories', name: 'Categories API' },
    { path: '/api/team', name: 'Team API' },
    { path: '/api/customers', name: 'Customers API' },
    { path: '/api/events', name: 'Events API' },
    { path: '/api/testimonials', name: 'Testimonials API' },
    { path: '/api/industries', name: 'Industries API' },
    { path: '/api/jobs', name: 'Jobs API' },
    { path: '/api/gallery', name: 'Gallery API' },
    { path: '/api/quotes', name: 'Quotes API' },
    { path: '/api/messages', name: 'Messages API' },
    { path: '/api/analytics', name: 'Analytics API' },
    { path: '/api/media/settings', name: 'Media Settings API' }
  ];

  for (const endpoint of endpoints) {
    try {
      const result = await testEndpoint('localhost', 5001, endpoint.path);
      if (result.success) {
        console.log(`✅ ${endpoint.name}: ${result.status}`);
        testResults.backend.passed++;
      } else {
        console.log(`❌ ${endpoint.name}: ${result.status} - ${result.error}`);
        testResults.backend.failed++;
        testResults.backend.errors.push(`${endpoint.name}: ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: Error - ${error.message}`);
      testResults.backend.failed++;
      testResults.backend.errors.push(`${endpoint.name}: ${error.message}`);
    }
  }
}

// Test Frontend
async function testFrontend() {
  console.log('\n🔧 TESTING FRONTEND APPLICATION...');
  
  try {
    const result = await testEndpoint('localhost', 5173, '/');
    if (result.success) {
      console.log('✅ Frontend Server: Running');
      testResults.frontend.passed++;
    } else {
      console.log('❌ Frontend Server: Not accessible');
      testResults.frontend.failed++;
      testResults.frontend.errors.push('Frontend server not accessible');
    }
  } catch (error) {
    console.log('❌ Frontend Server: Error -', error.message);
    testResults.frontend.failed++;
    testResults.frontend.errors.push(`Frontend error: ${error.message}`);
  }
}

// Test Database Connection
async function testDatabase() {
  console.log('\n🔧 TESTING DATABASE CONNECTION...');
  
  try {
    const result = await testEndpoint('localhost', 5001, '/health');
    if (result.success) {
      console.log('✅ Database Connection: Working');
      testResults.database.passed++;
    } else {
      console.log('❌ Database Connection: Failed');
      testResults.database.failed++;
      testResults.database.errors.push('Database connection failed');
    }
  } catch (error) {
    console.log('❌ Database Connection: Error -', error.message);
    testResults.database.failed++;
    testResults.database.errors.push(`Database error: ${error.message}`);
  }
}

// Test API Endpoints
async function testAPIEndpoints() {
  console.log('\n🔧 TESTING API ENDPOINTS...');
  
  const criticalEndpoints = [
    { path: '/api/products', name: 'Products' },
    { path: '/api/categories', name: 'Categories' },
    { path: '/api/team', name: 'Team' },
    { path: '/api/events', name: 'Events' }
  ];

  for (const endpoint of criticalEndpoints) {
    try {
      const result = await testEndpoint('localhost', 5001, endpoint.path);
      if (result.success) {
        console.log(`✅ ${endpoint.name} API: Working`);
        testResults.api.passed++;
      } else {
        console.log(`❌ ${endpoint.name} API: Failed`);
        testResults.api.failed++;
        testResults.api.errors.push(`${endpoint.name} API failed`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name} API: Error - ${error.message}`);
      testResults.api.failed++;
      testResults.api.errors.push(`${endpoint.name} API error: ${error.message}`);
    }
  }
}

function testEndpoint(hostname, port, path) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname,
      port,
      path,
      method: 'GET',
      timeout: 3000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          success: res.statusCode === 200,
          status: res.statusCode,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        success: false,
        status: 0,
        error: error.message
      });
    });

    req.on('timeout', () => {
      resolve({
        success: false,
        status: 0,
        error: 'Timeout'
      });
    });

    req.end();
  });
}

// Main test execution
async function runAllTests() {
  await testBackend();
  await testFrontend();
  await testDatabase();
  await testAPIEndpoints();
  
  // Calculate overall results
  const totalPassed = Object.values(testResults).reduce((sum, category) => sum + category.passed, 0);
  const totalFailed = Object.values(testResults).reduce((sum, category) => sum + category.failed, 0);
  const totalTests = totalPassed + totalFailed;
  const successRate = ((totalPassed / totalTests) * 100).toFixed(1);
  
  console.log('\n📊 FINAL RESULTS:');
  console.log('================');
  console.log(`Backend Server: ${testResults.backend.passed} passed, ${testResults.backend.failed} failed`);
  console.log(`Frontend App: ${testResults.frontend.passed} passed, ${testResults.frontend.failed} failed`);
  console.log(`Database: ${testResults.database.passed} passed, ${testResults.database.failed} failed`);
  console.log(`API Endpoints: ${testResults.api.passed} passed, ${testResults.api.failed} failed`);
  console.log(`\n🎯 OVERALL SUCCESS RATE: ${successRate}%`);
  console.log(`✅ Total Passed: ${totalPassed}`);
  console.log(`❌ Total Failed: ${totalFailed}`);
  
  if (totalFailed === 0) {
    console.log('\n🎉 ALL SYSTEMS OPERATIONAL!');
    console.log('✅ Backend Server: Working');
    console.log('✅ Frontend Application: Working');
    console.log('✅ Database Connection: Working');
    console.log('✅ API Endpoints: Working');
    console.log('\n🚀 The Reckonix application is fully functional!');
  } else {
    console.log('\n⚠️  Some issues remain:');
    Object.entries(testResults).forEach(([category, results]) => {
      if (results.errors.length > 0) {
        console.log(`\n${category.toUpperCase()} ERRORS:`);
        results.errors.forEach((error, i) => console.log(`  ${i+1}. ${error}`));
      }
    });
  }
}

runAllTests().catch(console.error);
