console.log('🗑️  Deleting Test Customer via API...\n');

async function deleteTestCustomer() {
  try {
    // First, get all customers to find the test customer
    console.log('1️⃣ Fetching customers...');
    const getResult = await fetch('http://localhost:5001/api/customers');
    const customers = await getResult.json();
    
    console.log(`Found ${customers.length} customers`);
    
    // Find the test customer
    const testCustomer = customers.find(c => c.name === "Test Customer Company");
    
    if (testCustomer) {
      console.log(`2️⃣ Found test customer: ${testCustomer.name}`);
      console.log(`   ID: ${testCustomer._id}`);
      
      // Delete the customer
      console.log('3️⃣ Deleting customer...');
      const deleteResult = await fetch(`http://localhost:5001/api/customers/${testCustomer._id}`, {
        method: 'DELETE'
      });
      
      if (deleteResult.ok) {
        const response = await deleteResult.json();
        console.log('✅ Customer deleted successfully:', response.message);
      } else {
        const error = await deleteResult.json();
        console.log('❌ Delete failed:', error.message);
      }
    } else {
      console.log('❌ Test customer not found');
    }
    
    // Verify deletion
    console.log('\n4️⃣ Verifying deletion...');
    const verifyResult = await fetch('http://localhost:5001/api/customers');
    const remainingCustomers = await verifyResult.json();
    console.log(`Remaining customers: ${remainingCustomers.length}`);
    
    if (remainingCustomers.length > 0) {
      console.log('Remaining customers:');
      remainingCustomers.forEach((cust, index) => {
        console.log(`${index + 1}. ${cust.name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

deleteTestCustomer();



