import http from 'http';

async function testNoDefaultImages() {
  console.log('🔍 Testing No Default Images...\n');
  
  try {
    const result = await fetch('http://localhost:5001/api/products');
    const products = await result.json();
    
    console.log(`📦 Found ${products.length} products`);
    
    let productsWithImages = 0;
    let productsWithDefaultImages = 0;
    let productsWithNullImages = 0;
    
    console.log('\n📋 CHECKING FOR DEFAULT IMAGES:');
    console.log('==============================');
    
    products.forEach((product, index) => {
      const hasImagesArray = product.images && product.images.length > 0;
      const hasMainImage = product.image;
      const hasImageUrl = product.imageUrl;
      
      if (hasImagesArray || hasMainImage) {
        productsWithImages++;
      }
      
      if (hasImageUrl && !hasMainImage) {
        productsWithDefaultImages++;
        console.log(`❌ ${product.name} - Has imageUrl fallback: ${product.imageUrl}`);
      }
      
      if (!hasImagesArray && !hasMainImage) {
        productsWithNullImages++;
        if (index < 10) { // Show first 10 products without images
          console.log(`✅ ${product.name} - No images (correct)`);
        }
      }
      
      if (index < 10) { // Show first 10 products
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   - Images array: ${hasImagesArray ? `Yes (${product.images.length} images)` : 'No'}`);
        console.log(`   - Main image: ${hasMainImage ? `Yes (${product.image})` : 'No'}`);
        console.log(`   - imageUrl field: ${hasImageUrl ? `Yes (${product.imageUrl})` : 'No'}`);
        console.log('');
      }
    });
    
    console.log('\n📊 SUMMARY:');
    console.log('===========');
    console.log(`✅ Products with database images: ${productsWithImages}`);
    console.log(`❌ Products with default imageUrl fallback: ${productsWithDefaultImages}`);
    console.log(`✅ Products with no images (correct): ${productsWithNullImages}`);
    
    if (productsWithDefaultImages === 0) {
      console.log('\n🎉 SUCCESS: No default images are being shown!');
      console.log('✅ Only images from the database are displayed');
      console.log('✅ Products without database images show no image');
    } else {
      console.log('\n⚠️  WARNING: Some products still have default imageUrl fallback');
    }
    
  } catch (error) {
    console.error('❌ Error testing products:', error.message);
  }
}

testNoDefaultImages();



