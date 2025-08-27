import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const meatestProducts = [
  // Multi-Product Calibrators
  {
    name: "MEATEST M525 Multi-Product Calibrator",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "High-precision multi-product calibrator for voltage, current, resistance, and frequency calibration",
    imageUrl: null,
    rank: 1,
    homeFeatured: true,
    specifications: JSON.stringify([
      { key: "Voltage Range", value: "0-1000V DC/AC" },
      { key: "Current Range", value: "0-20A DC/AC" },
      { key: "Resistance Range", value: "0-100MΩ" },
      { key: "Frequency Range", value: "0.1Hz-1MHz" },
      { key: "Accuracy", value: "±0.01% of reading" },
      { key: "Resolution", value: "6½ digits" },
      { key: "Output Power", value: "Up to 50W" }
    ]),
    featuresBenefits: JSON.stringify([
      "Multi-product calibration capability",
      "High accuracy and stability",
      "Wide measurement ranges",
      "Advanced calibration software",
      "Traceable to international standards",
      "Long-term reliability"
    ]),
    applications: JSON.stringify([
      "Electrical meter calibration",
      "Multimeter verification",
      "Oscilloscope calibration",
      "Power analyzer testing",
      "Process control calibration",
      "Laboratory standards"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "CE certified",
      "RoHS compliant"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Multi-Product Calibrator",
      "Technology": "Advanced digital calibration technology",
      "Interface": "USB, RS232, GPIB",
      "Software": "MEATEST Calibration Suite",
      "Standards": "Traceable to NIST"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST M525 Multi-Product Calibrator is designed for high-precision calibration of electrical measuring instruments. It provides comprehensive calibration capabilities for voltage, current, resistance, and frequency measurements with exceptional accuracy and stability."
  },
  {
    name: "MEATEST M109R High Resistance Decade",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "High resistance decade box for calibration of insulation testers and megaohmmeters",
    imageUrl: null,
    rank: 2,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Resistance Range", value: "1MΩ-12GΩ" },
      { key: "Max Voltage", value: "5kV DC" },
      { key: "Uncertainty", value: "±0.1%/year" },
      { key: "Operation", value: "RS-232 remote, internal battery" },
      { key: "Accuracy", value: "±0.05% of setting" },
      { key: "Temperature Coefficient", value: "±5ppm/°C" }
    ]),
    featuresBenefits: JSON.stringify([
      "High resistance calibration",
      "Remote control capability",
      "Internal rechargeable battery",
      "High voltage operation",
      "Stable long-term performance",
      "Traceable calibration"
    ]),
    applications: JSON.stringify([
      "Insulation tester calibration",
      "Megaohmmeter verification",
      "High resistance measurement",
      "Electrical safety testing",
      "Laboratory standards"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "CE certified"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "High Resistance Decade",
      "Technology": "Precision resistance network",
      "Control": "RS-232 remote interface",
      "Power": "Internal rechargeable battery",
      "Voltage": "Up to 5kV DC operation"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST M109R High Resistance Decade is designed for calibration of insulation testers and megaohmmeters. It provides precise resistance values from 1MΩ to 12GΩ with high voltage capability up to 5kV DC."
  },

  // Power & Energy Calibrators
  {
    name: "MEATEST P550 Power & Energy Calibrator",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "Advanced power and energy calibrator for electrical power measurement instruments",
    imageUrl: null,
    rank: 3,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Voltage Range", value: "0-600V AC/DC" },
      { key: "Current Range", value: "0-100A AC/DC" },
      { key: "Power Range", value: "0-60kW" },
      { key: "Frequency Range", value: "45-65Hz" },
      { key: "Power Accuracy", value: "±0.05% of reading" },
      { key: "Energy Accuracy", value: "±0.1% of reading" },
      { key: "Power Factor", value: "0.1-1.0" }
    ]),
    featuresBenefits: JSON.stringify([
      "Power and energy calibration",
      "High accuracy power measurement",
      "Wide frequency range",
      "Advanced power factor control",
      "Energy meter testing",
      "Power quality analysis"
    ]),
    applications: JSON.stringify([
      "Energy meter calibration",
      "Power analyzer testing",
      "Wattmeter verification",
      "Power factor meter calibration",
      "Electrical utility testing"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "CE certified",
      "IEC 61010 safety standard"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Power & Energy Calibrator",
      "Technology": "Advanced power measurement technology",
      "Interface": "USB, Ethernet, RS485",
      "Software": "MEATEST Power Suite",
      "Standards": "IEC 62053 compliance"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST P550 Power & Energy Calibrator provides comprehensive calibration capabilities for power and energy measurement instruments with high accuracy and wide measurement ranges."
  },

  // Process Calibrators
  {
    name: "MEATEST PC200 Process Calibrator",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "Portable process calibrator for temperature, pressure, and electrical signal calibration",
    imageUrl: null,
    rank: 4,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Temperature Range", value: "-200°C to +1370°C" },
      { key: "Pressure Range", value: "0-400 bar" },
      { key: "Voltage Range", value: "0-100V DC" },
      { key: "Current Range", value: "0-24mA" },
      { key: "Accuracy", value: "±0.01% of reading" },
      { key: "Resolution", value: "6½ digits" },
      { key: "Battery Life", value: "Up to 8 hours" }
    ]),
    featuresBenefits: JSON.stringify([
      "Multi-function process calibration",
      "Portable and rugged design",
      "High accuracy measurement",
      "Long battery life",
      "Easy-to-use interface",
      "Field calibration capability"
    ]),
    applications: JSON.stringify([
      "Temperature sensor calibration",
      "Pressure transmitter testing",
      "Process control calibration",
      "Field instrumentation",
      "Industrial maintenance"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "CE certified",
      "ATEX certified"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Process Calibrator",
      "Technology": "Multi-function calibration technology",
      "Interface": "USB, Bluetooth",
      "Power": "Rechargeable battery",
      "Protection": "IP54 rated"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST PC200 Process Calibrator is a portable, multi-function calibrator designed for field calibration of temperature, pressure, and electrical process instruments."
  },

  // Impedance Standards
  {
    name: "MEATEST IS100 Impedance Standard",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "High-precision impedance standard for LCR meter and impedance analyzer calibration",
    imageUrl: null,
    rank: 5,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Resistance Range", value: "1Ω-1MΩ" },
      { key: "Capacitance Range", value: "1pF-1mF" },
      { key: "Inductance Range", value: "1μH-1H" },
      { key: "Accuracy", value: "±0.01% of nominal" },
      { key: "Frequency Range", value: "DC-1MHz" },
      { key: "Temperature Coefficient", value: "±2ppm/°C" },
      { key: "Stability", value: "±0.005%/year" }
    ]),
    featuresBenefits: JSON.stringify([
      "High precision impedance standards",
      "Wide frequency range",
      "Excellent stability",
      "Low temperature coefficient",
      "Traceable calibration",
      "Multiple impedance types"
    ]),
    applications: JSON.stringify([
      "LCR meter calibration",
      "Impedance analyzer testing",
      "Component measurement",
      "Laboratory standards",
      "Quality control"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "NIST traceable",
      "CE certified"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Impedance Standard",
      "Technology": "Precision impedance network",
      "Connectors": "4-terminal Kelvin",
      "Shielding": "Electromagnetic shielding",
      "Temperature": "Controlled environment operation"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST IS100 Impedance Standard provides high-precision resistance, capacitance, and inductance standards for calibration of LCR meters and impedance analyzers."
  },

  // Decade Boxes
  {
    name: "MEATEST DB200 Resistance Decade Box",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "Precision resistance decade box for electrical meter calibration and testing",
    imageUrl: null,
    rank: 6,
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
    fullTechnicalInfo: "The MEATEST DB200 Resistance Decade Box provides precise resistance values from 0.1Ω to 1MΩ for calibration and testing of electrical resistance measuring instruments."
  },

  // High Current Calibrators
  {
    name: "MEATEST HC300 High Current Calibrator",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "High current calibrator for current transformer and clamp meter calibration",
    imageUrl: null,
    rank: 7,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Current Range", value: "0-3000A AC/DC" },
      { key: "Frequency Range", value: "45-65Hz" },
      { key: "Accuracy", value: "±0.1% of reading" },
      { key: "Output Power", value: "Up to 500W" },
      { key: "Current Density", value: "Up to 10A/mm²" },
      { key: "Cooling", value: "Forced air cooling" }
    ]),
    featuresBenefits: JSON.stringify([
      "High current calibration",
      "Wide current range",
      "High accuracy output",
      "Efficient cooling system",
      "Safe operation",
      "Remote control capability"
    ]),
    applications: JSON.stringify([
      "Current transformer calibration",
      "Clamp meter testing",
      "High current measurement",
      "Power system testing",
      "Industrial applications"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "CE certified",
      "IEC 61010 safety standard"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "High Current Calibrator",
      "Technology": "Advanced current generation",
      "Cooling": "Forced air cooling system",
      "Control": "Digital control interface",
      "Safety": "Multiple safety features"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST HC300 High Current Calibrator provides high current output up to 3000A for calibration of current transformers, clamp meters, and high current measuring instruments."
  },

  // Calibration Software
  {
    name: "MEATEST Calibration Suite",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "Comprehensive calibration software for automated calibration and data management",
    imageUrl: null,
    rank: 8,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Compatibility", value: "Windows 10/11" },
      { key: "Database", value: "SQL Server/MySQL" },
      { key: "Reports", value: "PDF, Excel, XML" },
      { key: "Automation", value: "Full automation support" },
      { key: "Standards", value: "ISO 17025 compliant" },
      { key: "Languages", value: "Multi-language support" }
    ]),
    featuresBenefits: JSON.stringify([
      "Automated calibration procedures",
      "Comprehensive data management",
      "ISO 17025 compliance",
      "Custom report generation",
      "Multi-language support",
      "Database integration"
    ]),
    applications: JSON.stringify([
      "Laboratory automation",
      "Calibration management",
      "Quality control",
      "Compliance reporting",
      "Data analysis"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 compliant",
      "CE certified software"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Calibration Management Software",
      "Technology": "Modern software architecture",
      "Database": "Relational database support",
      "Interface": "User-friendly GUI",
      "Integration": "Hardware communication"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST Calibration Suite is a comprehensive software solution for automated calibration procedures, data management, and compliance reporting in accordance with ISO 17025 standards."
  }
];

async function main() {
  console.log('Importing MEATEST calibration products...\n');

  try {
    let createdCount = 0;
    let updatedCount = 0;

    for (const product of meatestProducts) {
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
    console.log('\nMEATEST products import completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('MEATEST products import failed:', error);
    process.exit(1);
  }); 