import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating category names in the database...\n');

  try {
    // Update Calibration Systems to Calibration System
    const calibrationUpdate = await prisma.product.updateMany({
      where: {
        category: 'Calibration Systems'
      },
      data: {
        category: 'Calibration System'
      }
    });

    console.log(`Updated ${calibrationUpdate.count} products from 'Calibration Systems' to 'Calibration System'`);

    // Update Measuring Instruments to Measuring Systems if needed
    const measuringUpdate = await prisma.product.updateMany({
      where: {
        category: 'Measuring Instruments'
      },
      data: {
        category: 'Measuring Systems'
      }
    });

    console.log(`Updated ${measuringUpdate.count} products from 'Measuring Instruments' to 'Measuring Systems'`);

    // Verify the changes
    const categories = await prisma.product.groupBy({
      by: ['category'],
      _count: {
        category: true
      }
    });

    console.log('\nCurrent categories in database:');
    categories.forEach(cat => {
      console.log(`- ${cat.category}: ${cat._count.category} products`);
    });

    console.log('\n✅ Category names updated successfully!');

  } catch (error) {
    console.error('Error updating categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('\nCategory update completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Category update failed:', error);
    process.exit(1);
  }); 