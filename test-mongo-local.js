import { MongoClient } from 'mongodb';

// Use the correct credentials: username 'vinay', password 'vinay'
const mongoUri = 'mongodb+srv://vinay:vinay@cluster0.4adl4tl.mongodb.net/?retryWrites=true&w=majority';

async function testConnection() {
  try {
    console.log('Testing MongoDB connection with correct credentials...');
    console.log('Username: vinay');
    console.log('Password: vinay');
    console.log('URI:', mongoUri);
    
    const client = new MongoClient(mongoUri);
    await client.connect();
    console.log('✅ MongoDB connected successfully!');
    
    // List all databases
    const adminDb = client.db('admin');
    const dbs = await adminDb.admin().listDatabases();
    console.log('Available databases:', dbs.databases.map(db => db.name));
    
    await client.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  }
}

testConnection();
