import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Pressure calibration products to import
const products = [
  {
    "name": "Pressure Comparator Stand 1000 Bar",
    "category": "Calibration System",
    "subcategory": "Pressure Calibrators",
    "shortDescription": "Pressure comparator stand for calibration of gauges, transducers up to 1000 bar",
    "imageUrl": null,
    "rank": 1,
    "applications": "[]",
    "catalogPdfUrl": null,
    "certifications": "[]",
    "datasheetPdfUrl": null,
    "featuresBenefits": "[]",
    "fullTechnicalInfo": null,
    "homeFeatured": false,
    "imageGallery": "[]",
    "specifications": "{\"MaxPressure_bar\":\"1000\",\"Material\":\"Stainless Steel\",\"BaseThickness_mm\":\"150\",\"Usage\":\"Calibration of pressure gauges, transducers\"}",
    "technicalDetails": "{\"Design\":\"Robust stainless steel comparator stand\",\"Compatibility\":\"Pressure gauges, sensors up to 1000 bar\",\"Mounting\":\"Fixed base stand\",\"Operation\":\"Manual comparison setup\"}",
    "views": 0
  },
  {
    "name": "Pneumatic Calibration Hand Pump",
    "category": "Calibration System",
    "subcategory": "Pressure Calibrators",
    "shortDescription": "Portable pneumatic hand pump for generating calibration pressure",
    "imageUrl": null,
    "rank": 2,
    "applications": "[]",
    "catalogPdfUrl": null,
    "certifications": "[]",
    "datasheetPdfUrl": null,
    "featuresBenefits": "[]",
    "fullTechnicalInfo": null,
    "homeFeatured": false,
    "imageGallery": "[]",
    "specifications": "{\"Material\":\"Mild Steel\",\"PressureConnection\":\"1/4″\",\"Portability\":\"Hand‑held manual pump\"}",
    "technicalDetails": "{\"Design\":\"Manual pneumatic pump\",\"Connection\":\"Standard 1/4″ fitting\",\"Usage\":\"Portable generation of calibration pressure\"}",
    "views": 0
  }
];

async function main() {
  let updatedCount = 0;
  let createdCount = 0;

  for (const product of products) {
    const { views, ...rest } = product;

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

  console.log(`\nPressure Calibration Import Summary:`);
  console.log(`- Updated: ${updatedCount} products`);
  console.log(`- Created: ${createdCount} products`);
  console.log(`- Total processed: ${updatedCount + createdCount} products`);
}

main()
  .then(() => {
    console.log('Pressure calibration product import/update complete!');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 