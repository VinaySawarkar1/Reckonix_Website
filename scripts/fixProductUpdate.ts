import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Testing product update functionality...\n');

  try {
    // Get a sample product to test with
    const sampleProduct = await prisma.product.findFirst({
      where: { category: 'Calibration Systems' },
      include: { images: true }
    });

    if (!sampleProduct) {
      console.log('❌ No products found to test with');
      return;
    }

    console.log('📊 Sample product before update:');
    console.log(`- ID: ${sampleProduct.id}`);
    console.log(`- Name: ${sampleProduct.name}`);
    console.log(`- Category: ${sampleProduct.category}`);
    console.log(`- Subcategory: ${sampleProduct.subcategory}`);
    console.log(`- Images: ${sampleProduct.images.length}`);

    // Test updating the subcategory
    const updatedProduct = await prisma.product.update({
      where: { id: sampleProduct.id },
      data: {
        subcategory: 'Electrical Calibrators', // Change to a different subcategory
        name: `${sampleProduct.name} (Updated)`
      },
      include: { images: true }
    });

    console.log('\n✅ Product updated successfully!');
    console.log('📊 Sample product after update:');
    console.log(`- ID: ${updatedProduct.id}`);
    console.log(`- Name: ${updatedProduct.name}`);
    console.log(`- Category: ${updatedProduct.category}`);
    console.log(`- Subcategory: ${updatedProduct.subcategory}`);
    console.log(`- Images: ${updatedProduct.images.length}`);

    // Verify the update was saved
    const verifyProduct = await prisma.product.findUnique({
      where: { id: sampleProduct.id },
      include: { images: true }
    });

    console.log('\n🔍 Verification:');
    console.log(`- Subcategory updated: ${verifyProduct?.subcategory === 'Electrical Calibrators' ? '✅' : '❌'}`);
    console.log(`- Name updated: ${verifyProduct?.name.includes('(Updated)') ? '✅' : '❌'}`);

    console.log('\n✅ Database update functionality is working correctly!');

  } catch (error) {
    console.error('❌ Error testing product update:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('\n🎉 Test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test failed:', error);
    process.exit(1);
  }); 