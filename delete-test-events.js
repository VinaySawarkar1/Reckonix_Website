import { MongoClient } from 'mongodb';

const connectionString = 'mongodb+srv://vinay:vinay@cluster0.4adl4tl.mongodb.net/reckonix?retryWrites=true&w=majority&authSource=admin';

async function deleteTestEvents() {
  console.log('🗑️  Deleting Test Events from Database...\n');
  
  try {
    const client = new MongoClient(connectionString, {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    });
    
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('reckonix');
    
    // Get all events first
    const events = await db.collection('CompanyEvent').find({}).toArray();
    console.log(`📅 Found ${events.length} events`);
    
    if (events.length === 0) {
      console.log('✅ No events to delete');
      return;
    }
    
    // Show events
    events.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} (ID: ${event._id})`);
    });
    
    // Delete all events
    const result = await db.collection('CompanyEvent').deleteMany({});
    console.log(`\n🗑️  Deleted ${result.deletedCount} events`);
    
    // Verify deletion
    const remainingEvents = await db.collection('CompanyEvent').find({}).toArray();
    console.log(`📊 Remaining events: ${remainingEvents.length}`);
    
    if (remainingEvents.length === 0) {
      console.log('🎉 SUCCESS: All test events deleted!');
    } else {
      console.log('⚠️  Some events remain');
    }
    
    await client.close();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error deleting events:', error.message);
  }
}

deleteTestEvents();



