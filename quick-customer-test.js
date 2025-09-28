import http from 'http';

async function quickCustomerTest() {
  console.log('🚀 Quick Customer CRUD Test...\n');
  
  try {
    // Test POST (Create)
    console.log('1️⃣ Creating customer...');
    const newCustomer = {
      name: "Quick Test Customer",
      logoUrl: "https://test.com/logo.png",
      category: "Technology",
      industryId: 2,
      featured: false,
      description: "Quick test customer",
      website: "https://testcustomer.com",
      location: "Test City"
    };
    
    const createResult = await fetch('http://localhost:5001/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCustomer)
    });
    
    if (createResult.ok) {
      const created = await createResult.json();
      console.log('✅ Customer created:', created.id);
      
      // Test PUT (Update)
      console.log('\n2️⃣ Updating customer...');
      const updateResult = await fetch(`http://localhost:5001/api/customers/${created.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newCustomer, name: "Updated Test Customer" })
      });
      
      if (updateResult.ok) {
        console.log('✅ Customer updated');
        
        // Test DELETE
        console.log('\n3️⃣ Deleting customer...');
        const deleteResult = await fetch(`http://localhost:5001/api/customers/${created.id}`, {
          method: 'DELETE'
        });
        
        if (deleteResult.ok) {
          console.log('✅ Customer deleted');
          console.log('\n🎉 All Customer CRUD operations working!');
        } else {
          console.log('❌ Delete failed');
        }
      } else {
        console.log('❌ Update failed');
      }
    } else {
      console.log('❌ Create failed');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

quickCustomerTest();



