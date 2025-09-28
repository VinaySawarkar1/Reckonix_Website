console.log('Starting event check...');

import { MongoClient } from 'mongodb';

const connectionString = 'mongodb+srv://vinay:vinay@cluster0.4adl4tl.mongodb.net/reckonix?retryWrites=true&w=majority&authSource=admin';

async function checkEvents() {
  try {
    console.log('Connecting to MongoDB...');
    const client = new MongoClient(connectionString);
    await client.connect();
    console.log('Connected successfully');
    
    const db = client.db('reckonix');
    const events = await db.collection('CompanyEvent').find({}).toArray();
    
    console.log(`Found ${events.length} events:`);
    events.forEach((event, i) => {
      console.log(`${i+1}. ${event.title}`);
    });
    
    await client.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkEvents();



