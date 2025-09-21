# 🚀 Cashfree Payment Server - Deployment Guide

## 📋 Step-by-Step Deployment to Vercel

### Step 1: Prepare the Repository
1. **Create a new GitHub repository** for this payment server
2. **Copy all files** from `cashfree-payment-server/` folder to the new repository
3. **Commit and push** to GitHub

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. **Import** your GitHub repository
4. **Configure**:
   - Framework Preset: **Other**
   - Build Command: `npm run build`
   - Output Directory: Leave empty
   - Install Command: `npm install`
5. Click **"Deploy"**

### Step 3: Set Environment Variables
After deployment, go to **Project Settings** → **Environment Variables** and add:

```
CASHFREE_CLIENT_ID = 50613090c329a15663b2765f45031605
CASHFREE_CLIENT_SECRET = cfsk_ma_prod_6165faf46209e032eab4c853d3226b66_b90a4aa0
CASHFREE_ENVIRONMENT = production
```

### Step 4: Redeploy
After adding environment variables, **redeploy** the project.

### Step 5: Test the API
Your API will be available at: `https://your-project-name.vercel.app`

Test endpoints:
- **Health**: `GET https://your-project-name.vercel.app/health`
- **Create Order**: `POST https://your-project-name.vercel.app/create-order`
- **Order Status**: `GET https://your-project-name.vercel.app/order-status?orderId=<order_id>`

## 🔗 Integration with Frontend

After deployment, you'll get an API URL like:
```
https://cashfree-payment-server.vercel.app
```

Update the frontend to use this URL instead of `/api/cashfree/`.

## ✅ Success Indicators

- ✅ Health endpoint returns 200 OK
- ✅ Create order endpoint works with test data
- ✅ Order status endpoint returns order details
- ✅ No CORS errors in browser console
- ✅ Environment variables are properly set

## 🆘 Troubleshooting

### Common Issues:
1. **404 on all endpoints**: Check Vercel routing configuration
2. **401 Authentication Error**: Verify environment variables
3. **CORS errors**: Check CORS configuration in server.js
4. **Build failures**: Check Node.js version compatibility

### Support:
Contact the development team if you encounter any issues.
