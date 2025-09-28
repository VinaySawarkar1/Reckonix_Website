import { MongoClient } from 'mongodb';

const connectionString = 'mongodb+srv://vinay:vinay@cluster0.4adl4tl.mongodb.net/reckonix?retryWrites=true&w=majority&authSource=admin';

async function checkProductImages() {
  console.log('🔍 Checking Product Images in Database...');
  
  try {
    const client = new MongoClient(connectionString, {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    });
    
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('reckonix');
    
    // Check products collection
    const products = await db.collection('Product').find({}).limit(5).toArray();
    console.log(`\n📦 Found ${products.length} products (showing first 5):`);
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (ID: ${product._id || product.id})`);
      console.log(`   - Has imageUrl: ${product.imageUrl ? 'Yes' : 'No'}`);
      console.log(`   - Has images array: ${product.images ? 'Yes' : 'No'}`);
      if (product.images) {
        console.log(`   - Images count: ${product.images.length}`);
      }
    });
    
    // Check ProductImage collection
    const productImages = await db.collection('ProductImage').find({}).limit(10).toArray();
    console.log(`\n🖼️  Found ${productImages.length} product images (showing first 10):`);
    productImages.forEach((image, index) => {
      console.log(`${index + 1}. Product ID: ${image.productId}, URL: ${image.url}`);
    });
    
    // Check if there are any images for the first product
    if (products.length > 0) {
      const firstProduct = products[0];
      const productId = firstProduct._id || firstProduct.id;
      console.log(`\n🔍 Checking images for product: ${firstProduct.name} (ID: ${productId})`);
      
      const imagesForProduct = await db.collection('ProductImage').find({
        $or: [
          { productId: productId },
          { productId: productId.toString() }
        ]
      }).toArray();
      
      console.log(`Found ${imagesForProduct.length} images for this product:`);
      imagesForProduct.forEach((image, index) => {
        console.log(`  ${index + 1}. ${image.url}`);
      });
    }
    
    await client.close();
    console.log('\n✅ Database check completed');
    
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  }
}

checkProductImages();



