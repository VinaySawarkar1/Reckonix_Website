import http from 'http';

async function verifyEventsRestored() {
  console.log('🔍 Verifying Events Restoration...\n');
  
  try {
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Get all events
    const result = await fetch('http://localhost:5001/api/events');
    const events = await result.json();
    
    console.log(`📅 Found ${events.length} events`);
    
    if (events.length === 0) {
      console.log('❌ No events found - restoration failed');
      return;
    }
    
    console.log('\n📋 RESTORED EVENTS:');
    events.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title}`);
      console.log(`   - ID: ${event._id}`);
      console.log(`   - Date: ${event.eventDate}`);
      console.log(`   - Published: ${event.published}`);
      console.log(`   - Featured: ${event.featured}`);
      console.log(`   - Location: ${event.location}`);
      console.log('');
    });
    
    // Test event deletion with a test event
    console.log('🧪 Testing event deletion...');
    
    // Create a test event first
    const testEvent = {
      title: "Test Event for Deletion",
      description: "This is a test event to verify deletion works",
      eventDate: "2025-12-31",
      published: false,
      featured: false,
      content: "Test content",
      location: "Test Location",
      duration: "1 hour",
      attendees: "10",
      registrationUrl: "https://test.com",
      tags: "test"
    };
    
    const createResult = await fetch('http://localhost:5001/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testEvent)
    });
    
    if (createResult.ok) {
      const createdEvent = await createResult.json();
      console.log(`✅ Test event created: ${createdEvent.title}`);
      
      // Now test deletion
      const deleteResult = await fetch(`http://localhost:5001/api/events/${createdEvent._id}`, {
        method: 'DELETE'
      });
      
      if (deleteResult.ok) {
        console.log('✅ Event deletion test successful!');
      } else {
        const error = await deleteResult.json();
        console.log('❌ Event deletion test failed:', error.message);
      }
    } else {
      console.log('❌ Failed to create test event');
    }
    
    // Final verification
    const finalResult = await fetch('http://localhost:5001/api/events');
    const finalEvents = await finalResult.json();
    
    console.log(`\n📊 Final event count: ${finalEvents.length}`);
    
    if (finalEvents.length === 2) {
      console.log('🎉 SUCCESS: Main events restored and deletion working!');
    } else {
      console.log('⚠️  Event count unexpected');
    }
    
  } catch (error) {
    console.error('❌ Error verifying events:', error.message);
  }
}

verifyEventsRestored();
