import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Define the correct categories and subcategories
const categories = [
  {
    name: "Calibration",
    subcategories: [
      "Pressure Calibrator",
      "Multifunction Calibrator",
      "Decade Boxes",
      "Process Calibrators",
      "Impedance Standards",
      "Dimension Calibrators",
      "Electrical Calibrators", 
      "Thermal Calibrator",
      "Mass and Volume",
      "Flow Calibrator"
    ]
  },
  {
    name: "Metrology",
    subcategories: [
      "Coordinate Measuring Machine",
      "Vision Measuring Machine", 
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
    name: "Measuring",
    subcategories: [
      "Dataloggers",
      "Transmitters",
      "IOT Gateway",
      "Digital Calipers",
      "Digital Micrometers",
      "Dial Indicators",
      "Digital Indicators",
      "Angle Measuring Instruments",
      "Thickness Gauges"
    ]
  },
  {
    name: "Software",
    subcategories: [
      "Calibration Software",
      "Data Analysis Software",
      "Quality Management Software",
      "Measurement Software",
      "Reporting Software"
    ]
  }
];

async function resetCategories() {
  try {
    console.log('🔄 Resetting categories...');

    // Clear existing data
    await prisma.subcategory.deleteMany();
    await prisma.category.deleteMany();
    console.log('✅ Cleared existing categories and subcategories');

    // Create new categories and subcategories
    for (const categoryData of categories) {
      const category = await prisma.category.create({
        data: {
          name: categoryData.name,
          subcategories: {
            create: categoryData.subcategories.map(sub => ({ name: sub }))
          }
        }
      });
      console.log(`✅ Created category: ${category.name} with ${categoryData.subcategories.length} subcategories`);
    }

    console.log('🎉 Categories reset completed successfully!');
  } catch (error) {
    console.error('❌ Error resetting categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetCategories();





