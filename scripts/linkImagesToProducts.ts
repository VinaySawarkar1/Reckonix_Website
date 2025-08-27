import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Linking images to products...\n');

  try {
    // Get all products that don't have images
    const productsWithoutImages = await prisma.product.findMany({
      include: { images: true }
    });

    console.log(`📊 Found ${productsWithoutImages.length} products`);
    
    // Get list of image files in uploads directory
    const uploadsDir = path.join(process.cwd(), 'uploads', 'products');
    const imageFiles = fs.readdirSync(uploadsDir).filter(file => 
      file.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    );

    console.log(`📸 Found ${imageFiles.length} image files in uploads directory`);

    // Link images to products
    let linkedCount = 0;
    for (const product of productsWithoutImages) {
      if (product.images.length === 0) {
        // Find a suitable image for this product
        const suitableImage = imageFiles.find(file => {
          // Try to match by product name or use any available image
          return file.toLowerCase().includes(product.name.toLowerCase().replace(/\s+/g, '')) ||
                 file.toLowerCase().includes('image');
        });

        if (suitableImage) {
          // Create image record
          await prisma.productImage.create({
            data: {
              productId: product.id,
              url: `/uploads/products/${suitableImage}`,
            },
          });
          
          console.log(`✅ Linked image ${suitableImage} to product "${product.name}"`);
          linkedCount++;
          
          // Remove the used image from the list to avoid duplicates
          const index = imageFiles.indexOf(suitableImage);
          if (index > -1) {
            imageFiles.splice(index, 1);
          }
        }
      }
    }

    console.log(`\n✅ Successfully linked ${linkedCount} images to products`);

    // Verify the results
    const productsWithImages = await prisma.product.findMany({
      include: { images: true }
    });

    console.log('\n📊 Final product image status:');
    productsWithImages.forEach(product => {
      console.log(`- ${product.name}: ${product.images.length} images`);
    });

  } catch (error) {
    console.error('❌ Error linking images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('\n🎉 Image linking completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Image linking failed:', error);
    process.exit(1);
  }); 