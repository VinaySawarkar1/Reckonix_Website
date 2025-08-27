import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const unimetroProducts = [
  // ULTRA Series Automatic VMS
  {
    name: "ULTRA300",
    category: "Metrology Systems",
    subcategory: "Vision Measuring Machines",
    shortDescription: "Automatic Vision Measuring System with high-precision linear guides and patented technology for excellent measurement performance",
    imageUrl: null,
    rank: 1,
    homeFeatured: true,
    specifications: JSON.stringify([
      { key: "Accuracy", value: "2.5+L/200" },
      { key: "Repeatability", value: "2.5um" },
      { key: "Video Magnification", value: "18~195X" },
      { key: "Field of View", value: "8.1~1.3mm" },
      { key: "Working Distance", value: "82mm" },
      { key: "Resolution", value: "0.1um" }
    ]),
    featuresBenefits: JSON.stringify([
      "High-precision linear guides as standard",
      "New-type transmission and patented technology",
      "Stable transmission performance",
      "Excellent measurement accuracy",
      "Automatic operation"
    ]),
    applications: JSON.stringify([
      "Precision hardware measurement",
      "Electronic products inspection",
      "Injection molding products quality control",
      "Industrial manufacturing metrology",
      "Automobile manufacturing inspection"
    ]),
    certifications: JSON.stringify([]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Automatic Vision Measuring System",
      "Technology": "Patented coordinate measurement technology",
      "Transmission": "High-precision linear guides",
      "Operation": "Fully automatic",
      "Performance": "Excellent measurement performance"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The ULTRA series automatic Vision Measuring System is a new appearance patented product released by UNIMETRO, which provides excellent measurement performance. The whole system is equipped with high-precision linear guides as standard, and adopts new-type transmission and patented technology to provide stable transmission performance and measurement accuracy."
  },
  {
    name: "ULTRA400",
    category: "Metrology Systems",
    subcategory: "Vision Measuring Machines",
    shortDescription: "Automatic Vision Measuring System with 400mm range and high-precision measurement capabilities",
    imageUrl: null,
    rank: 2,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Accuracy", value: "2.5+L/200" },
      { key: "Repeatability", value: "2.5um" },
      { key: "Video Magnification", value: "18~195X" },
      { key: "Field of View", value: "8.1~1.3mm" },
      { key: "Working Distance", value: "82mm" },
      { key: "Resolution", value: "0.1um" }
    ]),
    featuresBenefits: JSON.stringify([
      "High-precision linear guides as standard",
      "New-type transmission and patented technology",
      "Stable transmission performance",
      "Excellent measurement accuracy",
      "Automatic operation"
    ]),
    applications: JSON.stringify([
      "Precision hardware measurement",
      "Electronic products inspection",
      "Injection molding products quality control",
      "Industrial manufacturing metrology",
      "Automobile manufacturing inspection"
    ]),
    certifications: JSON.stringify([]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Automatic Vision Measuring System",
      "Technology": "Patented coordinate measurement technology",
      "Transmission": "High-precision linear guides",
      "Operation": "Fully automatic",
      "Performance": "Excellent measurement performance"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "ULTRA400 automatic Vision Measuring System with extended range and high-precision measurement capabilities for industrial applications."
  },
  {
    name: "ULTRA500",
    category: "Metrology Systems",
    subcategory: "Vision Measuring Machines",
    shortDescription: "Automatic Vision Measuring System with 500mm range for large-scale precision measurement",
    imageUrl: null,
    rank: 3,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Accuracy", value: "2.5+L/200" },
      { key: "Repeatability", value: "2.5um" },
      { key: "Video Magnification", value: "18~195X" },
      { key: "Field of View", value: "8.1~1.3mm" },
      { key: "Working Distance", value: "82mm" },
      { key: "Resolution", value: "0.1um" }
    ]),
    featuresBenefits: JSON.stringify([
      "High-precision linear guides as standard",
      "New-type transmission and patented technology",
      "Stable transmission performance",
      "Excellent measurement accuracy",
      "Automatic operation"
    ]),
    applications: JSON.stringify([
      "Precision hardware measurement",
      "Electronic products inspection",
      "Injection molding products quality control",
      "Industrial manufacturing metrology",
      "Automobile manufacturing inspection"
    ]),
    certifications: JSON.stringify([]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Automatic Vision Measuring System",
      "Technology": "Patented coordinate measurement technology",
      "Transmission": "High-precision linear guides",
      "Operation": "Fully automatic",
      "Performance": "Excellent measurement performance"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "ULTRA500 automatic Vision Measuring System designed for large-scale precision measurement applications in industrial environments."
  },
  {
    name: "ULTRA600",
    category: "Metrology Systems",
    subcategory: "Vision Measuring Machines",
    shortDescription: "Automatic Vision Measuring System with 600mm range for maximum measurement capacity",
    imageUrl: null,
    rank: 4,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Accuracy", value: "2.5+L/200" },
      { key: "Repeatability", value: "2.5um" },
      { key: "Video Magnification", value: "18~195X" },
      { key: "Field of View", value: "8.1~1.3mm" },
      { key: "Working Distance", value: "82mm" },
      { key: "Resolution", value: "0.1um" }
    ]),
    featuresBenefits: JSON.stringify([
      "High-precision linear guides as standard",
      "New-type transmission and patented technology",
      "Stable transmission performance",
      "Excellent measurement accuracy",
      "Automatic operation"
    ]),
    applications: JSON.stringify([
      "Precision hardware measurement",
      "Electronic products inspection",
      "Injection molding products quality control",
      "Industrial manufacturing metrology",
      "Automobile manufacturing inspection"
    ]),
    certifications: JSON.stringify([]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Automatic Vision Measuring System",
      "Technology": "Patented coordinate measurement technology",
      "Transmission": "High-precision linear guides",
      "Operation": "Fully automatic",
      "Performance": "Excellent measurement performance"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "ULTRA600 automatic Vision Measuring System with maximum measurement capacity for large-scale industrial applications."
  },

  // EXTRA Series Semi-auto VMS
  {
    name: "EXTRA200",
    category: "Metrology Systems",
    subcategory: "Vision Measuring Machines",
    shortDescription: "Semi-automatic Vision Measuring System with 200mm range for precision measurement",
    imageUrl: null,
    rank: 5,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Accuracy", value: "2.5+L/200" },
      { key: "Repeatability", value: "2.5um" },
      { key: "Video Magnification", value: "18~195X" },
      { key: "Field of View", value: "8.1~1.3mm" },
      { key: "Working Distance", value: "90mm" },
      { key: "Resolution", value: "0.5um" }
    ]),
    featuresBenefits: JSON.stringify([
      "Semi-automatic operation",
      "High precision measurement",
      "Cost-effective solution",
      "Easy to operate",
      "Reliable performance"
    ]),
    applications: JSON.stringify([
      "Precision hardware measurement",
      "Electronic products inspection",
      "Injection molding products quality control",
      "Industrial manufacturing metrology",
      "Automobile manufacturing inspection"
    ]),
    certifications: JSON.stringify([]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Semi-automatic Vision Measuring System",
      "Technology": "Coordinate measurement technology",
      "Operation": "Semi-automatic",
      "Performance": "High precision measurement"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "EXTRA200 semi-automatic Vision Measuring System providing cost-effective precision measurement solution."
  },
  {
    name: "EXTRA300",
    category: "Metrology Systems",
    subcategory: "Vision Measuring Machines",
    shortDescription: "Semi-automatic Vision Measuring System with 300mm range for medium-scale measurement",
    imageUrl: null,
    rank: 6,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Accuracy", value: "2.5+L/200" },
      { key: "Repeatability", value: "2.5um" },
      { key: "Video Magnification", value: "18~195X" },
      { key: "Field of View", value: "8.1~1.3mm" },
      { key: "Working Distance", value: "90mm" },
      { key: "Resolution", value: "0.5um" }
    ]),
    featuresBenefits: JSON.stringify([
      "Semi-automatic operation",
      "High precision measurement",
      "Cost-effective solution",
      "Easy to operate",
      "Reliable performance"
    ]),
    applications: JSON.stringify([
      "Precision hardware measurement",
      "Electronic products inspection",
      "Injection molding products quality control",
      "Industrial manufacturing metrology",
      "Automobile manufacturing inspection"
    ]),
    certifications: JSON.stringify([]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Semi-automatic Vision Measuring System",
      "Technology": "Coordinate measurement technology",
      "Operation": "Semi-automatic",
      "Performance": "High precision measurement"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "EXTRA300 semi-automatic Vision Measuring System for medium-scale precision measurement applications."
  },
  {
    name: "EXTRA400",
    category: "Metrology Systems",
    subcategory: "Vision Measuring Machines",
    shortDescription: "Semi-automatic Vision Measuring System with 400mm range for extended measurement",
    imageUrl: null,
    rank: 7,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Accuracy", value: "2.5+L/200" },
      { key: "Repeatability", value: "2.5um" },
      { key: "Video Magnification", value: "18~195X" },
      { key: "Field of View", value: "8.1~1.3mm" },
      { key: "Working Distance", value: "90mm" },
      { key: "Resolution", value: "0.5um" }
    ]),
    featuresBenefits: JSON.stringify([
      "Semi-automatic operation",
      "High precision measurement",
      "Cost-effective solution",
      "Easy to operate",
      "Reliable performance"
    ]),
    applications: JSON.stringify([
      "Precision hardware measurement",
      "Electronic products inspection",
      "Injection molding products quality control",
      "Industrial manufacturing metrology",
      "Automobile manufacturing inspection"
    ]),
    certifications: JSON.stringify([]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Semi-automatic Vision Measuring System",
      "Technology": "Coordinate measurement technology",
      "Operation": "Semi-automatic",
      "Performance": "High precision measurement"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "EXTRA400 semi-automatic Vision Measuring System with extended range for larger measurement applications."
  },
  {
    name: "EXTRA500",
    category: "Metrology Systems",
    subcategory: "Vision Measuring Machines",
    shortDescription: "Semi-automatic Vision Measuring System with 500mm range for large-scale measurement",
    imageUrl: null,
    rank: 8,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Accuracy", value: "3+L/200" },
      { key: "Repeatability", value: "3um" },
      { key: "Video Magnification", value: "18~195X" },
      { key: "Field of View", value: "8.1~1.3mm" },
      { key: "Working Distance", value: "90mm" },
      { key: "Resolution", value: "0.5um" }
    ]),
    featuresBenefits: JSON.stringify([
      "Semi-automatic operation",
      "High precision measurement",
      "Cost-effective solution",
      "Easy to operate",
      "Reliable performance"
    ]),
    applications: JSON.stringify([
      "Precision hardware measurement",
      "Electronic products inspection",
      "Injection molding products quality control",
      "Industrial manufacturing metrology",
      "Automobile manufacturing inspection"
    ]),
    certifications: JSON.stringify([]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Semi-automatic Vision Measuring System",
      "Technology": "Coordinate measurement technology",
      "Operation": "Semi-automatic",
      "Performance": "High precision measurement"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "EXTRA500 semi-automatic Vision Measuring System for large-scale measurement applications with enhanced accuracy."
  },

  // BASIC Series Manual VMS
  {
    name: "BASIC200",
    category: "Metrology Systems",
    subcategory: "Vision Measuring Machines",
    shortDescription: "Manual Vision Measuring System with 200×100×150mm range for basic measurement needs",
    imageUrl: null,
    rank: 9,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Accuracy", value: "2.5+L/100" },
      { key: "Repeatability", value: "2.5um" },
      { key: "Video Magnification", value: "18~195X" },
      { key: "Field of View", value: "8.1~1.3mm" },
      { key: "Working Distance", value: "90mm" },
      { key: "Resolution", value: "0.5um" }
    ]),
    featuresBenefits: JSON.stringify([
      "Manual operation",
      "Cost-effective entry-level solution",
      "Easy to use",
      "Reliable performance",
      "Compact design"
    ]),
    applications: JSON.stringify([
      "Precision hardware measurement",
      "Electronic products inspection",
      "Injection molding products quality control",
      "Industrial manufacturing metrology",
      "Automobile manufacturing inspection"
    ]),
    certifications: JSON.stringify([]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Manual Vision Measuring System",
      "Technology": "Coordinate measurement technology",
      "Operation": "Manual",
      "Performance": "Basic precision measurement"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "BASIC200 manual Vision Measuring System with 200×100×150mm range for basic measurement needs."
  },
  {
    name: "BASIC300",
    category: "Metrology Systems",
    subcategory: "Vision Measuring Machines",
    shortDescription: "Manual Vision Measuring System with 300×200×200mm range for medium measurement needs",
    imageUrl: null,
    rank: 10,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Accuracy", value: "2.5+L/100" },
      { key: "Repeatability", value: "2.5um" },
      { key: "Video Magnification", value: "18~195X" },
      { key: "Field of View", value: "8.1~1.3mm" },
      { key: "Working Distance", value: "90mm" },
      { key: "Resolution", value: "0.5um" }
    ]),
    featuresBenefits: JSON.stringify([
      "Manual operation",
      "Cost-effective entry-level solution",
      "Easy to use",
      "Reliable performance",
      "Compact design"
    ]),
    applications: JSON.stringify([
      "Precision hardware measurement",
      "Electronic products inspection",
      "Injection molding products quality control",
      "Industrial manufacturing metrology",
      "Automobile manufacturing inspection"
    ]),
    certifications: JSON.stringify([]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Manual Vision Measuring System",
      "Technology": "Coordinate measurement technology",
      "Operation": "Manual",
      "Performance": "Basic precision measurement"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "BASIC300 manual Vision Measuring System with 300×200×200mm range for medium measurement needs."
  },
  {
    name: "BASIC400",
    category: "Metrology Systems",
    subcategory: "Vision Measuring Machines",
    shortDescription: "Manual Vision Measuring System with 400×300×200mm range for extended measurement needs",
    imageUrl: null,
    rank: 11,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Accuracy", value: "2.5+L/100" },
      { key: "Repeatability", value: "2.5um" },
      { key: "Video Magnification", value: "18~195X" },
      { key: "Field of View", value: "8.1~1.3mm" },
      { key: "Working Distance", value: "90mm" },
      { key: "Resolution", value: "0.5um" }
    ]),
    featuresBenefits: JSON.stringify([
      "Manual operation",
      "Cost-effective entry-level solution",
      "Easy to use",
      "Reliable performance",
      "Compact design"
    ]),
    applications: JSON.stringify([
      "Precision hardware measurement",
      "Electronic products inspection",
      "Injection molding products quality control",
      "Industrial manufacturing metrology",
      "Automobile manufacturing inspection"
    ]),
    certifications: JSON.stringify([]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Manual Vision Measuring System",
      "Technology": "Coordinate measurement technology",
      "Operation": "Manual",
      "Performance": "Basic precision measurement"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "BASIC400 manual Vision Measuring System with 400×300×200mm range for extended measurement needs."
  },
  {
    name: "BASIC500",
    category: "Metrology Systems",
    subcategory: "Vision Measuring Machines",
    shortDescription: "Manual Vision Measuring System with 500×400×200mm range for large measurement needs",
    imageUrl: null,
    rank: 12,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Accuracy", value: "2.5+L/100" },
      { key: "Repeatability", value: "2.5um" },
      { key: "Video Magnification", value: "18~195X" },
      { key: "Field of View", value: "8.1~1.3mm" },
      { key: "Working Distance", value: "90mm" },
      { key: "Resolution", value: "0.5um" }
    ]),
    featuresBenefits: JSON.stringify([
      "Manual operation",
      "Cost-effective entry-level solution",
      "Easy to use",
      "Reliable performance",
      "Compact design"
    ]),
    applications: JSON.stringify([
      "Precision hardware measurement",
      "Electronic products inspection",
      "Injection molding products quality control",
      "Industrial manufacturing metrology",
      "Automobile manufacturing inspection"
    ]),
    certifications: JSON.stringify([]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Manual Vision Measuring System",
      "Technology": "Coordinate measurement technology",
      "Operation": "Manual",
      "Performance": "Basic precision measurement"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "BASIC500 manual Vision Measuring System with 500×400×200mm range for large measurement needs."
  }
];

async function main() {
  console.log('Importing UNIMETRO VMM products...\n');

  try {
    let createdCount = 0;
    let updatedCount = 0;

    for (const product of unimetroProducts) {
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
    console.log('\nUNIMETRO products import completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('UNIMETRO products import failed:', error);
    process.exit(1);
  }); 