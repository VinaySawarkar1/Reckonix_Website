import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Debugging server connection...');
console.log('Environment variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URL:', process.env.MONGODB_URL);

const mongoUri = process.env.MONGODB_URL || 'mongodb+srv://vinay:vinay@cluster0.4adl4tl.mongodb.net/reckonix?retryWrites=true&w=majority&authSource=admin';

console.log('Using connection string:', mongoUri);

async function testConnection() {
  try {
    const client = new MongoClient(mongoUri, {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      },
      retryWrites: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxIdleTimeMS: 30000,
      retryReads: true,
    });
    
    console.log('Connecting to MongoDB...');
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
    console.error('Error code:', error.code);
    console.error('Error name:', error.name);
    return false;
  }
}

testConnection();



