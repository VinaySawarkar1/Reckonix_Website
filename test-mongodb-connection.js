import { MongoClient } from 'mongodb';

// Test the MongoDB connection with the provided credentials
const connectionString = 'mongodb+srv://vinay:vinay@cluster0.4adl4tl.mongodb.net/reckonix?retryWrites=true&w=majority&authSource=admin';

async function testConnection() {
  console.log('🔍 Testing MongoDB connection...');
  console.log('Connection string:', connectionString);
  
  try {
    const client = new MongoClient(connectionString, {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    });
    
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test database access
    const db = client.db('reckonix');
    console.log('✅ Database "reckonix" accessed successfully');
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log('📋 Available collections:');
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    // Test a simple operation
    const testCollection = db.collection('test');
    const testDoc = { test: true, timestamp: new Date() };
    const insertResult = await testCollection.insertOne(testDoc);
    console.log('✅ Test document inserted:', insertResult.insertedId);
    
    // Clean up test document
    await testCollection.deleteOne({ _id: insertResult.insertedId });
    console.log('✅ Test document cleaned up');
    
    await client.close();
    console.log('✅ Connection closed successfully');
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    console.log('\n🎉 MongoDB connection test PASSED!');
    process.exit(0);
  } else {
    console.log('\n💥 MongoDB connection test FAILED!');
    process.exit(1);
  }
});
