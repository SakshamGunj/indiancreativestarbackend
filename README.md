# Cashfree Payment Server

A dedicated Node.js server for handling Cashfree payment operations for Indian Creative Star competition.

## 🚀 Quick Deploy to Vercel

### Step 1: Deploy to Vercel
1. Push this folder to a new GitHub repository
2. Import the repository in Vercel
3. Deploy as a Node.js project

### Step 2: Set Environment Variables in Vercel
Add these environment variables in Vercel Dashboard:

```
CASHFREE_CLIENT_ID=50613090c329a15663b2765f45031605
CASHFREE_CLIENT_SECRET=cfsk_ma_prod_6165faf46209e032eab4c853d3226b66_b90a4aa0
CASHFREE_ENVIRONMENT=production
```

### Step 3: Test the API
After deployment, test these endpoints:

- **Health Check**: `GET https://your-domain.vercel.app/health`
- **Create Order**: `POST https://your-domain.vercel.app/create-order`
- **Order Status**: `GET https://your-domain.vercel.app/order-status?orderId=<order_id>`

## 📋 API Endpoints

### Health Check
```
GET /health
```
Returns server status and configuration.

### Create Order
```
POST /create-order
Content-Type: application/json

{
  "order_amount": "1",
  "order_currency": "INR",
  "customer_details": {
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "9999999999"
  },
  "order_meta": {
    "return_url": "https://www.daamievent.com/indiancreativestar/dashboard?payment=success"
  },
  "order_note": "Indian Creative Star - Entry Fee"
}
```

### Get Order Status
```
GET /order-status?orderId=<order_id>
```

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your credentials

# Run development server
npm run dev
```

## 📦 Dependencies

- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **cashfree-pg**: Cashfree payment gateway SDK
- **dotenv**: Environment variable management

## 🛡️ Security

- Environment variables are used for sensitive data
- CORS is properly configured
- Input validation on all endpoints
- Error handling for all operations

## 📞 Support

For issues or questions, contact the development team.
