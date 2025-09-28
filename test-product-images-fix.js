import http from 'http';

async function testProductImages() {
  console.log('🔍 Testing Product Images Fix...\n');
  
  try {
    const result = await fetch('http://localhost:5001/api/products');
    const products = await result.json();
    
    console.log(`📦 Found ${products.length} products`);
    
    let productsWithImages = 0;
    let productsWithoutImages = 0;
    
    products.forEach((product, index) => {
      const hasImages = product.images && product.images.length > 0;
      const hasImageUrl = product.image || product.imageUrl;
      
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   - Has images array: ${hasImages ? `Yes (${product.images.length} images)` : 'No'}`);
      console.log(`   - Has main image: ${hasImageUrl ? 'Yes' : 'No'}`);
      if (hasImageUrl) {
        console.log(`   - Image URL: ${product.image || product.imageUrl}`);
      }
      console.log('');
      
      if (hasImages || hasImageUrl) {
        productsWithImages++;
      } else {
        productsWithoutImages++;
      }
    });
    
    console.log('📊 SUMMARY:');
    console.log(`✅ Products with images: ${productsWithImages}`);
    console.log(`❌ Products without images: ${productsWithoutImages}`);
    console.log(`📈 Success rate: ${((productsWithImages / products.length) * 100).toFixed(1)}%`);
    
    if (productsWithImages > 0) {
      console.log('\n🎉 Image fix is working! Products now have images.');
    } else {
      console.log('\n⚠️  Image fix needs more work. No products have images yet.');
    }
    
  } catch (error) {
    console.error('❌ Error testing products:', error.message);
  }
}

testProductImages();



