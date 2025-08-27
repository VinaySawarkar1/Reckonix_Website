import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();

// Load products from latest JSON file
const products = JSON.parse(fs.readFileSync('/home/ubuntu/Reckonix/meatest_latest_products.json', 'utf-8'));

async function main() {
  let updatedCount = 0;
  let createdCount = 0;
  let duplicateCount = 0;

  console.log(`\nChecking ${products.length} products from JSON file...`);

  for (const product of products) {
    const { id, createdAt, views, ...rest } = product;
    
    // Stringify array/object fields if they're not already strings
    if (rest.applications && typeof rest.applications === 'object') {
      rest.applications = JSON.stringify(rest.applications);
    }
    if (rest.certifications && typeof rest.certifications === 'object') {
      rest.certifications = JSON.stringify(rest.certifications);
    }
    if (rest.featuresBenefits && typeof rest.featuresBenefits === 'object') {
      rest.featuresBenefits = JSON.stringify(rest.featuresBenefits);
    }
    if (rest.imageGallery && typeof rest.imageGallery === 'object') {
      rest.imageGallery = JSON.stringify(rest.imageGallery);
    }
    if (rest.specifications && typeof rest.specifications === 'object') {
      rest.specifications = JSON.stringify(rest.specifications);
    }
    if (rest.technicalDetails && typeof rest.technicalDetails === 'object') {
      rest.technicalDetails = JSON.stringify(rest.technicalDetails);
    }

    try {
      // Check if product already exists by name
      const existingProduct = await prisma.product.findFirst({
        where: {
          name: rest.name
        }
      });

      if (existingProduct) {
        duplicateCount++;
        console.log(`Duplicate found: ${rest.name} (${rest.category} > ${rest.subcategory})`);
      } else {
        // Create new product if it doesn't exist
        await prisma.product.create({ data: rest });
        createdCount++;
        console.log(`Created: ${rest.name} (${rest.category} > ${rest.subcategory})`);
      }
    } catch (error) {
      console.error(`Error with product ${rest.name}:`, error);
    }
  }

  console.log(`\nImport Summary:`);
  console.log(`- Created: ${createdCount} new products`);
  console.log(`- Duplicates found: ${duplicateCount} products`);
  console.log(`- Total processed: ${products.length} products`);
  
  // Get total products in database
  const totalProducts = await prisma.product.count();
  console.log(`- Total products in database: ${totalProducts}`);
}

main()
  .then(() => {
    console.log('Product check and import complete!');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 