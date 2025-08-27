import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting cleanup of invalid products...');

  try {
    // Delete products that were added through the import scripts
    // These are the ones causing the map/slice errors
    const deletedProducts = await prisma.product.deleteMany({
      where: {
        OR: [
          { name: { contains: 'M143' } },
          { name: { contains: 'M160' } },
          { name: { contains: '9000' } },
          { name: { contains: '9010' } },
          { name: { contains: 'Model' } },
          { name: { contains: 'Portable' } },
          { name: { contains: 'Multifunction' } },
          { name: { contains: 'Calibrator' } },
          { name: { contains: 'Pressure' } },
          { name: { contains: 'Comparator' } },
          { name: { contains: 'Pneumatic' } },
          { name: { contains: 'Hand Pump' } },
          { name: { contains: 'Vision' } },
          { name: { contains: 'CMM' } },
          { name: { contains: 'Datalogger' } },
          { name: { contains: 'Transmitter' } },
          { name: { contains: 'Gateway' } },
          { name: { contains: 'Sensor' } },
          { name: { contains: 'Monitor' } },
          { name: { contains: 'Meter' } },
          { name: { contains: 'Tool' } },
          { name: { contains: 'System' } },
          { name: { contains: 'Machine' } },
          { name: { contains: 'Testing' } },
          { name: { contains: 'Measuring' } },
          { name: { contains: 'Calibration' } },
          { name: { contains: 'Metrology' } },
          { name: { contains: 'Dimension' } },
          { name: { contains: 'Electrical' } },
          { name: { contains: 'Thermal' } },
          { name: { contains: 'Flow' } },
          { name: { contains: 'Mass' } },
          { name: { contains: 'Weight' } },
          { name: { contains: 'Volume' } },
          { name: { contains: 'Universal' } },
          { name: { contains: 'Compression' } },
          { name: { contains: 'Tensile' } },
          { name: { contains: 'Hardness' } },
          { name: { contains: 'Impact' } },
          { name: { contains: 'Fatigue' } },
          { name: { contains: 'Torsion' } },
          { name: { contains: 'Spring' } },
          { name: { contains: 'Bend' } },
          { name: { contains: 'Shear' } },
          { name: { contains: 'Peel' } },
          { name: { contains: 'Custom' } },
          { name: { contains: 'Coordinate' } },
          { name: { contains: 'Optical' } },
          { name: { contains: 'Laser' } },
          { name: { contains: 'Digital' } },
          { name: { contains: 'Micrometer' } },
          { name: { contains: 'Height' } },
          { name: { contains: 'Surface' } },
          { name: { contains: 'Profile' } },
          { name: { contains: 'Microscope' } },
          { name: { contains: 'Gauge' } },
          { name: { contains: 'Dial' } },
          { name: { contains: 'Indicator' } },
          { name: { contains: 'Angle' } },
          { name: { contains: 'Thickness' } },
          { name: { contains: 'Roundness' } },
          { name: { contains: 'Flatness' } },
          { name: { contains: 'Straightness' } }
        ]
      }
    });

    console.log(`Deleted ${deletedProducts.count} invalid products`);

    // Keep only products that were added through the admin panel
    // These should have proper data structure
    const remainingProducts = await prisma.product.findMany();
    console.log(`Remaining products: ${remainingProducts.length}`);
    
    if (remainingProducts.length > 0) {
      console.log('Remaining products:');
      remainingProducts.forEach(product => {
        console.log(`- ${product.name} (ID: ${product.id})`);
      });
    }

  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('Cleanup completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Cleanup failed:', error);
    process.exit(1);
  }); 