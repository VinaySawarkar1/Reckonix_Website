import { MongoClient } from 'mongodb';

const mongoUri = 'mongodb+srv://vinay:vinay@cluster0.4adl4tl.mongodb.net/reckonix?retryWrites=true&w=majority';

async function checkDatabase() {
  try {
    console.log('🔍 Checking MongoDB database...');
    
    const client = new MongoClient(mongoUri);
    await client.connect();
    console.log('✅ MongoDB connected successfully!');
    
    const db = client.db('reckonix');
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📚 Collections found:');
    collections.forEach(col => console.log(`- ${col.name}`));
    
    // Check data in each collection
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`\n📊 ${collection.name}: ${count} documents`);
      
      if (count > 0) {
        // Show first document as sample
        const sample = await db.collection(collection.name).findOne();
        console.log(`   Sample:`, JSON.stringify(sample, null, 2).substring(0, 200) + '...');
      }
    }
    
    await client.close();
    console.log('\n✅ Database check completed!');
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  }
}

checkDatabase();
