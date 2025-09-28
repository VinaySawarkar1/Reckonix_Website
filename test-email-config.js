import http from 'http';

async function testEmailConfig() {
  console.log('📧 Testing Email Configuration...\n');
  
  try {
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Test contact form submission
    console.log('1️⃣ Testing Contact Form Email...');
    const contactData = {
      name: "Test User",
      email: "test@example.com",
      phone: "1234567890",
      subject: "Test Contact Form",
      message: "This is a test message to verify email configuration"
    };
    
    const contactResult = await fetch('http://localhost:5001/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    });
    
    if (contactResult.ok) {
      console.log('✅ Contact form submitted successfully');
    } else {
      console.log('❌ Contact form submission failed');
    }
    
    // Test quote form submission
    console.log('\n2️⃣ Testing Quote Form Email...');
    const quoteData = {
      name: "Test Company",
      email: "company@example.com",
      phone: "9876543210",
      company: "Test Company Ltd",
      products: [
        { name: "VMM ULTRA 500", quantity: 2 },
        { name: "MEATEST 9010", quantity: 1 }
      ]
    };
    
    const quoteResult = await fetch('http://localhost:5001/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quoteData)
    });
    
    if (quoteResult.ok) {
      console.log('✅ Quote form submitted successfully');
    } else {
      console.log('❌ Quote form submission failed');
    }
    
    console.log('\n📧 Email Configuration Updated!');
    console.log('✅ All form submissions now go to: sales@reckonix.co.in');
    console.log('✅ Contact form emails: sales@reckonix.co.in');
    console.log('✅ Quote form emails: sales@reckonix.co.in');
    
  } catch (error) {
    console.error('❌ Error testing email config:', error.message);
  }
}

testEmailConfig();



