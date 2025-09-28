import { MongoClient } from 'mongodb';

const connectionString = 'mongodb+srv://vinay:vinay@cluster0.4adl4tl.mongodb.net/reckonix?retryWrites=true&w=majority&authSource=admin';

async function checkEventsDirect() {
  console.log('🔍 Checking Events Directly from Database...\n');
  
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
    
    // Get all events
    const events = await db.collection('CompanyEvent').find({}).toArray();
    console.log(`📅 Found ${events.length} events in database`);
    
    if (events.length === 0) {
      console.log('❌ No events found in database');
      return;
    }
    
    console.log('\n📋 EVENTS IN DATABASE:');
    events.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title}`);
      console.log(`   - _id: ${event._id}`);
      console.log(`   - id: ${event.id}`);
      console.log(`   - Date: ${event.eventDate}`);
      console.log(`   - Published: ${event.published}`);
      console.log(`   - Featured: ${event.featured}`);
      console.log(`   - Location: ${event.location || 'Not specified'}`);
      console.log('');
    });
    
    if (events.length >= 2) {
      console.log('✅ Main events are restored successfully!');
    } else {
      console.log('⚠️  Only partial events restored');
    }
    
    await client.close();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error checking events:', error.message);
  }
}

checkEventsDirect();



