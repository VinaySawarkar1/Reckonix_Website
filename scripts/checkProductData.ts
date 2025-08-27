import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking product data structure...\n');

  try {
    const products = await prisma.product.findMany({ take: 5 });

    console.log('Sample products:');
    products.forEach((p, index) => {
      console.log(`\n=== Product ${index + 1}: ${p.name} (ID: ${p.id}) ===`);
      console.log('Category:', p.category);
      console.log('Subcategory:', p.subcategory);
      console.log('Short Description:', p.shortDescription);
      console.log('Image URL:', p.imageUrl);
      console.log('Rank:', p.rank);
      console.log('Home Featured:', p.homeFeatured);
      console.log('Views:', p.views);
      
      console.log('\n--- JSON Fields ---');
      console.log('Specifications:', typeof p.specifications, '| Value:', p.specifications);
      console.log('Features/Benefits:', typeof p.featuresBenefits, '| Value:', p.featuresBenefits);
      console.log('Applications:', typeof p.applications, '| Value:', p.applications);
      console.log('Certifications:', typeof p.certifications, '| Value:', p.certifications);
      console.log('Image Gallery:', typeof p.imageGallery, '| Value:', p.imageGallery);
      console.log('Technical Details:', typeof p.technicalDetails, '| Value:', p.technicalDetails);
      
      console.log('\n--- PDF Fields ---');
      console.log('Catalog PDF:', p.catalogPdfUrl);
      console.log('Datasheet PDF:', p.datasheetPdfUrl);
      
      console.log('\n--- Other Fields ---');
      console.log('Full Technical Info:', p.fullTechnicalInfo);
      console.log('Created At:', p.createdAt);
      
      // Test JSON parsing
      console.log('\n--- JSON Parsing Tests ---');
      try {
        if (p.specifications) JSON.parse(p.specifications);
        console.log('✓ Specifications: Valid JSON');
      } catch (e) {
        console.log('✗ Specifications: Invalid JSON');
      }
      
      try {
        if (p.featuresBenefits) JSON.parse(p.featuresBenefits);
        console.log('✓ Features/Benefits: Valid JSON');
      } catch (e) {
        console.log('✗ Features/Benefits: Invalid JSON');
      }
      
      try {
        if (p.applications) JSON.parse(p.applications);
        console.log('✓ Applications: Valid JSON');
      } catch (e) {
        console.log('✗ Applications: Invalid JSON');
      }
      
      try {
        if (p.certifications) JSON.parse(p.certifications);
        console.log('✓ Certifications: Valid JSON');
      } catch (e) {
        console.log('✗ Certifications: Invalid JSON');
      }
      
      try {
        if (p.imageGallery) JSON.parse(p.imageGallery);
        console.log('✓ Image Gallery: Valid JSON');
      } catch (e) {
        console.log('✗ Image Gallery: Invalid JSON');
      }
      
      try {
        if (p.technicalDetails) JSON.parse(p.technicalDetails);
        console.log('✓ Technical Details: Valid JSON');
      } catch (e) {
        console.log('✗ Technical Details: Invalid JSON');
      }
    });

    console.log('\n=== SCHEMA REQUIREMENTS ===');
    console.log('Required fields: name, category, subcategory, shortDescription, imageUrl, rank');
    console.log('Optional fields: specifications, featuresBenefits, applications, certifications, imageGallery, technicalDetails, catalogPdfUrl, datasheetPdfUrl, fullTechnicalInfo, homeFeatured, views');
    console.log('Auto fields: id, createdAt, updatedAt');

  } catch (error) {
    console.error('Error checking product data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('\nData check completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Data check failed:', error);
    process.exit(1);
  }); 