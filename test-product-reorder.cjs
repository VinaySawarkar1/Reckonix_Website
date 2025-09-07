const http = require('http');

const testData = [
  { id: 91, rank: 1 },
  { id: 90, rank: 2 }
];

const postData = JSON.stringify(testData);

console.log('🧪 Testing Product Reorder Fix');
console.log('Data:', testData);
console.log('JSON:', postData);

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/products/rank',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`\n📊 Response Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📄 Response Body:', data);
    
    if (res.statusCode === 200) {
      console.log('\n✅ SUCCESS: Product rank update worked!');
      console.log('🎉 The fix is working correctly!');
    } else {
      console.log('\n❌ ERROR: Product rank update failed');
      console.log('🔍 The error is still happening');
    }
  });
});

req.on('error', (e) => {
  console.error(`\n💥 Request Error: ${e.message}`);
  console.log('🔍 Make sure the server is running on port 5001');
});

req.write(postData);
req.end();
