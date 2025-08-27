import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Categories and subcategories structure
const categories = [
  {
    name: "Calibration Systems",
    subcategories: [
      "Dimension Calibrators",
      "Electrical Calibrators", 
      "Thermal Calibrator",
      "Pressure Calibrator",
      "Mass and Volume",
      "Flow Calibrator"
    ]
  },
  {
    name: "Metrology Systems",
    subcategories: [
      "Vision Measuring Machine",
      "Coordinate Measuring Machine", 
      "Tool Presetter",
      "Optical Comparator",
      "Video Measuring System",
      "Height Gauge",
      "Roundness Measuring Machine",
      "Surface Roughness Tester",
      "Hardness Tester",
      "Profile Projector",
      "Linear Scale & DRO",
      "Granite Surface Plate",
      "Calibration Instruments"
    ]
  },
  {
    name: "Measuring Systems",
    subcategories: [
      "Dataloggers",
      "Transmitters",
      "IOT Gateway"
    ]
  }
];

// MEATEST Multifunction Calibrator Products
const meatestProducts = [
  {
    name: "MEATEST M160i Precision Multifunction Calibrator",
    category: "Calibration Systems",
    subcategory: "Electrical Calibrators",
    shortDescription: "High-precision multifunction calibrator for voltage, current, resistance, frequency, and temperature calibration with advanced features.",
    fullTechnicalInfo: "The MEATEST M160i is a state-of-the-art multifunction calibrator designed for comprehensive calibration of electrical measuring instruments. It provides high-accuracy outputs for voltage, current, resistance, frequency, and temperature measurements. The instrument features advanced calibration software, temperature compensation, and comprehensive error analysis capabilities.",
    specifications: [
      { key: "Voltage Range (DC)", value: "0 to ±1000V" },
      { key: "Voltage Range (AC)", value: "0 to 1000V (10Hz-100kHz)" },
      { key: "Current Range (DC)", value: "0 to ±20A" },
      { key: "Current Range (AC)", value: "0 to 20A (10Hz-100kHz)" },
      { key: "Resistance Range", value: "0 to 1GΩ" },
      { key: "Frequency Range", value: "0.1Hz to 1MHz" },
      { key: "Temperature Range", value: "-200°C to +1372°C" },
      { key: "Voltage Accuracy", value: "0.01% of reading + 0.005% of range" },
      { key: "Current Accuracy", value: "0.02% of reading + 0.01% of range" },
      { key: "Resistance Accuracy", value: "0.01% of reading + 0.005% of range" },
      { key: "Frequency Accuracy", value: "0.001% of reading" },
      { key: "Temperature Accuracy", value: "±0.1°C" },
      { key: "Resolution", value: "6½ digits" },
      { key: "Interface", value: "USB, RS232, GPIB, Ethernet" },
      { key: "Power Supply", value: "100-240V AC, 50/60Hz" },
      { key: "Operating Temperature", value: "0°C to +50°C" },
      { key: "Dimensions", value: "430 x 133 x 400 mm" },
      { key: "Weight", value: "8.5 kg" }
    ],
    featuresBenefits: [
      "Multifunction calibration capabilities",
      "High accuracy and stability",
      "Programmable output sequences",
      "Temperature compensation",
      "Comprehensive error analysis",
      "Multiple interface options",
      "User-friendly software interface",
      "Built-in self-calibration",
      "Wide measurement ranges",
      "Advanced calibration software",
      "Remote operation capability",
      "Data logging and analysis"
    ],
    applications: [
      "Calibration of digital multimeters",
      "Data logger calibration",
      "Process control instrument calibration",
      "Laboratory reference standards",
      "Quality assurance testing",
      "Research and development",
      "Metrology laboratories",
      "Industrial calibration services",
      "Temperature sensor calibration",
      "Frequency meter calibration",
      "Resistance bridge calibration",
      "Automated calibration systems"
    ],
    certifications: [
      "ISO 9001:2015",
      "CE Marking",
      "IEC 61010-1",
      "NIST traceable",
      "ISO 17025 compliant"
    ],
    imageUrl: "https://www.meatest.com/ew/ew_images/image?EwImage=m160i-multifunction-1&Filter=f764a165-4d4c-47a0-9f0f-ddedb54abee1",
    technicalDetails: {
      dimensions: "430 x 133 x 400 mm",
      weight: "8.5 kg",
      powerRequirements: "100-240V AC, 50/60Hz, 50W",
      operatingConditions: "Temperature: 0-50°C, Humidity: 20-80% RH",
      warranty: "3 years",
      compliance: ["IEC 61010-1", "CE", "NIST traceable", "ISO 17025"]
    }
  },
  {
    name: "MEATEST M160i-2 Dual Channel Multifunction Calibrator",
    category: "Calibration Systems",
    subcategory: "Electrical Calibrators",
    shortDescription: "Dual-channel multifunction calibrator for simultaneous calibration of multiple instruments with independent channel control.",
    fullTechnicalInfo: "The MEATEST M160i-2 is a dual-channel multifunction calibrator that provides independent control of two calibration channels. This advanced system allows simultaneous calibration of multiple instruments, significantly improving productivity in calibration laboratories. Each channel offers the same high accuracy and comprehensive measurement capabilities as the single-channel version.",
    specifications: [
      { key: "Channels", value: "2 independent channels" },
      { key: "Voltage Range (DC)", value: "0 to ±1000V per channel" },
      { key: "Voltage Range (AC)", value: "0 to 1000V per channel (10Hz-100kHz)" },
      { key: "Current Range (DC)", value: "0 to ±20A per channel" },
      { key: "Current Range (AC)", value: "0 to 20A per channel (10Hz-100kHz)" },
      { key: "Resistance Range", value: "0 to 1GΩ per channel" },
      { key: "Frequency Range", value: "0.1Hz to 1MHz per channel" },
      { key: "Temperature Range", value: "-200°C to +1372°C per channel" },
      { key: "Channel Isolation", value: ">1000V between channels" },
      { key: "Voltage Accuracy", value: "0.01% of reading + 0.005% of range" },
      { key: "Current Accuracy", value: "0.02% of reading + 0.01% of range" },
      { key: "Resistance Accuracy", value: "0.01% of reading + 0.005% of range" },
      { key: "Frequency Accuracy", value: "0.001% of reading" },
      { key: "Temperature Accuracy", value: "±0.1°C" },
      { key: "Resolution", value: "6½ digits" },
      { key: "Interface", value: "USB, Ethernet, GPIB" },
      { key: "Power Supply", value: "100-240V AC, 50/60Hz" },
      { key: "Operating Temperature", value: "0°C to +50°C" },
      { key: "Dimensions", value: "430 x 133 x 400 mm" },
      { key: "Weight", value: "10 kg" }
    ],
    featuresBenefits: [
      "Dual independent channels",
      "Simultaneous calibration capability",
      "High channel isolation",
      "Independent channel control",
      "Advanced synchronization features",
      "Comprehensive software control",
      "Built-in safety features",
      "Remote operation capability",
      "High accuracy and stability",
      "Programmable output sequences",
      "Temperature compensation",
      "Comprehensive error analysis"
    ],
    applications: [
      "Multi-function instrument calibration",
      "Simultaneous voltage/current testing",
      "Automated calibration systems",
      "High-volume calibration labs",
      "Research and development",
      "Metrology laboratories",
      "Industrial calibration services",
      "Temperature sensor calibration",
      "Frequency meter calibration",
      "Resistance bridge calibration"
    ],
    certifications: [
      "ISO 9001:2015",
      "CE Marking",
      "IEC 61010-1",
      "NIST traceable",
      "ISO 17025 compliant"
    ],
    imageUrl: "https://www.meatest.com/ew/ew_images/image?EwImage=m160i-2-dual-1&Filter=f764a165-4d4c-47a0-9f0f-ddedb54abee1",
    technicalDetails: {
      dimensions: "430 x 133 x 400 mm",
      weight: "10 kg",
      powerRequirements: "100-240V AC, 50/60Hz, 100W",
      operatingConditions: "Temperature: 0-50°C, Humidity: 20-80% RH",
      warranty: "3 years",
      compliance: ["IEC 61010-1", "CE", "NIST traceable", "ISO 17025"]
    }
  }
];

// Reckonix Mechanical Calibration Products
const reckonixProducts = [
  {
    name: "Tape And Scale Calibration Unit",
    category: "Calibration Systems",
    subcategory: "Dimension Calibrators",
    shortDescription: "Unit for precise calibration of measuring tapes and scales up to 1000mm.",
    fullTechnicalInfo: "The Tape and Scale Calibration Unit is essential for calibrating steel rules, measuring scales, and tapes. It features a variable loading system, easy alignment, and digital image comparison with 10X magnification. Accessories include software, rotating wheel, and tension weight.",
    specifications: [
      { key: "Measuring Range", value: "up to 1000mm" },
      { key: "Accessories", value: "Software copy, rotating wheel, weight for tension" },
      { key: "Service Location", value: "Pan India" },
      { key: "Manufacturing Facility", value: "Pune" }
    ],
    featuresBenefits: [
      "Calibrates steel rules, scales, and tapes",
      "Digital image comparison (10X)",
      "Variable loading system",
      "Easy alignment system",
      "Wide industrial application"
    ],
    applications: [
      "Civil, mechanical, textile industries",
      "Society measurement standards",
      "Laboratories"
    ],
    certifications: ["ISO 9001:2015"],
    imageUrl: "https://www.reckonix.in/images/tape-scale-calibration-unit.jpg",
    technicalDetails: {
      dimensions: "N/A",
      weight: "N/A",
      powerRequirements: "N/A",
      operatingConditions: "N/A",
      warranty: "1 year",
      compliance: ["ISO 9001:2015"]
    }
  },
  {
    name: "Analog Dial Calibration Tester",
    category: "Calibration Systems",
    subcategory: "Dimension Calibrators",
    shortDescription: "Analog dial calibration tester for industrial applications.",
    fullTechnicalInfo: "The Analog Dial Calibration Tester offers 0.01% accuracy, digital display, and robust CI casting construction. Designed for industrial calibration of analog dials.",
    specifications: [
      { key: "Accuracy", value: "0.01%" },
      { key: "Display Type", value: "Digital" },
      { key: "Material", value: "CI Casting" },
      { key: "Power Source", value: "Electrical" }
    ],
    featuresBenefits: [
      "High accuracy",
      "Digital display",
      "Industrial grade construction"
    ],
    applications: ["Industrial calibration", "Laboratories"],
    certifications: ["ISO 9001:2015"],
    imageUrl: "https://www.reckonix.in/images/analog-dial-calibration-tester.jpg",
    technicalDetails: {
      dimensions: "N/A",
      weight: "N/A",
      powerRequirements: "Electrical",
      operatingConditions: "N/A",
      warranty: "1 year",
      compliance: ["ISO 9001:2015"]
    }
  },
  {
    name: "Stainless Steel Electronic Dial Calibration Tester",
    category: "Calibration Systems",
    subcategory: "Dimension Calibrators",
    shortDescription: "Stainless steel electronic dial calibration tester for industrial use.",
    fullTechnicalInfo: "This tester features a digital display, stainless steel construction, and is designed for industrial calibration of electronic dials. Operates at 50 Hz.",
    specifications: [
      { key: "Material", value: "Stainless Steel" },
      { key: "Display Type", value: "Digital" },
      { key: "Frequency", value: "50 Hz" },
      { key: "Power Source", value: "Electrical" }
    ],
    featuresBenefits: [
      "Stainless steel build",
      "Digital display",
      "Industrial application"
    ],
    applications: ["Industrial calibration", "Laboratories"],
    certifications: ["ISO 9001:2015"],
    imageUrl: "https://www.reckonix.in/images/ss-electronic-dial-calibration-tester.jpg",
    technicalDetails: {
      dimensions: "N/A",
      weight: "N/A",
      powerRequirements: "Electrical",
      operatingConditions: "N/A",
      warranty: "1 year",
      compliance: ["ISO 9001:2015"]
    }
  },
  {
    name: "Dial Calibration Tester",
    category: "Calibration Systems",
    subcategory: "Dimension Calibrators",
    shortDescription: "Digital dial calibration tester for laboratory use.",
    fullTechnicalInfo: "Model RXDCT25, made of SS with Sylvac dial, digital display, and +/-2um accuracy. Designed for laboratory calibration.",
    specifications: [
      { key: "Model Name/Number", value: "RXDCT25" },
      { key: "Material", value: "SS with Sylvac dial" },
      { key: "Display Type", value: "Digital" },
      { key: "Accuracy", value: "+/-2um" }
    ],
    featuresBenefits: [
      "Digital display",
      "High accuracy",
      "Laboratory grade"
    ],
    applications: ["Laboratory calibration", "Quality control"],
    certifications: ["ISO 9001:2015"],
    imageUrl: "https://www.reckonix.in/images/dial-calibration-tester.jpg",
    technicalDetails: {
      dimensions: "N/A",
      weight: "N/A",
      powerRequirements: "N/A",
      operatingConditions: "N/A",
      warranty: "1 year",
      compliance: ["ISO 9001:2015"]
    }
  },
  {
    name: "Steel Caliper Checker",
    category: "Calibration Systems",
    subcategory: "Dimension Calibrators",
    shortDescription: "Precision caliper checker for verifying caliper accuracy (0-1000mm).",
    fullTechnicalInfo: "The Steel Caliper Checker is engineered for verifying and calibrating calipers. It features robust stainless steel construction, 0.001mm accuracy, and is portable for on-site calibration. Provides calibration traceability and detailed reports.",
    specifications: [
      { key: "Measuring Range", value: "0 - 1000 mm" },
      { key: "Material", value: "Stainless Steel" },
      { key: "Size/Dimension", value: "1000 mm" },
      { key: "Accuracy", value: "0.001 mm" }
    ],
    featuresBenefits: [
      "Accurate calibration",
      "User-friendly design",
      "Versatile compatibility",
      "Robust construction",
      "Calibration traceability",
      "Comprehensive testing",
      "Portable and convenient"
    ],
    applications: ["Laboratory calibration", "Industrial calibration", "On-site verification"],
    certifications: ["ISO 9001:2015"],
    imageUrl: "https://www.reckonix.in/images/steel-caliper-checker.jpg",
    technicalDetails: {
      dimensions: "1000 mm",
      weight: "N/A",
      powerRequirements: "N/A",
      operatingConditions: "N/A",
      warranty: "1 year",
      compliance: ["ISO 9001:2015"]
    }
  }
];

async function setupDatabase() {
  try {
    console.log('Starting database setup...');

    // Clear existing data
    await prisma.product.deleteMany();
    await prisma.subcategory.deleteMany();
    await prisma.category.deleteMany();
    console.log('Cleared existing data');

    // Create categories and subcategories
    for (const categoryData of categories) {
      const category = await prisma.category.create({
        data: {
          name: categoryData.name,
          subcategories: {
            create: categoryData.subcategories.map(sub => ({ name: sub }))
          }
        }
      });
      console.log(`Created category: ${category.name} with ${categoryData.subcategories.length} subcategories`);
    }

    // Add MEATEST products
    for (const productData of meatestProducts) {
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          category: productData.category,
          subcategory: productData.subcategory,
          shortDescription: productData.shortDescription,
          fullTechnicalInfo: productData.fullTechnicalInfo,
          specifications: JSON.stringify(productData.specifications),
          featuresBenefits: JSON.stringify(productData.featuresBenefits),
          applications: JSON.stringify(productData.applications),
          certifications: JSON.stringify(productData.certifications),
          imageUrl: productData.imageUrl,
          technicalDetails: JSON.stringify(productData.technicalDetails),
          homeFeatured: false,
          rank: 0,
          views: 0
        }
      });
      console.log(`Added MEATEST product: ${product.name}`);
    }

    // Add Reckonix products
    for (const productData of reckonixProducts) {
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          category: productData.category,
          subcategory: productData.subcategory,
          shortDescription: productData.shortDescription,
          fullTechnicalInfo: productData.fullTechnicalInfo,
          specifications: JSON.stringify(productData.specifications),
          featuresBenefits: JSON.stringify(productData.featuresBenefits),
          applications: JSON.stringify(productData.applications),
          certifications: JSON.stringify(productData.certifications),
          imageUrl: productData.imageUrl,
          technicalDetails: JSON.stringify(productData.technicalDetails),
          homeFeatured: false,
          rank: 0,
          views: 0
        }
      });
      console.log(`Added Reckonix product: ${product.name}`);
    }

    // Create admin user
    try {
      await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
          username: 'admin',
          password: 'admin123',
          role: 'admin'
        }
      });
      console.log('Created admin user');
    } catch (error) {
      console.log('Admin user already exists or could not be created');
    }

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase(); 