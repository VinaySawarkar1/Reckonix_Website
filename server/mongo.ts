import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

// Use the correct password for local development
const mongoUri = process.env.MONGODB_URL || 'mongodb+srv://vinaysarkar0:vinasawarkar@cluster0.4adl4tl.mongodb.net/reckonix?retryWrites=true&w=majority&authSource=admin';
const client = new MongoClient(mongoUri, {
  serverApi: ServerApiVersion.v1,
  retryWrites: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  maxIdleTimeMS: 30000,
  retryReads: true,
  // Additional SSL/TLS options for production compatibility
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
});

let isConnected = false;

export async function getDb() {
  try {
    if (!isConnected) {
      // Try different connection approaches for production
      if (process.env.NODE_ENV === 'production') {
        // For production, use the same URI as it already has all needed parameters
        const productionUri = mongoUri;
        const prodClient = new MongoClient(productionUri, {
          serverApi: ServerApiVersion.v1,
          retryWrites: true,
          maxPoolSize: 5,
          serverSelectionTimeoutMS: 15000,
          socketTimeoutMS: 60000,
          connectTimeoutMS: 15000,
          maxIdleTimeMS: 30000,
          retryReads: true,
          tls: true,
          tlsAllowInvalidCertificates: false,
          tlsAllowInvalidHostnames: false,
        });
        
        await prodClient.connect();
        isConnected = true;
        // Console log removed for production');
        return prodClient.db('reckonix');
      } else {
        await client.connect();
        isConnected = true;
        // Console log removed for production
      }
    }
    return client.db('reckonix'); // Use your MongoDB database name
  } catch (err) {
    // Console log removed for production
    isConnected = false;
    // Try to reconnect after a short delay
    setTimeout(async () => {
      try {
        await client.connect();
        isConnected = true;
        // Console log removed for production
      } catch (retryErr) {
        // Console log removed for production
      }
    }, 5000);
    throw err;
  }
}
