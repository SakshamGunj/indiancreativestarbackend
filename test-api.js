// Simple test script to verify API endpoints
import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3000'; // Change to your Vercel URL after deployment

async function testAPI() {
  console.log('🧪 Testing Cashfree Payment Server API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData);
    console.log('');

    // Test 2: Create Order
    console.log('2. Testing Create Order...');
    const createOrderResponse = await fetch(`${API_BASE_URL}/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_amount: '1',
        order_currency: 'INR',
        customer_details: {
          customer_name: 'Test Customer',
          customer_email: 'test@example.com',
          customer_phone: '9999999999'
        },
        order_meta: {
          return_url: 'https://www.daamievent.com/indiancreativestar/dashboard?payment=success'
        },
        order_note: 'Test Order'
      })
    });
    
    const createOrderData = await createOrderResponse.json();
    console.log('✅ Create Order:', createOrderData);
    console.log('');

    // Test 3: Order Status (if order was created successfully)
    if (createOrderData.success && createOrderData.data?.order_id) {
      console.log('3. Testing Order Status...');
      const orderStatusResponse = await fetch(`${API_BASE_URL}/order-status?orderId=${createOrderData.data.order_id}`);
      const orderStatusData = await orderStatusResponse.json();
      console.log('✅ Order Status:', orderStatusData);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testAPI();
