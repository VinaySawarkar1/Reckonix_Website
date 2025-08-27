import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking products for missing required fields...\n');

  try {
    const products = await prisma.product.findMany();

    let invalidProducts: Array<{id: number, name: string, issues: string[]}> = [];

    for (const product of products) {
      let hasIssues = false;
      const issues: string[] = [];

      // Check required fields
      if (!product.name || product.name.trim() === '') {
        hasIssues = true;
        issues.push('Missing or empty name');
      }

      if (!product.category || product.category.trim() === '') {
        hasIssues = true;
        issues.push('Missing or empty category');
      }

      if (!product.subcategory || product.subcategory.trim() === '') {
        hasIssues = true;
        issues.push('Missing or empty subcategory');
      }

      if (!product.shortDescription || product.shortDescription.trim() === '') {
        hasIssues = true;
        issues.push('Missing or empty shortDescription');
      }

      if (!product.imageUrl) {
        hasIssues = true;
        issues.push('Missing imageUrl');
      }

      if (product.rank === null || product.rank === undefined) {
        hasIssues = true;
        issues.push('Missing rank');
      }

      // Check for null values in optional fields that should be strings
      if (product.specifications === null) {
        hasIssues = true;
        issues.push('specifications is null (should be string)');
      }

      if (product.featuresBenefits === null) {
        hasIssues = true;
        issues.push('featuresBenefits is null (should be string)');
      }

      if (product.applications === null) {
        hasIssues = true;
        issues.push('applications is null (should be string)');
      }

      if (product.certifications === null) {
        hasIssues = true;
        issues.push('certifications is null (should be string)');
      }

      if (product.imageGallery === null) {
        hasIssues = true;
        issues.push('imageGallery is null (should be string)');
      }

      if (product.technicalDetails === null) {
        hasIssues = true;
        issues.push('technicalDetails is null (should be string)');
      }

      if (hasIssues) {
        invalidProducts.push({
          id: product.id,
          name: product.name,
          issues
        });
      }
    }

    console.log(`Found ${invalidProducts.length} products with missing required fields:\n`);

    for (const invalidProduct of invalidProducts) {
      console.log(`Product: ${invalidProduct.name} (ID: ${invalidProduct.id})`);
      invalidProduct.issues.forEach(issue => console.log(`  - ${issue}`));
      console.log('');
    }

    if (invalidProducts.length > 0) {
      console.log('Fixing products with missing required fields...\n');

      for (const invalidProduct of invalidProducts) {
        console.log(`Fixing ${invalidProduct.name}...`);

        // Get the original product data
        const originalProduct = products.find(p => p.id === invalidProduct.id);
        if (originalProduct) {
          // Update with safe defaults for null fields
          await prisma.product.update({
            where: { id: invalidProduct.id },
            data: {
              specifications: originalProduct.specifications || '[]',
              featuresBenefits: originalProduct.featuresBenefits || '[]',
              applications: originalProduct.applications || '[]',
              certifications: originalProduct.certifications || '[]',
              imageGallery: originalProduct.imageGallery || '[]',
              technicalDetails: originalProduct.technicalDetails || '{}',
              imageUrl: originalProduct.imageUrl || null,
              rank: originalProduct.rank || 1
            }
          });

          console.log(`  ✓ Fixed ${invalidProduct.name}`);
        }
      }

      console.log(`\nSuccessfully fixed ${invalidProducts.length} products`);
    } else {
      console.log('No products with missing required fields found!');
    }

  } catch (error) {
    console.error('Error during analysis:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('\nRequired fields check completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Required fields check failed:', error);
    process.exit(1);
  }); 