import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();

// Load products from JSON file
const products = JSON.parse(fs.readFileSync('/home/ubuntu/Reckonix/meatest_products_formatted.json', 'utf-8'));

async function main() {
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
    
    await prisma.product.create({ data: rest });
  }
}

main()
  .then(() => {
    console.log('Product import complete!');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 