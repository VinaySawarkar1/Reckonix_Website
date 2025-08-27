import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define the correct categories and subcategories as per admin panel
const validCategories = {
  "Calibration Systems": [
    "Dimension Calibrators",
    "Electrical Calibrators", 
    "Thermal Calibrator",
    "Pressure Calibrator",
    "Mass and Volume",
    "Flow Calibrator"
  ],
  "Metrology Systems": [
    "Universal Testing Machines",
    "Compression Testing Machines",
    "Tensile Testing Machines", 
    "Hardness Testing Machines",
    "Impact Testing Machines",
    "Fatigue Testing Machines",
    "Torsion Testing Machines",
    "Spring Testing Machines",
    "Bend Testing Machines",
    "Shear Testing Machines",
    "Peel Testing Machines",
    "Custom Testing Solutions"
  ],
  "Measuring Systems": [
    "Coordinate Measuring Machines (CMM)",
    "Optical Measuring Systems",
    "Laser Measuring Systems",
    "Digital Calipers",
    "Digital Micrometers",
    "Height Gauges",
    "Surface Roughness Testers",
    "Profile Projectors",
    "Toolmakers Microscopes",
    "Gauge Blocks",
    "Dial Indicators",
    "Digital Indicators",
    "Angle Measuring Instruments",
    "Thickness Gauges",
    "Roundness Testers",
    "Flatness Testers",
    "Straightness Testers"
  ]
};

async function main() {
  console.log('🔧 Synchronizing categories and subcategories...\n');

  try {
    // 1. Check current database state
    console.log('📊 Current database state:');
    const allProducts = await prisma.product.findMany();
    const categories = await prisma.product.groupBy({
      by: ['category'],
      _count: { category: true }
    });
    
    console.log('\nCategories in database:');
    categories.forEach(cat => {
      console.log(`- ${cat.category}: ${cat._count.category} products`);
    });

    const subcategories = await prisma.product.groupBy({
      by: ['subcategory'],
      _count: { subcategory: true }
    });

    console.log('\nSubcategories in database:');
    subcategories.forEach(subcat => {
      console.log(`- ${subcat.subcategory}: ${subcat._count.subcategory} products`);
    });

    // 2. Fix invalid categories
    console.log('\n🔧 Fixing invalid categories...');
    
    // Fix category names
    const categoryUpdates = [
      { from: 'Calibration System', to: 'Calibration Systems' },
      { from: 'Measuring Instruments', to: 'Measuring Systems' }
    ];

    for (const update of categoryUpdates) {
      const result = await prisma.product.updateMany({
        where: { category: update.from },
        data: { category: update.to }
      });
      if (result.count > 0) {
        console.log(`✅ Updated ${result.count} products from '${update.from}' to '${update.to}'`);
      }
    }

    // 3. Fix invalid subcategories
    console.log('\n🔧 Fixing invalid subcategories...');
    
    // Map invalid subcategories to valid ones
    const subcategoryMappings = [
      { from: 'Electrical Calibrators', to: 'Electrical Calibrators' }, // Already correct
      { from: 'Mechanical Calibrators', to: 'Dimension Calibrators' },
      { from: 'Pressure Calibrators', to: 'Pressure Calibrator' },
      { from: 'Vision Measuring Machine > Fully Automatic VMM', to: 'Coordinate Measuring Machines (CMM)' },
      { from: 'Vision Measuring Machines', to: 'Coordinate Measuring Machines (CMM)' }
    ];

    for (const mapping of subcategoryMappings) {
      if (mapping.from !== mapping.to) {
        const result = await prisma.product.updateMany({
          where: { subcategory: mapping.from },
          data: { subcategory: mapping.to }
        });
        if (result.count > 0) {
          console.log(`✅ Updated ${result.count} products from '${mapping.from}' to '${mapping.to}'`);
        }
      }
    }

    // 4. Set default subcategory for products without one
    console.log('\n🔧 Setting default subcategories...');
    
    const productsWithoutSubcategory = await prisma.product.findMany({
      where: { subcategory: null }
    });

    for (const product of productsWithoutSubcategory) {
      let defaultSubcategory = '';
      
      if (product.category === 'Calibration Systems') {
        defaultSubcategory = 'Electrical Calibrators';
      } else if (product.category === 'Metrology Systems') {
        defaultSubcategory = 'Universal Testing Machines';
      } else if (product.category === 'Measuring Systems') {
        defaultSubcategory = 'Coordinate Measuring Machines (CMM)';
      }

      if (defaultSubcategory) {
        await prisma.product.update({
          where: { id: product.id },
          data: { subcategory: defaultSubcategory }
        });
        console.log(`✅ Set default subcategory '${defaultSubcategory}' for product '${product.name}'`);
      }
    }

    // 5. Final verification
    console.log('\n📊 Final database state:');
    const finalCategories = await prisma.product.groupBy({
      by: ['category'],
      _count: { category: true }
    });
    
    console.log('\nFinal categories:');
    finalCategories.forEach(cat => {
      console.log(`- ${cat.category}: ${cat._count.category} products`);
    });

    const finalSubcategories = await prisma.product.groupBy({
      by: ['subcategory'],
      _count: { subcategory: true }
    });

    console.log('\nFinal subcategories:');
    finalSubcategories.forEach(subcat => {
      console.log(`- ${subcat.subcategory}: ${subcat._count.subcategory} products`);
    });

    console.log('\n✅ Category synchronization completed successfully!');

  } catch (error) {
    console.error('❌ Error synchronizing categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('\n🎉 Synchronization completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Synchronization failed:', error);
    process.exit(1);
  }); 