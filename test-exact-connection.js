import { MongoClient } from 'mongodb';

// Test the exact connection string that worked
const connectionString = 'mongodb+srv://vinay:vinay@cluster0.4adl4tl.mongodb.net/reckonix?retryWrites=true&w=majority&authSource=admin';

async function testExactConnection() {
  console.log('🔍 Testing exact connection string...');
  console.log('String:', connectionString);
  
  try {
    const client = new MongoClient(connectionString, {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    });
    
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const db = client.db('reckonix');
    await db.admin().ping();
    console.log('✅ Database ping successful!');
    
    await client.close();
    console.log('✅ Connection closed successfully!');
    
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
}

testExactConnection();



