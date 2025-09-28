import http from 'http';

async function testEventDeletion() {
  console.log('🔍 Testing Event Deletion Fix...\n');
  
  try {
    // First, get all events to see what we have
    const eventsResult = await fetch('http://localhost:5001/api/events');
    const events = await eventsResult.json();
    
    console.log(`📅 Found ${events.length} events`);
    
    if (events.length === 0) {
      console.log('✅ No events to delete - all clean!');
      return;
    }
    
    // Show first few events with their IDs
    console.log('\n📋 EVENTS IN DATABASE:');
    events.slice(0, 5).forEach((event, index) => {
      console.log(`${index + 1}. ${event.title}`);
      console.log(`   - _id: ${event._id}`);
      console.log(`   - id: ${event.id}`);
      console.log(`   - Published: ${event.published}`);
      console.log('');
    });
    
    // Test deletion with the first event
    const testEvent = events[0];
    const eventId = testEvent._id || testEvent.id;
    
    console.log(`🗑️  Testing deletion of: ${testEvent.title}`);
    console.log(`   Using ID: ${eventId}`);
    
    const deleteResult = await fetch(`http://localhost:5001/api/events/${eventId}`, {
      method: 'DELETE'
    });
    
    if (deleteResult.ok) {
      const deleteResponse = await deleteResult.json();
      console.log('✅ Event deletion successful:', deleteResponse.message);
      
      // Verify it's actually deleted
      const verifyResult = await fetch('http://localhost:5001/api/events');
      const remainingEvents = await verifyResult.json();
      console.log(`📊 Remaining events: ${remainingEvents.length} (was ${events.length})`);
      
      if (remainingEvents.length < events.length) {
        console.log('🎉 SUCCESS: Event deletion is working!');
      } else {
        console.log('⚠️  WARNING: Event count unchanged - deletion may not have worked');
      }
    } else {
      const errorResponse = await deleteResult.json();
      console.log('❌ Event deletion failed:', errorResponse.message);
    }
    
  } catch (error) {
    console.error('❌ Error testing event deletion:', error.message);
  }
}

testEventDeletion();



