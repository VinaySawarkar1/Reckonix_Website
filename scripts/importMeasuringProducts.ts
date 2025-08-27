import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();

// Load products from measuring systems JSON file
const products = JSON.parse(fs.readFileSync('/home/ubuntu/Reckonix/meatest_measuring_products.json', 'utf-8'));

async function main() {
  let updatedCount = 0;
  let createdCount = 0;

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

    // Set category for measuring systems products
    rest.category = 'Measuring Systems';
    
    // Set appropriate subcategory based on product type
    if (rest.name.toLowerCase().includes('datalogger') || rest.name.toLowerCase().includes('logger')) {
      rest.subcategory = 'Dataloggers';
    } else if (rest.name.toLowerCase().includes('transmitter')) {
      rest.subcategory = 'Transmitters';
    } else if (rest.name.toLowerCase().includes('gateway') || rest.name.toLowerCase().includes('iot')) {
      rest.subcategory = 'IOT Gateway';
    } else if (rest.name.toLowerCase().includes('sensor')) {
      rest.subcategory = 'Sensors';
    } else if (rest.name.toLowerCase().includes('monitor')) {
      rest.subcategory = 'Monitors';
    } else if (rest.name.toLowerCase().includes('meter')) {
      rest.subcategory = 'Meters';
    } else {
      rest.subcategory = 'Measuring Equipment';
    }

    try {
      // Try to update existing product by name
      const updatedProduct = await prisma.product.updateMany({
        where: {
          name: rest.name
        },
        data: rest
      });

      if (updatedProduct.count > 0) {
        updatedCount++;
        console.log(`Updated: ${rest.name} (${rest.category} > ${rest.subcategory})`);
      } else {
        // Create new product if it doesn't exist
        await prisma.product.create({ data: rest });
        createdCount++;
        console.log(`Created: ${rest.name} (${rest.category} > ${rest.subcategory})`);
      }
    } catch (error) {
      // If update fails, create new product
      try {
        await prisma.product.create({ data: rest });
        createdCount++;
        console.log(`Created: ${rest.name} (${rest.category} > ${rest.subcategory})`);
      } catch (createError) {
        console.error(`Error with product ${rest.name}:`, createError);
      }
    }
  }

  console.log(`\nMeasuring Systems Import Summary:`);
  console.log(`- Updated: ${updatedCount} products`);
  console.log(`- Created: ${createdCount} products`);
  console.log(`- Total processed: ${updatedCount + createdCount} products`);
}

main()
  .then(() => {
    console.log('Measuring systems product import/update complete!');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 