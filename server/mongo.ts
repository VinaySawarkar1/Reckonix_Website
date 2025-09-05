import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

// Use the correct password for local development
const mongoUri = process.env.MONGODB_URL || 'mongodb+srv://vinaysarkar0:vinasawarkar@cluster0.4adl4tl.mongodb.net/reckonix?retryWrites=true&w=majority&ssl=true&authSource=admin';
const client = new MongoClient(mongoUri, {
  serverApi: ServerApiVersion.v1,
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
      await client.connect();
      isConnected = true;
      console.log('MongoDB connected successfully');
    }
    return client.db('reckonix'); // Use your MongoDB database name
  } catch (err) {
    console.error('MongoDB connection error:', err);
    isConnected = false;
    // Try to reconnect after a short delay
    setTimeout(async () => {
      try {
        await client.connect();
        isConnected = true;
        console.log('MongoDB reconnected successfully');
      } catch (retryErr) {
        console.error('MongoDB reconnection failed:', retryErr);
      }
    }, 5000);
    throw err;
  }
}
