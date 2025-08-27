import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Identifying products with problematic JSON fields...\n');

  try {
    const products = await prisma.product.findMany();

    let problematicProducts: Array<{id: number, name: string, issues: string[]}> = [];

    for (const product of products) {
      let hasIssues = false;
      const issues: string[] = [];

      // Check for extremely long JSON strings
      if (product.specifications && product.specifications.length > 1000) {
        hasIssues = true;
        issues.push(`Specifications too long: ${product.specifications.length} chars`);
      }

      if (product.featuresBenefits && product.featuresBenefits.length > 1000) {
        hasIssues = true;
        issues.push(`Features/Benefits too long: ${product.featuresBenefits.length} chars`);
      }

      if (product.applications && product.applications.length > 1000) {
        hasIssues = true;
        issues.push(`Applications too long: ${product.applications.length} chars`);
      }

      if (product.certifications && product.certifications.length > 1000) {
        hasIssues = true;
        issues.push(`Certifications too long: ${product.certifications.length} chars`);
      }

      if (product.imageGallery && product.imageGallery.length > 1000) {
        hasIssues = true;
        issues.push(`Image Gallery too long: ${product.imageGallery.length} chars`);
      }

      if (product.technicalDetails && product.technicalDetails.length > 1000) {
        hasIssues = true;
        issues.push(`Technical Details too long: ${product.technicalDetails.length} chars`);
      }

      // Check for invalid JSON
      try {
        if (product.specifications) JSON.parse(product.specifications);
      } catch (e) {
        hasIssues = true;
        issues.push('Invalid specifications JSON');
      }

      try {
        if (product.featuresBenefits) JSON.parse(product.featuresBenefits);
      } catch (e) {
        hasIssues = true;
        issues.push('Invalid featuresBenefits JSON');
      }

      try {
        if (product.applications) JSON.parse(product.applications);
      } catch (e) {
        hasIssues = true;
        issues.push('Invalid applications JSON');
      }

      try {
        if (product.certifications) JSON.parse(product.certifications);
      } catch (e) {
        hasIssues = true;
        issues.push('Invalid certifications JSON');
      }

      try {
        if (product.imageGallery) JSON.parse(product.imageGallery);
      } catch (e) {
        hasIssues = true;
        issues.push('Invalid imageGallery JSON');
      }

      try {
        if (product.technicalDetails) JSON.parse(product.technicalDetails);
      } catch (e) {
        hasIssues = true;
        issues.push('Invalid technicalDetails JSON');
      }

      if (hasIssues) {
        problematicProducts.push({
          id: product.id,
          name: product.name,
          issues
        });
      }
    }

    console.log(`Found ${problematicProducts.length} problematic products:\n`);

    for (const product of problematicProducts) {
      console.log(`Product: ${product.name} (ID: ${product.id})`);
      product.issues.forEach(issue => console.log(`  - ${issue}`));
      console.log('');
    }

    if (problematicProducts.length > 0) {
      console.log('Fixing problematic products...\n');

      for (const product of problematicProducts) {
        console.log(`Fixing ${product.name}...`);

        // Reset all JSON fields to safe defaults
        await prisma.product.update({
          where: { id: product.id },
          data: {
            specifications: '[]',
            featuresBenefits: '[]',
            applications: '[]',
            certifications: '[]',
            imageGallery: '[]',
            technicalDetails: '{}'
          }
        });

        console.log(`  ✓ Fixed ${product.name}`);
      }

      console.log(`\nSuccessfully fixed ${problematicProducts.length} products`);
    } else {
      console.log('No problematic products found!');
    }

  } catch (error) {
    console.error('Error during analysis:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('\nAnalysis completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Analysis failed:', error);
    process.exit(1);
  }); 