const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URL || 'mongodb+srv://vinaysawarkar0:vgP9DZNlkiJWNNMH@cluster0.4adl4tl.mongodb.net/';

async function testConnection() {
  const client = new MongoClient(uri, {
    serverApi: { version: '1', strict: true, deprecationErrors: true }
  });
  try {
    await client.connect();
    console.log('MongoDB connection successful');
    await client.close();
    process.exit(0);
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  }
}

testConnection();
