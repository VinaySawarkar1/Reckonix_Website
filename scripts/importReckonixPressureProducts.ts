import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const reckonixPressureProducts = [
  // Pressure Comparator Stand 1000 Bar
  {
    name: "Reckonix Pressure Comparator Stand 1000 Bar",
    category: "Calibration System",
    subcategory: "Pressure Calibrators",
    shortDescription: "Advanced pressure comparator stand for precision instrumentation calibration up to 1000 bar",
    imageUrl: null,
    rank: 1,
    homeFeatured: true,
    specifications: JSON.stringify([
      { key: "Material", value: "Stainless Steel" },
      { key: "Thickness", value: "150mm" },
      { key: "Brand", value: "Konroy" },
      { key: "Color", value: "Black" },
      { key: "Usage/Application", value: "Industrial" },
      { key: "Grade", value: "Automatic" },
      { key: "Packaging Type", value: "Box" },
      { key: "Pressure Range", value: "Up to 1000 Bar" },
      { key: "Country of Origin", value: "Made in India" },
      { key: "Price", value: "₹ 40000" }
    ]),
    featuresBenefits: JSON.stringify([
      "Versatile compatibility with wide range of pressure instruments",
      "Precision engineering for reliable and repeatable pressure comparisons",
      "Robust construction for rigorous calibration environments",
      "Modular design for easy customization and adaptation",
      "User-friendly operation with intuitive controls",
      "High-precision pressure measurement capabilities",
      "Enhanced productivity with streamlined calibration processes",
      "Compliance with international metrology standards"
    ]),
    applications: JSON.stringify([
      "Pressure gauge calibration",
      "Pressure transducer calibration",
      "Pressure sensor calibration",
      "Industrial instrumentation calibration",
      "Precision pressure measurement",
      "Quality control applications",
      "Metrology laboratory use"
    ]),
    certifications: JSON.stringify([
      "Made in India",
      "International metrology standards compliant",
      "Quality certified",
      "Industrial grade"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Pressure Comparator Stand",
      "Technology": "Advanced pressure comparison technology",
      "Material": "Stainless Steel",
      "Thickness": "150mm",
      "Brand": "Konroy",
      "Features": "Modular design, user-friendly operation",
      "Compliance": "International metrology standards"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "Enhance your calibration workflow with our advanced Pressure Comparator Stand, meticulously designed to meet the stringent demands of precision instrumentation calibration. This stand serves as an indispensable tool for accurately comparing and calibrating pressure measurement devices, ensuring optimal performance and compliance with industry standards."
  },

  // Pneumatic Calibration Hand Pump
  {
    name: "Reckonix Pneumatic Calibration Hand Pump",
    category: "Calibration System",
    subcategory: "Pressure Calibrators",
    shortDescription: "Cutting-edge pneumatic pump for efficient and reliable fluid transfer in industrial applications",
    imageUrl: null,
    rank: 2,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Material", value: "Mild Steel" },
      { key: "Gage Connection", value: "1/4" },
      { key: "Country of Origin", value: "Made in India" },
      { key: "Operation", value: "Pneumatic" },
      { key: "Application", value: "Industrial fluid transfer" },
      { key: "Price", value: "₹ 18500" }
    ]),
    featuresBenefits: JSON.stringify([
      "Powerful pneumatic operation with compressed air",
      "Versatile compatibility with different fluid viscosities",
      "Compact and portable design",
      "Durable construction with corrosion-resistant materials",
      "Efficient operation with minimal energy consumption",
      "Easy maintenance with user-friendly features",
      "Safety features for operator protection",
      "Customization options for specific applications"
    ]),
    applications: JSON.stringify([
      "Industrial fluid transfer",
      "Manufacturing applications",
      "Automotive industry",
      "Hydraulic fluid handling",
      "Oil and fuel transfer",
      "Calibration pressure generation",
      "Industrial maintenance"
    ]),
    certifications: JSON.stringify([
      "Made in India",
      "Industrial grade",
      "Safety certified",
      "Quality assured"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Pneumatic Calibration Hand Pump",
      "Technology": "Compressed air powered fluid transfer",
      "Material": "Mild Steel",
      "Connection": "1/4 inch gage connection",
      "Features": "Compact, portable, durable construction",
      "Safety": "Built-in safety mechanisms"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "Introducing our cutting-edge Pneumatic Pump, designed to deliver efficient and reliable fluid transfer capabilities in various industrial applications. Engineered with precision and durability in mind, this pump offers superior performance, making it an essential tool for fluid handling tasks in manufacturing, automotive, and other industries."
  }
];

async function main() {
  console.log('Importing Reckonix pressure calibration products...\n');

  try {
    let createdCount = 0;
    let updatedCount = 0;

    for (const product of reckonixPressureProducts) {
      try {
        // Check if product already exists
        const existingProduct = await prisma.product.findFirst({
          where: { name: product.name }
        });

        if (existingProduct) {
          // Update existing product
          await prisma.product.update({
            where: { id: existingProduct.id },
            data: product
          });
          updatedCount++;
          console.log(`Updated: ${product.name}`);
        } else {
          // Create new product
          await prisma.product.create({
            data: product
          });
          createdCount++;
          console.log(`Created: ${product.name}`);
        }
      } catch (error) {
        console.error(`Error processing ${product.name}:`, error);
      }
    }

    console.log(`\nImport completed successfully!`);
    console.log(`Created: ${createdCount} products`);
    console.log(`Updated: ${updatedCount} products`);
    console.log(`Total processed: ${createdCount + updatedCount} products`);

  } catch (error) {
    console.error('Error during import:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('\nReckonix pressure products import completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Reckonix pressure products import failed:', error);
    process.exit(1);
  }); 