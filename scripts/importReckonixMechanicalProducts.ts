import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const reckonixMechanicalProducts = [
  // Tape And Scale Calibration Unit
  {
    name: "Reckonix Tape And Scale Calibration Unit",
    category: "Calibration System",
    subcategory: "Mechanical Calibrators",
    shortDescription: "Measuring tape and scale calibration unit with upto 1000mm measuring range for precision calibration",
    imageUrl: null,
    rank: 1,
    homeFeatured: true,
    specifications: JSON.stringify([
      { key: "Measuring Range", value: "upto 1000mm" },
      { key: "Service Location", value: "pan india" },
      { key: "Manufacturing Facility", value: "Pune" },
      { key: "Sales Location", value: "Pan india" },
      { key: "Accessories", value: "Software copy, rotating wheel, weight for tension" },
      { key: "Price", value: "₹ 230000" }
    ]),
    featuresBenefits: JSON.stringify([
      "Precision calibration of measuring tapes and scales",
      "10X Magnification for digital image comparison",
      "Variable loading system for different applications",
      "Easy alignment system for Steel rules and tapes",
      "Software copy included",
      "Rotating wheel and weight for tension"
    ]),
    applications: JSON.stringify([
      "Measurement steel rule calibration",
      "Measuring scale calibration",
      "Measuring tapes calibration",
      "Civil engineering applications",
      "Mechanical engineering applications",
      "Textile industry applications"
    ]),
    certifications: JSON.stringify([
      "Made in India",
      "Quality certified",
      "Precision calibrated"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Tape and Scale Calibration Unit",
      "Technology": "Digital image comparison with 10X magnification",
      "Range": "upto 1000mm",
      "Features": "Variable loading system, easy alignment",
      "Accessories": "Software copy, rotating wheel, weight for tension"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The Measuring Tape and Scale Calibration Unit is the very important role in the field of Engineering. The applications of these measuring implements are very wide from civil, mechanical to textile industries and also in society at large. Hence it is necessary to calibrate the scales and tapes with great precision to maintain high measurement standards of the same. The scale and tape calibration unit unique solution to calibrating different types of scales and tapes."
  },

  // Analog Dial Calibration Tester
  {
    name: "Reckonix Analog Dial Calibration Tester",
    category: "Calibration System",
    subcategory: "Mechanical Calibrators",
    shortDescription: "Industrial analog dial calibration tester with 0.01% accuracy for precision calibration",
    imageUrl: null,
    rank: 2,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Accuracy", value: "0.01%" },
      { key: "Display Type", value: "Digital" },
      { key: "Usage/Application", value: "Industrial" },
      { key: "Model Name/Number", value: "Dial Calibration Tester" },
      { key: "Material", value: "CI Casting" },
      { key: "Type", value: "Analog Dial Calibration Tester, For Industrial" },
      { key: "Power Source", value: "Electrical" },
      { key: "Country of Origin", value: "Made in India" },
      { key: "Price", value: "₹ 135000" }
    ]),
    featuresBenefits: JSON.stringify([
      "High accuracy 0.01% precision",
      "Digital display type",
      "Industrial grade construction",
      "CI Casting material",
      "Electrical power source",
      "Made in India quality"
    ]),
    applications: JSON.stringify([
      "Industrial dial calibration",
      "Precision measurement calibration",
      "Quality control applications",
      "Manufacturing process calibration",
      "Laboratory calibration"
    ]),
    certifications: JSON.stringify([
      "Made in India",
      "Industrial grade",
      "Quality certified"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Analog Dial Calibration Tester",
      "Technology": "Digital display with analog calibration",
      "Accuracy": "0.01%",
      "Material": "CI Casting",
      "Application": "Industrial use"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "We are engaged in offering to our clients. Our range of all products is widely appreciated by our clients."
  },

  // Stainless Steel Electronic Dial Calibration Tester
  {
    name: "Reckonix Stainless Steel Electronic Dial Calibration Tester",
    category: "Calibration System",
    subcategory: "Mechanical Calibrators",
    shortDescription: "Stainless steel electronic dial calibration tester for industrial applications with digital display",
    imageUrl: null,
    rank: 3,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Material", value: "Stainless Steel" },
      { key: "Display Type", value: "Digital" },
      { key: "Usage/Application", value: "Industrial" },
      { key: "Type", value: "Stainless Steel Electronic Dial Calibration Tester" },
      { key: "Power Source", value: "Electrical" },
      { key: "Frequency Hz", value: "50 Hz" },
      { key: "Country of Origin", value: "Made in India" },
      { key: "Price", value: "₹ 135000" }
    ]),
    featuresBenefits: JSON.stringify([
      "Stainless steel construction",
      "Digital display type",
      "Industrial grade application",
      "Electrical power source",
      "50 Hz frequency operation",
      "Made in India quality"
    ]),
    applications: JSON.stringify([
      "Industrial dial calibration",
      "Electronic measurement calibration",
      "Precision instrument calibration",
      "Quality control applications",
      "Laboratory calibration"
    ]),
    certifications: JSON.stringify([
      "Made in India",
      "Industrial grade",
      "Quality certified"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Electronic Dial Calibration Tester",
      "Technology": "Digital display with electronic calibration",
      "Material": "Stainless Steel",
      "Frequency": "50 Hz",
      "Application": "Industrial use"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "We are engaged in offering to our clients. Our range of all products is widely appreciated by our clients."
  },

  // Dial Calibration Tester
  {
    name: "Reckonix Dial Calibration Tester RXDCT25",
    category: "Calibration System",
    subcategory: "Mechanical Calibrators",
    shortDescription: "Digital dial calibration tester with +/-2um accuracy for laboratory applications",
    imageUrl: null,
    rank: 4,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Model Name/Number", value: "RXDCT25" },
      { key: "Material", value: "SS with sylvac dial" },
      { key: "Display Type", value: "Digital" },
      { key: "Usage/Application", value: "Laboratory" },
      { key: "Type", value: "Digital" },
      { key: "Accuracy", value: "+/-2um" },
      { key: "Country of Origin", value: "Made in India" }
    ]),
    featuresBenefits: JSON.stringify([
      "High precision +/-2um accuracy",
      "SS with sylvac dial material",
      "Digital display type",
      "Laboratory grade application",
      "Made in India quality",
      "Precision calibration capability"
    ]),
    applications: JSON.stringify([
      "Laboratory dial calibration",
      "Precision measurement calibration",
      "Quality control applications",
      "Research and development",
      "Metrology applications"
    ]),
    certifications: JSON.stringify([
      "Made in India",
      "Laboratory grade",
      "Precision certified"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Dial Calibration Tester",
      "Model": "RXDCT25",
      "Technology": "Digital display with sylvac dial",
      "Accuracy": "+/-2um",
      "Material": "SS with sylvac dial",
      "Application": "Laboratory use"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "Reckonix - Manufacturer of tachometer calibration system, force gauge calibration system & tape and scale calibrator in Pune, Maharashtra."
  },

  // Steel Caliper Checker
  {
    name: "Reckonix Steel Caliper Checker",
    category: "Calibration System",
    subcategory: "Mechanical Calibrators",
    shortDescription: "Precision caliper checker with 0.001mm accuracy for verifying caliper accuracy and reliability",
    imageUrl: null,
    rank: 5,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Measuring Range", value: "0 - 1000 mm" },
      { key: "Material", value: "Stainless Steel" },
      { key: "Usage/Application", value: "Laboratory" },
      { key: "Size/Dimension", value: "1000 mm" },
      { key: "Accuracy", value: "0.001 mm" },
      { key: "Country of Origin", value: "Made in India" },
      { key: "Price", value: "₹ 90000" }
    ]),
    featuresBenefits: JSON.stringify([
      "High precision 0.001mm accuracy",
      "Stainless steel construction",
      "0-1000mm measuring range",
      "User-friendly design",
      "Versatile compatibility",
      "Robust construction",
      "Calibration traceability",
      "Comprehensive testing capability",
      "Portable and convenient"
    ]),
    applications: JSON.stringify([
      "Caliper accuracy verification",
      "Precision measurement calibration",
      "Quality control applications",
      "Laboratory calibration",
      "On-site calibration",
      "Manufacturing process validation"
    ]),
    certifications: JSON.stringify([
      "Made in India",
      "International standards traceable",
      "Quality certified",
      "Precision calibrated"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Steel Caliper Checker",
      "Technology": "Precision measurement verification",
      "Range": "0-1000mm",
      "Accuracy": "0.001mm",
      "Material": "Stainless Steel",
      "Features": "Comprehensive testing, calibration documentation"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "Our Precision Caliper Checker is a must-have tool for verifying the accuracy and reliability of calipers used in precision measurement applications. Engineered with meticulous attention to detail, this checker provides a convenient and reliable method for calibrating and validating calipers, ensuring consistent and accurate measurement results. Key Features: 1. Accurate Calibration: The Precision Caliper Checker is designed to accurately verify the calibration of calipers, ensuring that they adhere to industry standards and provide precise measurements. 2. User-Friendly Design: With intuitive controls and easy-to-read displays, our checker simplifies the calibration process, allowing operators to quickly assess the accuracy of their calipers with minimal effort. 3. Versatile Compatibility: Our checker is compatible with a wide range of caliper types and sizes, making it suitable for various industrial and laboratory applications. 4. Robust Construction: Built to withstand heavy use in demanding environments, our caliper checker features a durable construction that ensures long-term reliability and performance. 5. Calibration Traceability: Our checker is traceable to international standards, providing assurance that caliper measurements are accurate and reliable. 6. Comprehensive Testing: The Precision Caliper Checker performs comprehensive testing of caliper accuracy, including checks for linear displacement, repeatability, and linearity, ensuring thorough validation of measurement instruments. 7. Calibration Documentation: Our checker provides detailed calibration reports, documenting the results of each calibration test for quality assurance and regulatory compliance purposes. 8. Portable and Convenient: Compact and lightweight, our caliper checker is easily portable, allowing for on-site calibration and verification of calipers wherever they are used."
  }
];

async function main() {
  console.log('Importing Reckonix mechanical calibration products...\n');

  try {
    let createdCount = 0;
    let updatedCount = 0;

    for (const product of reckonixMechanicalProducts) {
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
    console.log('\nReckonix mechanical products import completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Reckonix mechanical products import failed:', error);
    process.exit(1);
  }); 