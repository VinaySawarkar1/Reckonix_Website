import { MongoClient, ServerApiVersion } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();

// Use the correct password for local development
const mongoUri = process.env.MONGODB_URL || 'mongodb+srv://vinay:vinay@cluster0.4adl4tl.mongodb.net/reckonix?retryWrites=true&w=majority&authSource=admin';
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

let isConnected = false;

export async function getDb() {
  try {
    if (!isConnected) {
      console.log('Connecting to MongoDB...');
      await client.connect();
      isConnected = true;
      console.log('✅ Connected to MongoDB successfully');
    }
    return client.db('reckonix');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    isConnected = false;
    throw err;
  }
}
