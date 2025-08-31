import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const mongoUri = process.env.MONGODB_URL || 'mongodb+srv://vinaysawarkar0:vgP9DZNlkiJWNNMH@cluster0.4adl4tl.mongodb.net/';
const client = new MongoClient(mongoUri, {
  serverApi: ServerApiVersion.v1,
  retryWrites: true,
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
    throw err;
  }
}
