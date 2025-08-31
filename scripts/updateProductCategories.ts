import { getDb } from '../server/mongo.js';

async function main() {
  const db = await getDb();
  const productsCollection = db.collection('Product');

  // Update all MEATEST products to have correct category structure
  const updateResult = await productsCollection.updateMany(
    {
      $or: [
        { name: { $regex: '9000' } },
        { name: { $regex: '9010' } },
        { name: { $regex: 'M160' } },
        { name: { $regex: 'Model' } },
        { category: { $regex: 'Multi‑Product Calibrators' } },
        { category: { $regex: 'Category Placeholder' } }
      ]
    },
    {
      $set: {
        category: 'Calibration System',
        subcategory: 'Electrical Calibrators'
      }
    }
  );

  console.log(`Updated ${updateResult.modifiedCount} products with correct category structure`);

  // Verify the changes
  const products = await productsCollection.find(
    { category: 'Calibration System' },
    { projection: { name: 1, category: 1, subcategory: 1 } }
  ).toArray();

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