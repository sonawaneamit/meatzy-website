# Shopify Webhook Setup Guide - Meatzy Referral System

## Why This Is Critical

The Shopify webhook is **the heart of your referral system**. It automatically:
- Creates new users when they make their first purchase
- Links customers to their referrers
- Calculates commissions across all 4 tiers
- Updates wallet balances in real-time
- Tracks subscriptions

**Without this webhook, your referral system won't work!**

---

## Prerequisites

Before setting up the webhook, you need:
- [x] Deployed your site (Vercel, Netlify, or other hosting)
- [x] Production URL (e.g., `https://meatzy.com` or `https://meatzy.vercel.app`)
- [ ] Shopify Admin access

---

## Setup Instructions

### Step 1: Get Your Webhook URL

Your webhook URL will be:
```
https://YOUR-DOMAIN.com/api/webhooks/shopify/order
```

**Examples**:
- `https://meatzy.vercel.app/api/webhooks/shopify/order`
- `https://www.meatzy.com/api/webhooks/shopify/order`

⚠️ **Important**: You must deploy to production first. Shopify webhooks can't reach `localhost`.

---

### Step 2: Access Shopify Webhooks Settings

1. Log in to your Shopify Admin panel
2. Go to **Settings** (bottom left corner)
3. Click **Notifications**
4. Scroll down to **Webhooks** section
5. Click **Create webhook** button

---

### Step 3: Configure the Webhook

Fill in the webhook form:

**Event**: Select **"Order creation"** from dropdown
- This fires when a customer completes checkout

**Format**: Select **"JSON"**
- Our API expects JSON format

**URL**: Enter your webhook URL
```
https://YOUR-DOMAIN.com/api/webhooks/shopify/order
```

**Webhook API version**: Select the **latest version** (e.g., `2024-10` or newer)
- This ensures you get the most up-to-date order data

**Click "Save webhook"**

---

### Step 4: Test the Webhook

#### Option A: Using Shopify's Test Feature (Recommended)

1. After creating the webhook, you'll see it in the list
2. Click on the webhook you just created
3. Look for **"Send test notification"** button
4. Click it to send a test order to your endpoint
5. Check the response:
   - ✅ **Success (200)** - Webhook is working!
   - ❌ **Error (4xx/5xx)** - Check your deployment and logs

#### Option B: Create a Real Test Order

1. Go to your Shopify storefront
2. Add a product to cart
3. Use Shopify's test payment gateway:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVV: Any 3 digits
4. Complete the order
5. Check your Supabase database for new commission records

---

## How to Pass Referral Code to Shopify

For the webhook to work properly, the referral code must reach Shopify. Here are the methods:

### Method 1: Custom Checkout Fields (Shopify Plus Required)

Add a custom field in checkout for referral code.

### Method 2: Cart Attributes (Recommended - Works on All Plans)

When a user clicks "Buy Now" or "Add to Cart", include the referral code:

```javascript
// In your Shopify integration code
const referralCode = localStorage.getItem('meatzy_referral_code');

// Add to cart with attributes
fetch('/cart/add.js', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: [{
      id: productVariantId,
      quantity: 1,
      properties: {
        'Referral Code': referralCode || 'NONE'
      }
    }]
  })
});
```

### Method 3: Order Notes (Fallback)

If cart attributes don't work, use order notes:

```javascript
// During checkout
const referralCode = localStorage.getItem('meatzy_referral_code');
if (referralCode) {
  // Add to checkout note
  Shopify.Checkout.OrderNotes = `Referral: ${referralCode}`;
}
```

### Method 4: URL Tracking (Best for Your Current Setup)

Since you're using headless Shopify, track the referral in your database **before** checkout:

1. User visits: `https://meatzy.com?ref=ABC123`
2. ReferralTracker saves `ABC123` to localStorage
3. User adds to cart
4. **Before redirecting to Shopify checkout**, create a pending user record:

```javascript
// In your checkout handler
const referralCode = localStorage.getItem('meatzy_referral_code');
const customerEmail = // from form or Shopify customer

if (referralCode && customerEmail) {
  await fetch('/api/track-referral', {
    method: 'POST',
    body: JSON.stringify({
      email: customerEmail,
      referralCode: referralCode
    })
  });
}
```

Then your webhook can find the user by email and link them properly.

---

## Testing the Complete Flow

### End-to-End Test:

1. **Get a referral code**:
   - Go to `/signup`
   - Create an account (User A)
   - Copy referral code from dashboard

2. **Share the referral link**:
   - Use incognito window or different browser
   - Visit: `https://your-site.com?ref=USER_A_CODE`
   - Check browser console: "Referral code captured: USER_A_CODE"

3. **Make a purchase**:
   - Add product to cart
   - Complete checkout with test payment
   - Use email: `testbuyer@example.com`

4. **Verify webhook fired**:
   - Check Shopify Admin → Settings → Notifications → Webhooks
   - Click on your webhook
   - Look at "Recent deliveries" - should show 200 OK

5. **Check results**:
   - Go to Supabase Dashboard
   - Run this query:
   ```sql
   SELECT * FROM users WHERE email = 'testbuyer@example.com';
   -- Should see the new user with referrer_id pointing to User A

   SELECT * FROM commissions WHERE referred_user_id = (
     SELECT id FROM users WHERE email = 'testbuyer@example.com'
   );
   -- Should see commission record for User A

   SELECT * FROM wallet WHERE user_id = (
     SELECT id FROM users WHERE email = 'USER_A_EMAIL'
   );
   -- Should see pending_balance increased
   ```

6. **Check User A's dashboard**:
   - Log in as User A
   - Should see:
     - New referral in "Your Referrals"
     - New commission in "Recent Commissions"
     - Increased pending balance

---

## Webhook Payload Example

Here's what Shopify sends to your webhook:

```json
{
  "id": 5678901234,
  "order_number": 1001,
  "total_price": "189.00",
  "customer": {
    "id": 987654321,
    "email": "customer@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890"
  },
  "line_items": [
    {
      "id": 12345,
      "product_id": 67890,
      "title": "Custom Meat Box",
      "quantity": 1,
      "price": "189.00",
      "properties": [
        {
          "name": "Referral Code",
          "value": "ABC123"
        }
      ]
    }
  ],
  "note_attributes": [
    {
      "name": "referral_code",
      "value": "ABC123"
    }
  ]
}
```

Your webhook handler extracts:
- Customer email
- Order total
- Referral code (from properties or note_attributes)

---

## Troubleshooting

### Issue: Webhook shows 404 Not Found

**Solution**:
- Verify your URL is correct
- Make sure you deployed to production
- Check the exact path: `/api/webhooks/shopify/order`

### Issue: Webhook shows 500 Internal Server Error

**Solution**:
- Check Vercel logs for errors
- Verify environment variables are set in Vercel
- Test locally with curl first (see below)

### Issue: Commission not created

**Solution**:
1. Check Shopify webhook delivery logs for errors
2. Verify referral code was passed in the order
3. Check Supabase logs for database errors
4. Ensure the referrer user exists in database

### Issue: Wallet balance not updating

**Solution**:
- Verify `supabase-wallet-functions.sql` was executed
- Run `node test-wallet-update.js` to test
- Check for RLS policy errors in Supabase logs

---

## Local Testing (Before Production)

You can test the webhook locally using ngrok or curl:

### Using curl (Test the endpoint directly):

```bash
curl -X POST http://localhost:3000/api/webhooks/shopify/order \
  -H "Content-Type: application/json" \
  -d '{
    "id": 123456789,
    "order_number": 1001,
    "total_price": "189.00",
    "customer": {
      "id": "987654321",
      "email": "testcustomer@example.com",
      "first_name": "Test",
      "last_name": "Customer",
      "phone": "+1234567890"
    },
    "note_attributes": [
      {
        "name": "referral_code",
        "value": "YOUR_TEST_CODE"
      }
    ]
  }'
```

Replace `YOUR_TEST_CODE` with an actual referral code from your database.

### Using ngrok (Test with real Shopify webhook):

```bash
# Install ngrok
npm install -g ngrok

# Start your Next.js dev server
npm run dev

# In another terminal, start ngrok
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Use in Shopify: https://abc123.ngrok.io/api/webhooks/shopify/order
```

---

## Security: HMAC Verification (Recommended)

For production, you should verify that webhooks are actually from Shopify:

### Step 1: Get Your Webhook Secret

After creating the webhook in Shopify, you'll see a **"Signing secret"** at the bottom of the webhook details page.

Copy this secret.

### Step 2: Add to Environment Variables

In Vercel (or your hosting):
```env
SHOPIFY_WEBHOOK_SECRET=your_signing_secret_here
```

### Step 3: Enable Verification in Code

Edit `/app/api/webhooks/shopify/order/route.ts`:

Uncomment the verification function and update it:

```typescript
import crypto from 'crypto';

function verifyShopifyWebhook(request: NextRequest, body: string): boolean {
  const hmac = request.headers.get('x-shopify-hmac-sha256');
  const shopifySecret = process.env.SHOPIFY_WEBHOOK_SECRET;

  if (!hmac || !shopifySecret) {
    return false;
  }

  const hash = crypto
    .createHmac('sha256', shopifySecret)
    .update(body, 'utf8')
    .digest('base64');

  return hash === hmac;
}
```

Then in your POST handler:

```typescript
export async function POST(request: NextRequest) {
  const bodyText = await request.text();

  // Verify signature
  if (!verifyShopifyWebhook(request, bodyText)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const body = JSON.parse(bodyText);
  // ... rest of your code
}
```

---

## Monitoring & Maintenance

### Check Webhook Health

Regularly monitor:
1. **Shopify Admin** → Settings → Notifications → Webhooks
   - Click on your webhook
   - View "Recent deliveries"
   - Should see all successful (200 OK)

2. **Vercel Logs** (or your hosting logs)
   - Check for any errors in webhook processing
   - Set up alerts for 5xx errors

3. **Supabase Dashboard**
   - Monitor the `commissions` table growth
   - Check for any failed transactions

### Set Up Alerts

Consider setting up:
- Email alerts for webhook failures (via Shopify)
- Error tracking (Sentry, LogRocket, etc.)
- Daily summary of commissions created

---

## Quick Reference

### Webhook Configuration Summary

| Setting | Value |
|---------|-------|
| Event | Order creation |
| Format | JSON |
| URL | `https://YOUR-DOMAIN.com/api/webhooks/shopify/order` |
| API Version | Latest (2024-10 or newer) |

### What Happens When Webhook Fires

1. Order completed in Shopify ✅
2. Shopify sends webhook to your URL ✅
3. Your API receives order data ✅
4. Extract customer email & referral code ✅
5. Find/create user in system ✅
6. Look up referral tree (4 levels) ✅
7. Calculate commissions (13%/2%/1%/1%) ✅
8. Create commission records ✅
9. Update wallet balances ✅
10. Return success to Shopify ✅

### Testing Checklist

- [ ] Webhook created in Shopify
- [ ] URL is correct and accessible
- [ ] Test notification sent (200 OK)
- [ ] Real test order completed
- [ ] User created in database
- [ ] Commission record created
- [ ] Wallet balance updated
- [ ] Dashboard shows new data

---

## Need Help?

If you encounter issues:
1. Check Shopify webhook delivery logs
2. Check Vercel/hosting logs
3. Check Supabase logs
4. Run the test scripts: `node test-referral-system.js`
5. Test webhook endpoint with curl command above

---

**Once this webhook is set up, your referral system is fully automated!** 🎉
