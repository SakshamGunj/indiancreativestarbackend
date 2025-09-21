import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Cashfree, CFEnvironment } from 'cashfree-pg';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Cashfree SDK
const cashfree = new Cashfree(
  CFEnvironment.PRODUCTION, // Always use production for live deployment
  process.env.CASHFREE_CLIENT_ID,
  process.env.CASHFREE_CLIENT_SECRET
);

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Cashfree Payment Server is running',
    environment: process.env.CASHFREE_ENVIRONMENT || 'production',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Create order endpoint
app.post('/create-order', async (req, res) => {
  try {
    const {
      order_amount,
      order_currency = 'INR',
      customer_details,
      order_meta = {},
      order_note = 'Indian Creative Star - Entry Fee'
    } = req.body;

    // Validate required fields
    if (!order_amount || !customer_details) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: order_amount and customer_details are required'
      });
    }

    // Prepare order data
    const orderData = {
      order_amount: order_amount.toString(),
      order_currency,
      customer_details: {
        customer_id: customer_details.customer_id || `customer_${Date.now()}`,
        customer_name: customer_details.customer_name || 'Test Customer',
        customer_email: customer_details.customer_email || 'test@example.com',
        customer_phone: customer_details.customer_phone || '9999999999'
      },
      order_meta: {
        return_url: order_meta.return_url || `${req.headers.origin || 'https://www.daamievent.com'}/indiancreativestar/dashboard?payment=success`,
        ...order_meta
      },
      order_note
    };

    console.log('Creating order with data:', orderData);

    // Create order with Cashfree SDK
    const result = await cashfree.PGCreateOrder(orderData);
    
    if (!result || !result.data) {
      console.error('Cashfree SDK Error:', result);
      return res.status(500).json({
        success: false,
        message: 'Failed to create order with Cashfree',
        error: result
      });
    }

    // Return successful response
    res.json({
      success: true,
      data: {
        order_id: result.data.order_id,
        payment_session_id: result.data.payment_session_id,
        order_status: result.data.order_status,
        order_amount: result.data.order_amount,
        order_currency: result.data.order_currency,
        customer_details: result.data.customer_details,
        order_meta: result.data.order_meta,
        created_at: result.data.created_at
      }
    });

  } catch (error) {
    console.error('Order creation error:', error);
    
    // Handle specific Cashfree errors
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed - Invalid Cashfree credentials',
        setup_required: true,
        error: 'Please check your CASHFREE_CLIENT_ID and CASHFREE_CLIENT_SECRET'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get order status endpoint
app.get('/order-status', async (req, res) => {
  try {
    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    // Fetch order status from Cashfree
    const result = await cashfree.PGFetchOrder(orderId);
    
    if (!result || !result.data) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: {
        order_id: result.data.order_id,
        order_status: result.data.order_status,
        order_amount: result.data.order_amount,
        order_currency: result.data.order_currency,
        customer_details: result.data.customer_details,
        payment_status: result.data.payment_status,
        payment_method: result.data.payment_method,
        payment_amount: result.data.payment_amount,
        payment_currency: result.data.payment_currency,
        payment_time: result.data.payment_time,
        created_at: result.data.created_at
      }
    });

  } catch (error) {
    console.error('Order status error:', error);
    
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed - Invalid Cashfree credentials'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    available_endpoints: [
      'GET /health',
      'POST /create-order',
      'GET /order-status?orderId=<order_id>'
    ]
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Cashfree Payment Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.CASHFREE_ENVIRONMENT || 'production'}`);
  console.log(`🔑 Client ID: ${process.env.CASHFREE_CLIENT_ID ? 'Set' : 'Not set'}`);
  console.log(`🔐 Client Secret: ${process.env.CASHFREE_CLIENT_SECRET ? 'Set' : 'Not set'}`);
  console.log('Available endpoints:');
  console.log('  GET  /health');
  console.log('  POST /create-order');
  console.log('  GET  /order-status?orderId=<order_id>');
});

export default app;
