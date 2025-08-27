import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const meatestAdditionalProducts = [
  // Multifunction Calibrators
  {
    name: "MEATEST M9000 Multifunction Calibrator",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "Advanced multifunction calibrator for comprehensive electrical instrument calibration",
    imageUrl: null,
    rank: 9,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Voltage DC", value: "0-1000V" },
      { key: "Voltage AC", value: "0-1000V (45-65Hz)" },
      { key: "Current DC", value: "0-20A" },
      { key: "Current AC", value: "0-20A (45-65Hz)" },
      { key: "Resistance", value: "0-100MΩ" },
      { key: "Frequency", value: "0.1Hz-1MHz" },
      { key: "Accuracy", value: "±0.01% of reading" },
      { key: "Resolution", value: "6½ digits" }
    ]),
    featuresBenefits: JSON.stringify([
      "Comprehensive calibration capabilities",
      "High accuracy and stability",
      "Wide measurement ranges",
      "Advanced digital technology",
      "User-friendly interface",
      "Remote control capability"
    ]),
    applications: JSON.stringify([
      "Multimeter calibration",
      "Voltmeter verification",
      "Ammeter testing",
      "Ohmmeter calibration",
      "Frequency meter testing",
      "Laboratory standards"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "CE certified",
      "RoHS compliant"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Multifunction Calibrator",
      "Technology": "Advanced digital calibration technology",
      "Interface": "USB, RS232, GPIB",
      "Software": "MEATEST Calibration Suite",
      "Standards": "Traceable to NIST"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST M9000 Multifunction Calibrator provides comprehensive calibration capabilities for all types of electrical measuring instruments with exceptional accuracy and wide measurement ranges."
  },
  {
    name: "MEATEST M9010 Portable Multifunction Calibrator",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "Portable multifunction calibrator for field calibration and testing",
    imageUrl: null,
    rank: 10,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Voltage DC", value: "0-100V" },
      { key: "Voltage AC", value: "0-100V (45-65Hz)" },
      { key: "Current DC", value: "0-1A" },
      { key: "Current AC", value: "0-1A (45-65Hz)" },
      { key: "Resistance", value: "0-10MΩ" },
      { key: "Frequency", value: "0.1Hz-100kHz" },
      { key: "Accuracy", value: "±0.02% of reading" },
      { key: "Battery Life", value: "Up to 8 hours" }
    ]),
    featuresBenefits: JSON.stringify([
      "Portable design",
      "Battery powered operation",
      "Field calibration capability",
      "Rugged construction",
      "Easy-to-use interface",
      "Long battery life"
    ]),
    applications: JSON.stringify([
      "Field calibration",
      "On-site testing",
      "Portable measurement",
      "Industrial maintenance",
      "Service applications"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "CE certified",
      "IP54 protection"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Portable Multifunction Calibrator",
      "Technology": "Advanced portable calibration technology",
      "Interface": "USB, Bluetooth",
      "Power": "Rechargeable battery",
      "Protection": "IP54 rated"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST M9010 Portable Multifunction Calibrator is designed for field calibration and testing with portable operation and rugged construction for industrial environments."
  },

  // Decade Boxes - Resistance
  {
    name: "MEATEST DR100 Resistance Decade Box",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "Precision resistance decade box for electrical meter calibration",
    imageUrl: null,
    rank: 11,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Resistance Range", value: "0.1Ω-1MΩ" },
      { key: "Accuracy", value: "±0.01% of setting" },
      { key: "Power Rating", value: "0.5W per decade" },
      { key: "Temperature Coefficient", value: "±5ppm/°C" },
      { key: "Connectors", value: "4mm banana jacks" },
      { key: "Resolution", value: "0.1Ω steps" }
    ]),
    featuresBenefits: JSON.stringify([
      "Precision resistance values",
      "Wide resistance range",
      "High accuracy",
      "Easy-to-use decade switches",
      "Stable performance",
      "Cost-effective solution"
    ]),
    applications: JSON.stringify([
      "Multimeter calibration",
      "Ohmmeter testing",
      "Resistance measurement",
      "Electrical testing",
      "Laboratory use"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "CE certified"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Resistance Decade Box",
      "Technology": "Precision wire-wound resistors",
      "Switches": "Rotary decade switches",
      "Construction": "Aluminum case",
      "Connections": "4mm safety jacks"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST DR100 Resistance Decade Box provides precise resistance values from 0.1Ω to 1MΩ for calibration and testing of electrical resistance measuring instruments."
  },
  {
    name: "MEATEST DR200 High Precision Resistance Decade",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "High precision resistance decade box for laboratory standards",
    imageUrl: null,
    rank: 12,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Resistance Range", value: "0.01Ω-1MΩ" },
      { key: "Accuracy", value: "±0.005% of setting" },
      { key: "Power Rating", value: "1W per decade" },
      { key: "Temperature Coefficient", value: "±2ppm/°C" },
      { key: "Connectors", value: "4-terminal Kelvin" },
      { key: "Resolution", value: "0.01Ω steps" }
    ]),
    featuresBenefits: JSON.stringify([
      "Ultra-high precision",
      "4-terminal Kelvin connection",
      "Low temperature coefficient",
      "Excellent stability",
      "Laboratory grade",
      "Traceable calibration"
    ]),
    applications: JSON.stringify([
      "Laboratory standards",
      "High precision calibration",
      "Research applications",
      "Quality control",
      "Metrology laboratories"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "NIST traceable",
      "CE certified"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "High Precision Resistance Decade",
      "Technology": "Ultra-precision wire-wound resistors",
      "Connections": "4-terminal Kelvin",
      "Shielding": "Electromagnetic shielding",
      "Temperature": "Controlled environment operation"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST DR200 High Precision Resistance Decade provides ultra-high precision resistance values for laboratory standards and metrology applications."
  },

  // Decade Boxes - Capacitance
  {
    name: "MEATEST DC100 Capacitance Decade Box",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "Precision capacitance decade box for LCR meter calibration",
    imageUrl: null,
    rank: 13,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Capacitance Range", value: "1pF-1μF" },
      { key: "Accuracy", value: "±0.1% of setting" },
      { key: "Frequency Range", value: "DC-1MHz" },
      { key: "Temperature Coefficient", value: "±10ppm/°C" },
      { key: "Connectors", value: "BNC connectors" },
      { key: "Resolution", value: "1pF steps" }
    ]),
    featuresBenefits: JSON.stringify([
      "Precision capacitance values",
      "Wide capacitance range",
      "High frequency operation",
      "Low temperature coefficient",
      "Stable performance",
      "Easy-to-use decade switches"
    ]),
    applications: JSON.stringify([
      "LCR meter calibration",
      "Capacitance measurement",
      "Component testing",
      "Laboratory use",
      "Quality control"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "CE certified"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Capacitance Decade Box",
      "Technology": "Precision air capacitors",
      "Switches": "Rotary decade switches",
      "Construction": "Aluminum case",
      "Connections": "BNC connectors"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST DC100 Capacitance Decade Box provides precise capacitance values from 1pF to 1μF for calibration of LCR meters and capacitance measuring instruments."
  },

  // Decade Boxes - Inductance
  {
    name: "MEATEST DL100 Inductance Decade Box",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "Precision inductance decade box for LCR meter and impedance analyzer calibration",
    imageUrl: null,
    rank: 14,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Inductance Range", value: "1μH-1H" },
      { key: "Accuracy", value: "±0.1% of setting" },
      { key: "Frequency Range", value: "DC-100kHz" },
      { key: "Temperature Coefficient", value: "±10ppm/°C" },
      { key: "Connectors", value: "BNC connectors" },
      { key: "Resolution", value: "1μH steps" }
    ]),
    featuresBenefits: JSON.stringify([
      "Precision inductance values",
      "Wide inductance range",
      "High frequency operation",
      "Low temperature coefficient",
      "Stable performance",
      "Easy-to-use decade switches"
    ]),
    applications: JSON.stringify([
      "LCR meter calibration",
      "Inductance measurement",
      "Impedance analyzer testing",
      "Component testing",
      "Laboratory use"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "CE certified"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Inductance Decade Box",
      "Technology": "Precision air-core inductors",
      "Switches": "Rotary decade switches",
      "Construction": "Aluminum case",
      "Connections": "BNC connectors"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST DL100 Inductance Decade Box provides precise inductance values from 1μH to 1H for calibration of LCR meters and inductance measuring instruments."
  },

  // Decade Boxes - Voltage
  {
    name: "MEATEST DV100 Voltage Decade Box",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "Precision voltage divider decade box for voltmeter calibration",
    imageUrl: null,
    rank: 15,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Input Voltage", value: "0-1000V DC/AC" },
      { key: "Output Voltage", value: "0-100V DC/AC" },
      { key: "Accuracy", value: "±0.01% of input" },
      { key: "Frequency Range", value: "DC-1MHz" },
      { key: "Temperature Coefficient", value: "±5ppm/°C" },
      { key: "Connectors", value: "4mm banana jacks" }
    ]),
    featuresBenefits: JSON.stringify([
      "Precision voltage division",
      "Wide voltage range",
      "High accuracy",
      "Wide frequency range",
      "Stable performance",
      "Easy-to-use decade switches"
    ]),
    applications: JSON.stringify([
      "Voltmeter calibration",
      "Voltage measurement",
      "High voltage testing",
      "Laboratory use",
      "Quality control"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "CE certified"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Voltage Decade Box",
      "Technology": "Precision voltage divider network",
      "Switches": "Rotary decade switches",
      "Construction": "Aluminum case",
      "Connections": "4mm safety jacks"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST DV100 Voltage Decade Box provides precise voltage division ratios for calibration of voltmeters and voltage measuring instruments."
  }
];

async function main() {
  console.log('Importing additional MEATEST products...\n');

  try {
    let createdCount = 0;
    let updatedCount = 0;

    for (const product of meatestAdditionalProducts) {
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
    console.log('\nAdditional MEATEST products import completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Additional MEATEST products import failed:', error);
    process.exit(1);
  }); 