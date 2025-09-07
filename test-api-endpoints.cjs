#!/usr/bin/env node

/**
 * API Endpoint Testing Script for Reckonix
 */

const http = require('http');
const https = require('https');

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5001';
const results = { passed: 0, failed: 0, total: 0 };

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname,
      method: method,
      headers: { 'Content-Type': 'application/json' }
    };

    if (data) {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function test(name, testFn) {
  results.total++;
  try {
    const result = await testFn();
    if (result.success) {
      results.passed++;
      console.log(`✅ ${name}`);
    } else {
      results.failed++;
      console.log(`❌ ${name}: ${result.error}`);
    }
  } catch (error) {
    results.failed++;
    console.log(`❌ ${name}: ${error.message}`);
  }
}

async function runTests() {
  console.log(`🚀 Testing API endpoints at ${BASE_URL}\n`);

  // Basic endpoints
  await test('API Test Endpoint', async () => {
    const res = await makeRequest('GET', '/api/test');
    return { success: res.status === 200 };
  });

  await test('Health Check', async () => {
    const res = await makeRequest('GET', '/health');
    return { success: res.status === 200 };
  });

  // Product endpoints
  await test('Get Products', async () => {
    const res = await makeRequest('GET', '/api/products');
    return { success: res.status === 200 && Array.isArray(res.data) };
  });

  await test('Get Categories', async () => {
    const res = await makeRequest('GET', '/api/categories');
    return { success: res.status === 200 };
  });

  await test('Get Main Catalog', async () => {
    const res = await makeRequest('GET', '/api/catalog/main-catalog');
    return { success: res.status === 200 };
  });

  // Chatbot endpoints
  await test('Get Chatbot Summaries', async () => {
    const res = await makeRequest('GET', '/api/chatbot-summaries');
    return { success: res.status === 200 && Array.isArray(res.data) };
  });

  await test('Create Chatbot Summary', async () => {
    const res = await makeRequest('POST', '/api/chatbot-summaries', {
      userMessage: 'Test',
      botResponse: 'Test response',
      userInfo: { ip: '127.0.0.1' }
    });
    return { success: res.status === 201 };
  });

  // Team endpoints
  await test('Get Team', async () => {
    const res = await makeRequest('GET', '/api/team');
    return { success: res.status === 200 && Array.isArray(res.data) };
  });

  // Customer/Industry endpoints
  await test('Get Customers', async () => {
    const res = await makeRequest('GET', '/api/customers');
    return { success: res.status === 200 && Array.isArray(res.data) };
  });

  await test('Get Industries', async () => {
    const res = await makeRequest('GET', '/api/industries');
    return { success: res.status === 200 && Array.isArray(res.data) };
  });

  // Jobs and Events
  await test('Get Jobs', async () => {
    const res = await makeRequest('GET', '/api/jobs');
    return { success: res.status === 200 && Array.isArray(res.data) };
  });

  await test('Get Events', async () => {
    const res = await makeRequest('GET', '/api/events');
    return { success: res.status === 200 && Array.isArray(res.data) };
  });

  // Testimonials
  await test('Get Testimonials', async () => {
    const res = await makeRequest('GET', '/api/testimonials');
    return { success: res.status === 200 && Array.isArray(res.data) };
  });

  await test('Create Testimonial', async () => {
    const res = await makeRequest('POST', '/api/testimonials', {
      name: 'Test User',
      role: 'Test Role',
      company: 'Test Company',
      content: 'Test content',
      rating: 5,
      featured: false
    });
    return { success: res.status === 201 };
  });

  // Applications and Gallery
  await test('Get Applications', async () => {
    const res = await makeRequest('GET', '/api/applications');
    return { success: res.status === 200 && Array.isArray(res.data) };
  });

  await test('Get Gallery', async () => {
    const res = await makeRequest('GET', '/api/gallery');
    return { success: res.status === 200 && Array.isArray(res.data) };
  });

  // Quotes and Messages
  await test('Get Quotes', async () => {
    const res = await makeRequest('GET', '/api/quotes');
    return { success: res.status === 200 && Array.isArray(res.data) };
  });

  await test('Create Quote', async () => {
    const res = await makeRequest('POST', '/api/quotes', {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      company: 'Test Company',
      products: JSON.stringify([{ name: 'Test Product', quantity: 1 }]),
      message: 'Test quote'
    });
    return { success: res.status === 201 };
  });

  await test('Get Messages', async () => {
    const res = await makeRequest('GET', '/api/messages');
    return { success: res.status === 200 && Array.isArray(res.data) };
  });

  await test('Create Message', async () => {
    const res = await makeRequest('POST', '/api/messages', {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'Test message'
    });
    return { success: res.status === 201 };
  });

  // Analytics
  await test('Get Website Views', async () => {
    const res = await makeRequest('GET', '/api/analytics/website-views');
    return { success: res.status === 200 };
  });

  await test('Get Product Views', async () => {
    const res = await makeRequest('GET', '/api/analytics/product-views');
    return { success: res.status === 200 };
  });

  await test('Create Website View', async () => {
    const res = await makeRequest('POST', '/api/analytics/website-views', {
      page: '/test',
      userAgent: 'Test Agent',
      ip: '127.0.0.1'
    });
    return { success: res.status === 201 };
  });

  // Media endpoints
  await test('Get Media Settings', async () => {
    const res = await makeRequest('GET', '/api/media/settings');
    return { success: res.status === 200 };
  });

  await test('Update Media Settings', async () => {
    const res = await makeRequest('PUT', '/api/media/settings', {
      heroVideo: '/test-video.mp4',
      homeAboutImage: '/test-image.jpg',
      aboutPageImage: '/test-about.jpg'
    });
    return { success: res.status === 200 };
  });

  // Product rank endpoint (newly added)
  await test('Update Product Rank (Invalid)', async () => {
    const res = await makeRequest('PUT', '/api/products/rank', { invalid: 'data' });
    return { success: res.status === 400 };
  });

  // Authentication
  await test('Login (Invalid)', async () => {
    const res = await makeRequest('POST', '/api/auth/login', {
      username: 'test',
      password: 'wrong'
    });
    return { success: res.status === 401 };
  });

  await test('Logout', async () => {
    const res = await makeRequest('POST', '/api/auth/logout');
    return { success: res.status === 200 };
  });

  // Results
  console.log(`\n📊 Results: ${results.passed}/${results.total} passed`);
  console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  
  if (results.failed > 0) {
    console.log(`❌ ${results.failed} tests failed`);
    process.exit(1);
  } else {
    console.log('🎉 All tests passed!');
    process.exit(0);
  }
}

runTests().catch(console.error);
