const { MongoClient } = require('mongodb');
const fetch = require('node-fetch');

// Test configuration
const BASE_URL = 'http://localhost:5001';
const MONGODB_URL = 'mongodb+srv://vinaysarkar0:vinasawarkar@cluster0.4adl4tl.mongodb.net/reckonix?retryWrites=true&w=majority';

// Test results storage
const testResults = {
  passed: 0,
  failed: 0,
  errors: []
};

// Helper function to make HTTP requests
async function makeRequest(method, endpoint, data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const result = await response.json();
    
    return {
      status: response.status,
      data: result,
      success: response.ok
    };
  } catch (error) {
    return {
      status: 0,
      data: null,
      success: false,
      error: error.message
    };
  }
}

// Test database connection
async function testDatabaseConnection() {
  console.log('\n🔍 Testing Database Connection...');
  try {
    const client = new MongoClient(MONGODB_URL);
    await client.connect();
    const db = client.db('reckonix');
    await db.admin().ping();
    console.log('✅ Database connection successful');
    testResults.passed++;
    await client.close();
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    testResults.failed++;
    testResults.errors.push(`Database connection: ${error.message}`);
  }
}

// Test API endpoints
async function testAPIEndpoints() {
  console.log('\n🔍 Testing API Endpoints...');
  
  const endpoints = [
    { method: 'GET', path: '/health', name: 'Health Check' },
    { method: 'GET', path: '/api/test', name: 'Test Endpoint' },
    { method: 'GET', path: '/api/products', name: 'Get Products' },
    { method: 'GET', path: '/api/categories', name: 'Get Categories' },
    { method: 'GET', path: '/api/team', name: 'Get Team Members' },
    { method: 'GET', path: '/api/customers', name: 'Get Customers' },
    { method: 'GET', path: '/api/events', name: 'Get Events' },
    { method: 'GET', path: '/api/testimonials', name: 'Get Testimonials' },
    { method: 'GET', path: '/api/industries', name: 'Get Industries' },
    { method: 'GET', path: '/api/jobs', name: 'Get Jobs' },
    { method: 'GET', path: '/api/gallery', name: 'Get Gallery' },
    { method: 'GET', path: '/api/quotes', name: 'Get Quotes' },
    { method: 'GET', path: '/api/messages', name: 'Get Messages' },
    { method: 'GET', path: '/api/analytics', name: 'Get Analytics' },
    { method: 'GET', path: '/api/media/settings', name: 'Get Media Settings' }
  ];

  for (const endpoint of endpoints) {
    try {
      const result = await makeRequest(endpoint.method, endpoint.path);
      if (result.success) {
        console.log(`✅ ${endpoint.name}: ${result.status}`);
        testResults.passed++;
      } else {
        console.log(`❌ ${endpoint.name}: ${result.status} - ${result.error || 'Unknown error'}`);
        testResults.failed++;
        testResults.errors.push(`${endpoint.name}: ${result.status} - ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: Error - ${error.message}`);
      testResults.failed++;
      testResults.errors.push(`${endpoint.name}: ${error.message}`);
    }
  }
}

// Test authentication
async function testAuthentication() {
  console.log('\n🔍 Testing Authentication...');
  
  try {
    // Test login with correct credentials
    const loginResult = await makeRequest('POST', '/api/auth/login', {
      username: 'admin',
      password: 'Reckonix@#$12345'
    });
    
    if (loginResult.success) {
      console.log('✅ Admin login successful');
      testResults.passed++;
    } else {
      console.log('❌ Admin login failed:', loginResult.data);
      testResults.failed++;
      testResults.errors.push(`Admin login: ${loginResult.data?.error || 'Unknown error'}`);
    }
    
    // Test login with incorrect credentials
    const wrongLoginResult = await makeRequest('POST', '/api/auth/login', {
      username: 'wrong',
      password: 'wrong'
    });
    
    if (!wrongLoginResult.success && wrongLoginResult.status === 401) {
      console.log('✅ Wrong credentials properly rejected');
      testResults.passed++;
    } else {
      console.log('❌ Wrong credentials not properly rejected');
      testResults.failed++;
      testResults.errors.push('Wrong credentials not properly rejected');
    }
    
  } catch (error) {
    console.log('❌ Authentication test error:', error.message);
    testResults.failed++;
    testResults.errors.push(`Authentication test: ${error.message}`);
  }
}

// Test product operations
async function testProductOperations() {
  console.log('\n🔍 Testing Product Operations...');
  
  try {
    // Test creating a product
    const testProduct = {
      name: 'Test Product',
      category: 'Test Category',
      description: 'Test Description',
      shortDescription: 'Test Short Description',
      fullTechnicalInfo: 'Test Technical Info',
      specifications: [],
      featuresBenefits: [],
      applications: [],
      certifications: [],
      imageUrl: '/test-image.jpg',
      homeFeatured: false,
      rank: 0
    };
    
    const createResult = await makeRequest('POST', '/api/products', testProduct);
    if (createResult.success) {
      console.log('✅ Product creation successful');
      testResults.passed++;
      
      // Test updating the product
      const productId = createResult.data._id || createResult.data.id;
      if (productId) {
        const updateResult = await makeRequest('PUT', `/api/products/${productId}`, {
          name: 'Updated Test Product'
        });
        
        if (updateResult.success) {
          console.log('✅ Product update successful');
          testResults.passed++;
        } else {
          console.log('❌ Product update failed:', updateResult.data);
          testResults.failed++;
          testResults.errors.push(`Product update: ${updateResult.data?.message || 'Unknown error'}`);
        }
        
        // Test deleting the product
        const deleteResult = await makeRequest('DELETE', `/api/products/${productId}`);
        if (deleteResult.success) {
          console.log('✅ Product deletion successful');
          testResults.passed++;
        } else {
          console.log('❌ Product deletion failed:', deleteResult.data);
          testResults.failed++;
          testResults.errors.push(`Product deletion: ${deleteResult.data?.message || 'Unknown error'}`);
        }
      }
    } else {
      console.log('❌ Product creation failed:', createResult.data);
      testResults.failed++;
      testResults.errors.push(`Product creation: ${createResult.data?.message || 'Unknown error'}`);
    }
    
  } catch (error) {
    console.log('❌ Product operations test error:', error.message);
    testResults.failed++;
    testResults.errors.push(`Product operations: ${error.message}`);
  }
}

// Test file upload functionality
async function testFileUpload() {
  console.log('\n🔍 Testing File Upload...');
  
  try {
    // This would require actual file upload testing
    // For now, just test if the endpoint exists
    const result = await makeRequest('GET', '/api/media/settings');
    if (result.success) {
      console.log('✅ Media settings endpoint accessible');
      testResults.passed++;
    } else {
      console.log('❌ Media settings endpoint failed:', result.data);
      testResults.failed++;
      testResults.errors.push(`Media settings: ${result.data?.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.log('❌ File upload test error:', error.message);
    testResults.failed++;
    testResults.errors.push(`File upload test: ${error.message}`);
  }
}

// Test error handling
async function testErrorHandling() {
  console.log('\n🔍 Testing Error Handling...');
  
  try {
    // Test 404 for non-existent product
    const result = await makeRequest('GET', '/api/products/nonexistent');
    if (!result.success && result.status === 404) {
      console.log('✅ 404 error handling works');
      testResults.passed++;
    } else {
      console.log('❌ 404 error handling failed');
      testResults.failed++;
      testResults.errors.push('404 error handling failed');
    }
    
    // Test invalid data handling
    const invalidResult = await makeRequest('POST', '/api/products', {
      // Missing required fields
    });
    
    if (!invalidResult.success && invalidResult.status === 400) {
      console.log('✅ Invalid data handling works');
      testResults.passed++;
    } else {
      console.log('❌ Invalid data handling failed');
      testResults.failed++;
      testResults.errors.push('Invalid data handling failed');
    }
    
  } catch (error) {
    console.log('❌ Error handling test error:', error.message);
    testResults.failed++;
    testResults.errors.push(`Error handling test: ${error.message}`);
  }
}

// Main test function
async function runAllTests() {
  console.log('🚀 Starting Comprehensive Application Testing...\n');
  
  await testDatabaseConnection();
  await testAPIEndpoints();
  await testAuthentication();
  await testProductOperations();
  await testFileUpload();
  await testErrorHandling();
  
  // Print summary
  console.log('\n📊 Test Summary:');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(2)}%`);
  
  if (testResults.errors.length > 0) {
    console.log('\n🚨 Errors Found:');
    testResults.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }
  
  console.log('\n✨ Testing Complete!');
}

// Run the tests
runAllTests().catch(console.error);



