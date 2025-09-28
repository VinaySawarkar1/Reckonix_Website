require('dotenv').config();
const { MongoClient } = require('mongodb');

const mongoUri = process.env.MONGODB_URL || 'mongodb+srv://vinaysarkar0:vinasawarkar@cluster0.4adl4tl.mongodb.net/reckonix?retryWrites=true&w=majority';

const client = new MongoClient(mongoUri);

// Define the correct category names
const categoryUpdates = [
  { from: 'Calibration', to: 'Calibration Systems' },
  { from: 'Metrology', to: 'Testing Systems' },
  { from: 'Measuring', to: 'Measuring Systems' },
  { from: 'Software', to: 'Software' }
];

async function updateCategories() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('reckonix');
    
    // First, let's see current categories
    const currentCategories = await db.collection('Category').find({}).toArray();
    console.log('Current categories:', currentCategories.map(c => c.name));
    
    // Update categories
    for (const update of categoryUpdates) {
      if (update.from !== update.to) {
        const result = await db.collection('Category').updateMany(
          { name: update.from },
          { $set: { name: update.to } }
        );
        console.log(`Updated ${result.modifiedCount} categories from '${update.from}' to '${update.to}'`);
      }
    }
    
    // Update products that reference these categories
    for (const update of categoryUpdates) {
      if (update.from !== update.to) {
        const result = await db.collection('Product').updateMany(
          { category: update.from },
          { $set: { category: update.to } }
        );
        console.log(`Updated ${result.modifiedCount} products from '${update.from}' to '${update.to}'`);
      }
    }
    
    // Verify the changes
    const updatedCategories = await db.collection('Category').find({}).toArray();
    console.log('Updated categories:', updatedCategories.map(c => c.name));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

updateCategories();
