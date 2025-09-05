// Test all API endpoints across the website and admin panel
const baseUrl = 'http://localhost:5001';

const endpoints = [
  // Public website endpoints
  { method: 'GET', path: '/api/products', description: 'Products listing' },
  { method: 'GET', path: '/api/categories', description: 'Product categories' },
  { method: 'GET', path: '/api/team', description: 'Team members' },
  { method: 'GET', path: '/api/testimonials', description: 'Customer testimonials' },
  { method: 'GET', path: '/api/events', description: 'Company events' },
  { method: 'GET', path: '/api/customers', description: 'Customer list' },
  { method: 'GET', path: '/api/industries', description: 'Industries served' },
  { method: 'GET', path: '/api/jobs', description: 'Job listings' },
  { method: 'GET', path: '/api/applications', description: 'Job applications' },
  { method: 'GET', path: '/api/gallery', description: 'Gallery images' },
  { method: 'GET', path: '/api/catalog/main-catalog', description: 'Main catalog' },
  
  // Admin panel endpoints
  { method: 'GET', path: '/api/quotes', description: 'Quote requests' },
  { method: 'GET', path: '/api/messages', description: 'Contact messages' },
  { method: 'GET', path: '/api/analytics/website-views', description: 'Website analytics' },
  { method: 'GET', path: '/api/analytics/product-views', description: 'Product view analytics' },
  
  // Authentication endpoints
  { method: 'POST', path: '/api/auth/login', description: 'Admin login' },
  { method: 'POST', path: '/api/auth/logout', description: 'Admin logout' },
  
  // Chatbot endpoints
  { method: 'GET', path: '/api/chatbot-summaries', description: 'Chatbot conversations' },
  { method: 'POST', path: '/api/chatbot-summaries', description: 'Save chatbot conversation' },
  
  // File upload endpoints
  { method: 'POST', path: '/api/upload', description: 'File upload' },
  
  // Static file serving
  { method: 'GET', path: '/uploads/test.jpg', description: 'Static file serving' },
];

async function testEndpoint(endpoint) {
  try {
    const url = baseUrl + endpoint.path;
    const options = {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    // Add sample data for POST requests
    if (endpoint.method === 'POST') {
      if (endpoint.path === '/api/auth/login') {
        options.body = JSON.stringify({
          username: 'admin',
          password: 'admin123'
        });
      } else if (endpoint.path === '/api/chatbot-summaries') {
        options.body = JSON.stringify({
          userMessage: 'test',
          botResponse: 'test response',
          timestamp: new Date().toISOString()
        });
      } else {
        options.body = JSON.stringify({ test: 'data' });
      }
    }
    
    const response = await fetch(url, options);
    const status = response.status;
    const contentType = response.headers.get('content-type') || 'unknown';
    
    let result = '✅';
    if (status >= 400) {
      result = '❌';
    } else if (status >= 300) {
      result = '⚠️';
    }
    
    console.log(`${result} ${endpoint.method} ${endpoint.path} - ${status} (${contentType}) - ${endpoint.description}`);
    
    if (status >= 400) {
      const errorText = await response.text();
      console.log(`   Error: ${errorText.substring(0, 100)}...`);
    }
    
    return { success: status < 400, status, description: endpoint.description };
  } catch (error) {
    console.log(`❌ ${endpoint.method} ${endpoint.path} - ERROR - ${endpoint.description}`);
    console.log(`   Error: ${error.message}`);
    return { success: false, status: 'ERROR', description: endpoint.description };
  }
}

async function testAllEndpoints() {
  console.log('🔍 Testing all API endpoints...\n');
  
  const results = [];
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push(result);
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Successful: ${successful}/${total}`);
  console.log(`❌ Failed: ${total - successful}/${total}`);
  console.log(`📈 Success Rate: ${((successful / total) * 100).toFixed(1)}%`);
  
  if (successful < total) {
    console.log('\n❌ Failed Endpoints:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.description} (${r.status})`);
    });
  }
  
  console.log('\n🎯 All endpoints tested!');
}

// Run the tests
testAllEndpoints().catch(console.error);

