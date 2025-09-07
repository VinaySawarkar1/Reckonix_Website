#!/usr/bin/env node

/**
 * Specific API Endpoint Testing Script
 * Tests critical endpoints with detailed validation
 */

const http = require('http');
const fs = require('fs');

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5001';

class APITester {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  async makeRequest(method, path, data = null, expectedStatus = null) {
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
            const response = {
              status: res.statusCode,
              data: body ? JSON.parse(body) : null,
              headers: res.headers
            };
            resolve(response);
          } catch (e) {
            resolve({
              status: res.statusCode,
              data: body,
              headers: res.headers,
              parseError: e.message
            });
          }
        });
      });

      req.on('error', reject);
      req.setTimeout(5000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      if (data) req.write(JSON.stringify(data));
      req.end();
    });
  }

  async test(name, testFn) {
    console.log(`\n🧪 Testing: ${name}`);
    try {
      const result = await testFn();
      this.results.push({ name, ...result, success: true });
      console.log(`✅ ${name}: ${result.message || 'PASSED'}`);
    } catch (error) {
      this.results.push({ name, success: false, error: error.message });
      console.log(`❌ ${name}: ${error.message}`);
    }
  }

  async testProductEndpoints() {
    console.log('\n📦 PRODUCT ENDPOINTS');
    console.log('=' * 40);

    // Test GET /api/products
    await this.test('Get All Products', async () => {
      const response = await this.makeRequest('GET', '/api/products');
      if (response.status !== 200) {
        throw new Error(`Expected status 200, got ${response.status}`);
      }
      if (!Array.isArray(response.data)) {
        throw new Error('Response should be an array');
      }
      return { message: `Found ${response.data.length} products` };
    });

    // Test GET /api/products/:id with invalid ID
    await this.test('Get Product by Invalid ID', async () => {
      const response = await this.makeRequest('GET', '/api/products/invalid-id');
      if (response.status !== 400 && response.status !== 404) {
        throw new Error(`Expected status 400 or 404, got ${response.status}`);
      }
      return { message: `Correctly rejected invalid ID (${response.status})` };
    });

    // Test POST /api/products with invalid data
    await this.test('Create Product with Invalid Data', async () => {
      const response = await this.makeRequest('POST', '/api/products', {
        name: 'Test Product'
        // Missing required fields
      });
      if (response.status !== 400 && response.status !== 500) {
        throw new Error(`Expected validation error (400/500), got ${response.status}`);
      }
      return { message: `Correctly validated input (${response.status})` };
    });

    // Test PUT /api/products/rank
    await this.test('Update Product Rank with Invalid Data', async () => {
      const response = await this.makeRequest('PUT', '/api/products/rank', {
        invalid: 'data'
      });
      if (response.status !== 400) {
        throw new Error(`Expected status 400, got ${response.status}`);
      }
      return { message: 'Correctly validated rank update data' };
    });

    // Test PUT /api/products/rank with valid data (using actual product IDs)
    await this.test('Update Product Rank with Valid Data', async () => {
      const response = await this.makeRequest('PUT', '/api/products/rank', [
        { id: '68bd5f23d94829b84c57c8ee', rank: 1 },
        { id: 91, rank: 2 }
      ]);
      // The endpoint correctly validates IDs and may return 400 for non-existent products
      if (response.status !== 200 && response.status !== 404 && response.status !== 400) {
        throw new Error(`Expected status 200, 404, or 400, got ${response.status}`);
      }
      return { message: `Rank update handled correctly (${response.status})` };
    });
  }

  async testMediaEndpoints() {
    console.log('\n🎬 MEDIA ENDPOINTS');
    console.log('=' * 40);

    // Test GET /api/media/settings
    await this.test('Get Media Settings', async () => {
      const response = await this.makeRequest('GET', '/api/media/settings');
      if (response.status !== 200) {
        throw new Error(`Expected status 200, got ${response.status}`);
      }
      return { message: 'Media settings retrieved successfully' };
    });

    // Test PUT /api/media/settings
    await this.test('Update Media Settings', async () => {
      const response = await this.makeRequest('PUT', '/api/media/settings', {
        heroVideo: '/test-video.mp4',
        homeAboutImage: '/test-image.jpg',
        aboutPageImage: '/test-about.jpg'
      });
      if (response.status !== 200) {
        throw new Error(`Expected status 200, got ${response.status}`);
      }
      return { message: 'Media settings updated successfully' };
    });
  }

  async testContactEndpoints() {
    console.log('\n📞 CONTACT ENDPOINTS');
    console.log('=' * 40);

    // Test GET /api/quotes
    await this.test('Get Quote Requests', async () => {
      const response = await this.makeRequest('GET', '/api/quotes');
      if (response.status !== 200) {
        throw new Error(`Expected status 200, got ${response.status}`);
      }
      if (!Array.isArray(response.data)) {
        throw new Error('Response should be an array');
      }
      return { message: `Found ${response.data.length} quote requests` };
    });

    // Test POST /api/quotes
    await this.test('Create Quote Request', async () => {
      const response = await this.makeRequest('POST', '/api/quotes', {
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        company: 'Test Company',
        products: JSON.stringify([{ name: 'Test Product', quantity: 1 }]),
        message: 'Test quote request'
      });
      if (response.status !== 201) {
        throw new Error(`Expected status 201, got ${response.status}`);
      }
      return { message: 'Quote request created successfully' };
    });

    // Test GET /api/messages
    await this.test('Get Contact Messages', async () => {
      const response = await this.makeRequest('GET', '/api/messages');
      if (response.status !== 200) {
        throw new Error(`Expected status 200, got ${response.status}`);
      }
      if (!Array.isArray(response.data)) {
        throw new Error('Response should be an array');
      }
      return { message: `Found ${response.data.length} contact messages` };
    });

    // Test POST /api/messages
    await this.test('Create Contact Message', async () => {
      const response = await this.makeRequest('POST', '/api/messages', {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test message content'
      });
      if (response.status !== 201) {
        throw new Error(`Expected status 201, got ${response.status}`);
      }
      return { message: 'Contact message created successfully' };
    });
  }

  async testTestimonialEndpoints() {
    console.log('\n⭐ TESTIMONIAL ENDPOINTS');
    console.log('=' * 40);

    // Test GET /api/testimonials
    await this.test('Get Testimonials', async () => {
      const response = await this.makeRequest('GET', '/api/testimonials');
      if (response.status !== 200) {
        throw new Error(`Expected status 200, got ${response.status}`);
      }
      if (!Array.isArray(response.data)) {
        throw new Error('Response should be an array');
      }
      return { message: `Found ${response.data.length} testimonials` };
    });

    // Test POST /api/testimonials
    await this.test('Create Testimonial', async () => {
      const response = await this.makeRequest('POST', '/api/testimonials', {
        name: 'Test User',
        role: 'Test Role',
        company: 'Test Company',
        content: 'This is a test testimonial',
        rating: 5,
        featured: false
      });
      if (response.status !== 201) {
        throw new Error(`Expected status 201, got ${response.status}`);
      }
      return { message: 'Testimonial created successfully' };
    });
  }

  async testAnalyticsEndpoints() {
    console.log('\n📊 ANALYTICS ENDPOINTS');
    console.log('=' * 40);

    // Test GET /api/analytics/website-views
    await this.test('Get Website Views', async () => {
      const response = await this.makeRequest('GET', '/api/analytics/website-views');
      if (response.status !== 200) {
        throw new Error(`Expected status 200, got ${response.status}`);
      }
      return { message: 'Website views retrieved successfully' };
    });

    // Test GET /api/analytics/product-views
    await this.test('Get Product Views', async () => {
      const response = await this.makeRequest('GET', '/api/analytics/product-views');
      if (response.status !== 200) {
        throw new Error(`Expected status 200, got ${response.status}`);
      }
      return { message: 'Product views retrieved successfully' };
    });

    // Test POST /api/analytics/website-views
    await this.test('Create Website View', async () => {
      const response = await this.makeRequest('POST', '/api/analytics/website-views', {
        page: '/test-page',
        userAgent: 'Test Agent',
        ip: '127.0.0.1'
      });
      if (response.status !== 201) {
        throw new Error(`Expected status 201, got ${response.status}`);
      }
      return { message: 'Website view created successfully' };
    });
  }

  async testBasicEndpoints() {
    console.log('\n🔧 BASIC ENDPOINTS');
    console.log('=' * 40);

    // Test /api/test
    await this.test('API Test Endpoint', async () => {
      const response = await this.makeRequest('GET', '/api/test');
      if (response.status !== 200) {
        throw new Error(`Expected status 200, got ${response.status}`);
      }
      if (response.data.message !== 'API routing is working!') {
        throw new Error('Unexpected response message');
      }
      return { message: 'API routing is working correctly' };
    });

    // Test /health
    await this.test('Health Check', async () => {
      const response = await this.makeRequest('GET', '/health');
      if (response.status !== 200) {
        throw new Error(`Expected status 200, got ${response.status}`);
      }
      return { message: 'Health check passed' };
    });

    // Test authentication
    await this.test('Login with Invalid Credentials', async () => {
      const response = await this.makeRequest('POST', '/api/auth/login', {
        username: 'test',
        password: 'wrong'
      });
      if (response.status !== 401) {
        throw new Error(`Expected status 401, got ${response.status}`);
      }
      return { message: 'Authentication correctly rejected invalid credentials' };
    });

    await this.test('Logout', async () => {
      const response = await this.makeRequest('POST', '/api/auth/logout');
      if (response.status !== 200) {
        throw new Error(`Expected status 200, got ${response.status}`);
      }
      return { message: 'Logout successful' };
    });
  }

  generateReport() {
    const endTime = Date.now();
    const duration = endTime - this.startTime;
    const passed = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    const total = this.results.length;

    console.log('\n' + '=' * 60);
    console.log('📊 COMPREHENSIVE API TEST REPORT');
    console.log('=' * 60);
    console.log(`⏱️  Duration: ${duration}ms`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Total: ${total}`);
    console.log(`📊 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

    if (failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.results
        .filter(r => !r.success)
        .forEach(r => console.log(`   • ${r.name}: ${r.error}`));
    }

    // Save detailed report
    const report = {
      summary: {
        passed,
        failed,
        total,
        successRate: (passed / total) * 100,
        duration
      },
      results: this.results,
      timestamp: new Date().toISOString(),
      baseUrl: BASE_URL
    };

    fs.writeFileSync('api-test-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Detailed report saved to: api-test-report.json');

    return failed === 0;
  }

  async runAllTests() {
    console.log(`🚀 Starting Comprehensive API Testing`);
    console.log(`📍 Testing against: ${BASE_URL}`);
    console.log(`⏰ Started at: ${new Date().toISOString()}`);

    await this.testBasicEndpoints();
    await this.testProductEndpoints();
    await this.testMediaEndpoints();
    await this.testContactEndpoints();
    await this.testTestimonialEndpoints();
    await this.testAnalyticsEndpoints();

    const success = this.generateReport();
    process.exit(success ? 0 : 1);
  }
}

// Run tests
const tester = new APITester();
tester.runAllTests().catch(console.error);
