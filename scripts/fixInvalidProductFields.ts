import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting to fix invalid product fields...');

  try {
    // Get all products that might have invalid fields
    const products = await prisma.product.findMany({
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

    console.log(`Found ${products.length} products to fix`);

    let updatedCount = 0;

    for (const product of products) {
      console.log(`Fixing product: ${product.name} (ID: ${product.id})`);

      // Fix specifications field
      let specifications = product.specifications;
      if (typeof specifications === 'string') {
        try {
          const parsed = JSON.parse(specifications);
          if (typeof parsed === 'object' && parsed !== null) {
            // Convert object to array format if needed
            if (!Array.isArray(parsed)) {
              specifications = JSON.stringify(Object.entries(parsed).map(([key, value]) => ({
                key,
                value: String(value)
              })));
            }
          }
        } catch (e) {
          console.log(`  - Fixed specifications for ${product.name}`);
          specifications = '[]';
        }
      }

      // Fix featuresBenefits field
      let featuresBenefits = product.featuresBenefits;
      if (typeof featuresBenefits === 'string') {
        try {
          JSON.parse(featuresBenefits);
        } catch (e) {
          console.log(`  - Fixed featuresBenefits for ${product.name}`);
          featuresBenefits = '[]';
        }
      }

      // Fix applications field
      let applications = product.applications;
      if (typeof applications === 'string') {
        try {
          JSON.parse(applications);
        } catch (e) {
          console.log(`  - Fixed applications for ${product.name}`);
          applications = '[]';
        }
      }

      // Fix certifications field
      let certifications = product.certifications;
      if (typeof certifications === 'string') {
        try {
          JSON.parse(certifications);
        } catch (e) {
          console.log(`  - Fixed certifications for ${product.name}`);
          certifications = '[]';
        }
      }

      // Fix imageGallery field
      let imageGallery = product.imageGallery;
      if (typeof imageGallery === 'string') {
        try {
          JSON.parse(imageGallery);
        } catch (e) {
          console.log(`  - Fixed imageGallery for ${product.name}`);
          imageGallery = '[]';
        }
      }

      // Fix technicalDetails field
      let technicalDetails = product.technicalDetails;
      if (typeof technicalDetails === 'string') {
        try {
          JSON.parse(technicalDetails);
        } catch (e) {
          console.log(`  - Fixed technicalDetails for ${product.name}`);
          technicalDetails = '{}';
        }
      }

      // Update the product with fixed fields
      await prisma.product.update({
        where: { id: product.id },
        data: {
          specifications,
          featuresBenefits,
          applications,
          certifications,
          imageGallery,
          technicalDetails
        }
      });

      updatedCount++;
      console.log(`  - Updated ${product.name}`);
    }

    console.log(`\nSuccessfully fixed ${updatedCount} products`);
    console.log('All products now have valid JSON fields');

  } catch (error) {
    console.error('Error during field fixing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('Field fixing completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Field fixing failed:', error);
    process.exit(1);
  }); 