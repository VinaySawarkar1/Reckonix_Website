import { MongoClient, ObjectId } from 'mongodb';

const connectionString = 'mongodb+srv://vinay:vinay@cluster0.4adl4tl.mongodb.net/reckonix?retryWrites=true&w=majority&authSource=admin';

async function restoreMainEvents() {
  console.log('🔄 Restoring Main Events...\n');
  
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
    
    // Main events to restore
    const mainEvents = [
      {
        _id: new ObjectId(),
        id: 1,
        title: "Mtech Expo 2025 - Showcasing Innovation in Pune",
        description: "Join us at Mtech Expo 2025 where we'll be showcasing our latest precision measurement and calibration solutions. Discover cutting-edge technology in manufacturing and quality control.",
        eventDate: "2025-03-15",
        published: true,
        featured: true,
        imageUrl: "/uploads/events/mtech-expo-2025.jpg",
        content: "Mtech Expo 2025 is one of India's premier manufacturing technology exhibitions. Reckonix will be presenting our latest innovations in precision measurement, calibration systems, and quality control solutions. Visit our booth to see live demonstrations of our VMM series, MEATEST calibrators, and other advanced equipment.",
        location: "Pune International Exhibition Centre, Pune, Maharashtra",
        duration: "3 days",
        attendees: "5000+ industry professionals",
        registrationUrl: "https://mtech-expo.com/register",
        tags: "manufacturing, precision, calibration, measurement, innovation",
        slug: "mtech-expo-2025-pune",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        id: 2,
        title: "Explore Reckonix at Mtech Expo 2025 - Advancing Manufacturing",
        description: "Experience the future of manufacturing with Reckonix's advanced measurement and calibration solutions. Learn about our comprehensive range of precision instruments.",
        eventDate: "2025-03-16",
        published: true,
        featured: true,
        imageUrl: "/uploads/events/reckonix-mtech-2025.jpg",
        content: "At Mtech Expo 2025, Reckonix will demonstrate how our precision measurement solutions are advancing manufacturing capabilities across various industries. Our experts will be available to discuss your specific measurement challenges and recommend the best solutions for your needs.",
        location: "Pune International Exhibition Centre, Pune, Maharashtra",
        duration: "3 days",
        attendees: "5000+ industry professionals",
        registrationUrl: "https://mtech-expo.com/register",
        tags: "manufacturing, precision, calibration, measurement, innovation, reckonix",
        slug: "explore-reckonix-mtech-expo-2025",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    console.log('📅 Restoring main events...');
    
    // Insert the main events
    const result = await db.collection('CompanyEvent').insertMany(mainEvents);
    console.log(`✅ Inserted ${result.insertedCount} main events`);
    
    // Verify the events were added
    const allEvents = await db.collection('CompanyEvent').find({}).toArray();
    console.log(`📊 Total events in database: ${allEvents.length}`);
    
    // Show the restored events
    allEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title}`);
      console.log(`   - ID: ${event._id}`);
      console.log(`   - Date: ${event.eventDate}`);
      console.log(`   - Published: ${event.published}`);
      console.log(`   - Featured: ${event.featured}`);
      console.log('');
    });
    
    console.log('🎉 Main events successfully restored!');
    
    await client.close();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error restoring events:', error.message);
  }
}

restoreMainEvents();



