const http = require('http');
const { MongoClient } = require('mongodb');

console.log('🚀 SOLVING ISSUES ONE BY ONE\n');

// Issue 1: Test Database Connection
async function testDatabaseConnection() {
  console.log('🔧 ISSUE #1: Testing Database Connection...');
  
  try {
    const client = new MongoClient('mongodb+srv://vinaysarkar0:vinasawarkar@cluster0.4adl4tl.mongodb.net/reckonix?retryWrites=true&w=majority&authSource=admin');
    await client.connect();
    console.log('✅ Database Connected Successfully');
    
    const db = client.db('reckonix');
    const collections = await db.listCollections().toArray();
    console.log(`✅ Found ${collections.length} collections`);
    
    await client.close();
    return true;
  } catch (error) {
    console.log('❌ Database Connection Failed:', error.message);
    return false;
  }
}

// Issue 2: Test API Endpoints
async function testAPIEndpoints() {
  console.log('\n🔧 ISSUE #2: Testing API Endpoints...');
  
  const endpoints = [
    '/api/test',
    '/health',
    '/api/products',
    '/api/categories',
    '/api/team',
    '/api/customers',
    '/api/events',
    '/api/testimonials'
  ];
  
  let working = 0;
  let failing = 0;
  
  for (const endpoint of endpoints) {
    try {
      const result = await testEndpoint(endpoint);
      if (result) {
        console.log(`✅ ${endpoint}: Working`);
        working++;
      } else {
        console.log(`❌ ${endpoint}: Failing`);
        failing++;
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: Error - ${error.message}`);
      failing++;
    }
  }
  
  console.log(`\n📊 API Results: ${working} working, ${failing} failing`);
  return working > failing;
}

function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5001,
      path: endpoint,
      method: 'GET',
      timeout: 3000
    }, (res) => {
      resolve(res.statusCode === 200);
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => resolve(false));
    req.end();
  });
}

// Issue 3: Test Frontend
async function testFrontend() {
  console.log('\n🔧 ISSUE #3: Testing Frontend...');
  
  try {
    const result = await testFrontendEndpoint();
    if (result) {
      console.log('✅ Frontend is accessible');
      return true;
    } else {
      console.log('❌ Frontend is not accessible');
      return false;
    }
  } catch (error) {
    console.log('❌ Frontend test failed:', error.message);
    return false;
  }
}

function testFrontendEndpoint() {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5173,
      path: '/',
      method: 'GET',
      timeout: 3000
    }, (res) => {
      resolve(res.statusCode === 200);
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => resolve(false));
    req.end();
  });
}

// Issue 4: Test Authentication
async function testAuthentication() {
  console.log('\n🔧 ISSUE #4: Testing Authentication...');
  
  try {
    const result = await testLogin();
    if (result) {
      console.log('✅ Authentication working');
      return true;
    } else {
      console.log('❌ Authentication failing');
      return false;
    }
  } catch (error) {
    console.log('❌ Authentication test failed:', error.message);
    return false;
  }
}

function testLogin() {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      username: 'admin',
      password: 'Reckonix@#$12345'
    });

    const req = http.request({
      hostname: 'localhost',
      port: 5001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 3000
    }, (res) => {
      resolve(res.statusCode === 200);
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => resolve(false));
    req.write(postData);
    req.end();
  });
}

// Main execution
async function solveAllIssues() {
  console.log('🎯 Starting comprehensive issue resolution...\n');
  
  const results = {
    database: await testDatabaseConnection(),
    api: await testAPIEndpoints(),
    frontend: await testFrontend(),
    auth: await testAuthentication()
  };
  
  console.log('\n📊 FINAL RESULTS:');
  console.log(`Database: ${results.database ? '✅' : '❌'}`);
  console.log(`API Endpoints: ${results.api ? '✅' : '❌'}`);
  console.log(`Frontend: ${results.frontend ? '✅' : '❌'}`);
  console.log(`Authentication: ${results.auth ? '✅' : '❌'}`);
  
  const workingCount = Object.values(results).filter(Boolean).length;
  const totalCount = Object.keys(results).length;
  
  console.log(`\n🎯 Overall Status: ${workingCount}/${totalCount} systems working`);
  console.log(`📈 Success Rate: ${((workingCount / totalCount) * 100).toFixed(1)}%`);
  
  if (workingCount === totalCount) {
    console.log('\n🎉 ALL ISSUES RESOLVED! Application is fully functional.');
  } else {
    console.log('\n⚠️  Some issues remain. Check the logs above for details.');
  }
}

solveAllIssues().catch(console.error);
