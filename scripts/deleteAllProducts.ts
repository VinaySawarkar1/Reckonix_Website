import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Deleting all products from the database...\n');

  try {
    // Get count before deletion
    const countBefore = await prisma.product.count();
    console.log(`Found ${countBefore} products to delete`);

    if (countBefore === 0) {
      console.log('No products found to delete.');
      return;
    }

    // Delete all products
    const deletedProducts = await prisma.product.deleteMany({});
    
    console.log(`Successfully deleted ${deletedProducts.count} products`);

    // Verify deletion
    const countAfter = await prisma.product.count();
    console.log(`Products remaining: ${countAfter}`);

    if (countAfter === 0) {
      console.log('✅ All products have been successfully deleted!');
    } else {
      console.log('⚠️ Some products may still remain');
    }

  } catch (error) {
    console.error('Error during deletion:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('\nProduct deletion completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Product deletion failed:', error);
    process.exit(1);
  }); 