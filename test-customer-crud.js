import http from 'http';

async function testCustomerCRUD() {
  console.log('🔍 Testing Customer CRUD Endpoints...\n');
  
  try {
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Test 1: GET customers (should work)
    console.log('1️⃣ Testing GET /api/customers...');
    const getResult = await fetch('http://localhost:5001/api/customers');
    const customers = await getResult.json();
    console.log(`✅ GET customers: Found ${customers.length} customers`);
    
    // Test 2: POST customer (create)
    console.log('\n2️⃣ Testing POST /api/customers...');
    const newCustomer = {
      name: "Test Customer Company",
      logoUrl: "https://example.com/logo.png",
      category: "Manufacturing",
      industryId: 1,
      featured: true,
      description: "Test customer for CRUD testing",
      website: "https://testcustomer.com",
      location: "Test City, Test State"
    };
    
    const createResult = await fetch('http://localhost:5001/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCustomer)
    });
    
    if (createResult.ok) {
      const createdCustomer = await createResult.json();
      console.log('✅ POST customer: Created successfully');
      console.log(`   Customer ID: ${createdCustomer.id}`);
      
      // Test 3: PUT customer (update)
      console.log('\n3️⃣ Testing PUT /api/customers/:id...');
      const updatedCustomer = {
        ...newCustomer,
        name: "Updated Test Customer Company",
        description: "Updated description for testing"
      };
      
      const updateResult = await fetch(`http://localhost:5001/api/customers/${createdCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCustomer)
      });
      
      if (updateResult.ok) {
        console.log('✅ PUT customer: Updated successfully');
      } else {
        const updateError = await updateResult.json();
        console.log('❌ PUT customer failed:', updateError.message);
      }
      
      // Test 4: DELETE customer
      console.log('\n4️⃣ Testing DELETE /api/customers/:id...');
      const deleteResult = await fetch(`http://localhost:5001/api/customers/${createdCustomer.id}`, {
        method: 'DELETE'
      });
      
      if (deleteResult.ok) {
        console.log('✅ DELETE customer: Deleted successfully');
      } else {
        const deleteError = await deleteResult.json();
        console.log('❌ DELETE customer failed:', deleteError.message);
      }
      
    } else {
      const createError = await createResult.json();
      console.log('❌ POST customer failed:', createError.message);
    }
    
    // Test 5: Verify final state
    console.log('\n5️⃣ Verifying final state...');
    const finalResult = await fetch('http://localhost:5001/api/customers');
    const finalCustomers = await finalResult.json();
    console.log(`✅ Final customer count: ${finalCustomers.length} (should be same as initial)`);
    
    console.log('\n🎉 Customer CRUD Test Complete!');
    
  } catch (error) {
    console.error('❌ Error testing customer CRUD:', error.message);
  }
}

testCustomerCRUD();



