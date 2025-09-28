import { MongoClient } from 'mongodb';

const connectionString = 'mongodb+srv://vinay:vinay@cluster0.4adl4tl.mongodb.net/reckonix?retryWrites=true&w=majority&authSource=admin';

async function analyzeIdMapping() {
  console.log('🔍 Analyzing ID Mapping Between Products and ProductImages...\n');
  
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
    
    // Get products with their IDs
    const products = await db.collection('Product').find({}).limit(10).toArray();
    console.log('📦 PRODUCTS:');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   - _id: ${product._id}`);
      console.log(`   - id: ${product.id}`);
      console.log(`   - imageUrl: ${product.imageUrl || 'none'}`);
      console.log('');
    });
    
    // Get product images with their productIds
    const productImages = await db.collection('ProductImage').find({}).limit(10).toArray();
    console.log('🖼️  PRODUCT IMAGES:');
    productImages.forEach((image, index) => {
      console.log(`${index + 1}. ProductId: ${image.productId} (type: ${typeof image.productId})`);
      console.log(`   - URL: ${image.url}`);
      console.log(`   - _id: ${image._id}`);
      console.log('');
    });
    
    // Try to find a match
    console.log('🔍 TRYING TO FIND MATCHES:');
    for (const product of products.slice(0, 3)) {
      console.log(`\nLooking for images for: ${product.name}`);
      console.log(`Product _id: ${product._id}`);
      console.log(`Product id: ${product.id}`);
      
      // Try different matching strategies
      const strategies = [
        { name: 'By _id', query: { productId: product._id } },
        { name: 'By id', query: { productId: product.id } },
        { name: 'By _id string', query: { productId: product._id.toString() } },
        { name: 'By id string', query: { productId: product.id?.toString() } }
      ];
      
      for (const strategy of strategies) {
        const images = await db.collection('ProductImage').find(strategy.query).toArray();
        console.log(`  ${strategy.name}: ${images.length} images found`);
        if (images.length > 0) {
          images.forEach(img => console.log(`    - ${img.url}`));
        }
      }
    }
    
    await client.close();
    console.log('\n✅ Analysis completed');
    
  } catch (error) {
    console.error('❌ Error analyzing database:', error.message);
  }
}

analyzeIdMapping();



