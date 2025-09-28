import { MongoClient } from 'mongodb';

const connectionString = 'mongodb+srv://vinay:vinay@cluster0.4adl4tl.mongodb.net/reckonix?retryWrites=true&w=majority&authSource=admin';

async function deleteTestCustomer() {
  console.log('🗑️  Deleting "Test Customer Company"...\n');
  
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
    
    // Find the specific customer
    const customer = await db.collection('Customer').findOne({ 
      name: "Test Customer Company" 
    });
    
    if (customer) {
      console.log(`📋 Found customer: ${customer.name}`);
      console.log(`   - ID: ${customer._id}`);
      console.log(`   - Category: ${customer.category}`);
      console.log(`   - Industry: ${customer.industryId}`);
      
      // Delete the customer
      const result = await db.collection('Customer').deleteOne({ 
        _id: customer._id 
      });
      
      if (result.deletedCount === 1) {
        console.log('✅ Successfully deleted "Test Customer Company"');
      } else {
        console.log('❌ Failed to delete customer');
      }
    } else {
      console.log('❌ Customer "Test Customer Company" not found');
    }
    
    // Verify deletion
    const remainingCustomers = await db.collection('Customer').find({}).toArray();
    console.log(`\n📊 Remaining customers: ${remainingCustomers.length}`);
    
    if (remainingCustomers.length > 0) {
      console.log('📋 Remaining customers:');
      remainingCustomers.forEach((cust, index) => {
        console.log(`${index + 1}. ${cust.name} (${cust.category})`);
      });
    }
    
    await client.close();
    console.log('\n✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error deleting customer:', error.message);
  }
}

deleteTestCustomer();



