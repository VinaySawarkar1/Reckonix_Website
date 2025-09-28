console.log('Testing customer deletion...');

fetch('http://localhost:5001/api/customers')
  .then(res => res.json())
  .then(customers => {
    console.log('Customers found:', customers.length);
    const testCustomer = customers.find(c => c.name === "Test Customer Company");
    if (testCustomer) {
      console.log('Found test customer:', testCustomer.name);
      return fetch(`http://localhost:5001/api/customers/${testCustomer._id}`, {
        method: 'DELETE'
      });
    } else {
      console.log('Test customer not found');
    }
  })
  .then(res => {
    if (res) {
      console.log('Delete response:', res.status);
      return res.json();
    }
  })
  .then(data => {
    if (data) {
      console.log('Delete result:', data);
    }
  })
  .catch(err => console.error('Error:', err));



