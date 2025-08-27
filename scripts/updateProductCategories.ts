import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Update all MEATEST products to have correct category structure
  const updatedProducts = await prisma.product.updateMany({
    where: {
      OR: [
        { name: { contains: '9000' } },
        { name: { contains: '9010' } },
        { name: { contains: 'M160' } },
        { name: { contains: 'Model' } },
        { category: { contains: 'Multi‑Product Calibrators' } },
        { category: { contains: 'Category Placeholder' } }
      ]
    },
    data: {
      category: 'Calibration System',
      subcategory: 'Electrical Calibrators'
    }
  });

  console.log(`Updated ${updatedProducts.count} products with correct category structure`);
  
  // Verify the changes
  const products = await prisma.product.findMany({
    where: {
      category: 'Calibration System'
    },
    select: {
      name: true,
      category: true,
      subcategory: true
    }
  });

  console.log('\nUpdated products:');
  products.forEach(product => {
    console.log(`- ${product.name} (${product.category} > ${product.subcategory})`);
  });
}

main()
  .then(() => {
    console.log('Category update complete!');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 