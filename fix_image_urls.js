import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mongoUri = process.env.MONGODB_URL || 'mongodb+srv://vinaysawarkar0:vgP9DZNlkiJWNNMH@cluster0.4adl4tl.mongodb.net/';

async function fixImageUrls() {
  const client = new MongoClient(mongoUri);
  
  try {
    await client.connect();
    const db = client.db('reckonix');
    
    console.log('Connected to MongoDB');
    
    // Check ProductImage collection
    const productImages = await db.collection('ProductImage').find({}).toArray();
    console.log(`Found ${productImages.length} product images`);
    
    // Check Product collection
    const products = await db.collection('Product').find({}).toArray();
    console.log(`Found ${products.length} products`);
    
    // Analyze image URLs in ProductImage collection
    let fixedCount = 0;
    let missingFiles = 0;
    
    for (const image of productImages) {
      if (image.url) {
        // Check if URL needs fixing
        if (!image.url.startsWith('/uploads/products/')) {
          console.log(`Fixing URL: ${image.url} -> /uploads/products/${path.basename(image.url)}`);
          await db.collection('ProductImage').updateOne(
            { _id: image._id },
            { $set: { url: `/uploads/products/${path.basename(image.url)}` } }
          );
          fixedCount++;
        }
        
        // Check if file exists
        const filePath = path.join(__dirname, 'uploads', 'products', path.basename(image.url));
        if (!fs.existsSync(filePath)) {
          console.log(`Missing file: ${filePath}`);
          missingFiles++;
        }
      }
    }
    
    // Check Product collection imageUrl and imageGallery fields
    let productFixedCount = 0;
    for (const product of products) {
      let needsUpdate = false;
      const updateData = {};
      
      // Fix imageUrl
      if (product.imageUrl && !product.imageUrl.startsWith('/uploads/products/')) {
        updateData.imageUrl = `/uploads/products/${path.basename(product.imageUrl)}`;
        needsUpdate = true;
        console.log(`Fixing product imageUrl: ${product.imageUrl} -> ${updateData.imageUrl}`);
      }
      
      // Fix imageGallery
      if (product.imageGallery && Array.isArray(product.imageGallery)) {
        const fixedGallery = product.imageGallery.map(url => {
          if (url && !url.startsWith('/uploads/products/')) {
            return `/uploads/products/${path.basename(url)}`;
          }
          return url;
        });
        
        if (JSON.stringify(fixedGallery) !== JSON.stringify(product.imageGallery)) {
          updateData.imageGallery = fixedGallery;
          needsUpdate = true;
          console.log(`Fixing product imageGallery for product ${product.name}`);
        }
      }
      
      if (needsUpdate) {
        await db.collection('Product').updateOne(
          { _id: product._id },
          { $set: updateData }
        );
        productFixedCount++;
      }
    }
    
    console.log('\n=== Fix Summary ===');
    console.log(`Fixed ${fixedCount} ProductImage URLs`);
    console.log(`Fixed ${productFixedCount} Product image URLs/galleries`);
    console.log(`Found ${missingFiles} missing image files`);
    
    if (missingFiles > 0) {
      console.log('\n⚠️  Warning: Some image files are missing from uploads/products/ directory');
      console.log('You may need to manually upload these images or check your file storage.');
    }
    
  } catch (error) {
    console.error('Error fixing image URLs:', error);
  } finally {
    await client.close();
  }
}

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads', 'products');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads/products directory');
}

fixImageUrls();
