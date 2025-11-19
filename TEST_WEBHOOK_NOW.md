# Test Your Shopify Webhook RIGHT NOW ✅

You've successfully created the webhook! Now let's test it in 3 easy steps.

---

## Step 1: Send Test Notification from Shopify

1. **In your Shopify Admin**, click on the webhook you just created:
   - It should say "Order creation"
   - URL: `https://meatzy-website.vercel.app/api/webhooks/shopify/order`

2. **Look for one of these buttons**:
   - "Send test notification"
   - "Test webhook"
   - "Send sample data"

3. **Click the button** to send a test order

4. **Check the response**:
   - ✅ **200 OK** = Working perfectly!
   - ❌ **404 Not Found** = URL might be wrong
   - ❌ **500 Internal Server Error** = Server issue (check Vercel logs)

---

## Step 2: Check What Happened in Your Database

Run this command in your terminal:

```bash
cd "/Users/amitsonawane/Desktop/Meatzy Website/meatzy-final"
node check-webhook-results.js
```

**What to expect**:
- If webhook worked: You'll see a new user and possibly commissions created
- If nothing happened: The webhook might not have reached your server

---

## Step 3: Check Webhook Delivery Logs in Shopify

1. **Click on your webhook** in Shopify Admin
2. **Scroll down to "Recent deliveries"**
3. You'll see a table with:
   - Date/Time
   - **Status code** (this is what we care about!)
   - Response time
   - Delivery attempt

**Status codes explained**:
- ✅ **200** = Perfect! Webhook delivered successfully
- ⚠️ **201** = Also good
- ❌ **404** = Your URL is incorrect or endpoint doesn't exist
- ❌ **500** = Your server had an error processing the webhook
- ❌ **Timeout** = Your server took too long to respond

---

## What Should Happen

When the webhook fires successfully:

1. **Shopify sends** order data to your URL
2. **Your API receives** the data
3. **Creates/updates** a user in database
4. **Looks up** referral tree
5. **Calculates** commissions (if referrer exists)
6. **Updates** wallet balances
7. **Returns** 200 OK to Shopify

---

## Quick Troubleshooting

### If you see 404 Not Found:

**Problem**: URL is wrong or endpoint doesn't exist

**Check**:
```bash
# Verify your deployment has the webhook route
ls -la app/api/webhooks/shopify/order/
# Should see: route.ts
```

**Fix**: Make sure you deployed the latest code to Vercel

---

### If you see 500 Internal Server Error:

**Problem**: Your code has an error

**Check Vercel logs**:
1. Go to Vercel dashboard
2. Select your project
3. Click "Deployments"
4. Click on latest deployment
5. Click "Functions" tab
6. Look for errors in `/api/webhooks/shopify/order`

**Common issues**:
- Missing environment variables
- Supabase connection error
- Database permissions issue

---

### If you see successful 200 but no data in database:

**Problem**: Webhook received but didn't process correctly

**Check**:
1. Run the database check script:
   ```bash
   node check-webhook-results.js
   ```

2. Check if test data has a referral code:
   - Shopify test notifications might not include referral codes
   - This is normal - users will still be created
   - Commissions only calculate if referrer exists

---

## Real World Test (Recommended After Test Notification Works)

Once the test notification shows 200 OK, try a real test:

### Create a referral chain:

1. **Sign up as User A**:
   ```
   Go to: https://meatzy-website.vercel.app/signup
   Create account
   Copy referral code from dashboard (e.g., ABC123)
   ```

2. **Visit as referred customer**:
   ```
   Open incognito window
   Visit: https://meatzy-website.vercel.app?ref=ABC123
   Check console: Should see "Referral code captured"
   ```

3. **Make a purchase**:
   ```
   Add product to cart
   Go through Shopify checkout
   Use test card: 4242 4242 4242 4242
   Email: testcustomer@example.com
   Complete order
   ```

4. **Check results**:
   ```bash
   node check-webhook-results.js
   ```

   Should show:
   - New user created (testcustomer@example.com)
   - Commission created for User A
   - User A's wallet balance increased

5. **Check User A's dashboard**:
   ```
   Log in as User A
   Dashboard should show:
   - 1 referral
   - 1 commission
   - Pending balance > $0
   ```

---

## Expected Output from check-webhook-results.js

### If webhook is working:

```
🔍 Checking for webhook activity...

📊 Users created in last 24 hours: 1

Recent users:
  • testcustomer@example.com
    Name: Test Customer
    Purchased: Yes ✅
    Created: 11/19/2024, 2:30:15 PM

💰 Commissions created in last 24 hours: 1

Recent commissions:
  • $24.57 for usera@example.com
    Tier 1 from testcustomer@example.com purchase
    Status: pending
    Created: 11/19/2024, 2:30:15 PM

💵 Wallets with balance: 1

Wallet balances:
  • usera@example.com
    Pending: $24.57
    Available: $0.00
    Total earned: $24.57

═══════════════════════════════════════════
📋 SUMMARY
═══════════════════════════════════════════
✅ Webhook appears to be working!
   1 new user(s)
   1 new commission(s)
```

### If webhook hasn't fired yet:

```
🔍 Checking for webhook activity...

📊 Users created in last 24 hours: 0

  ℹ️  No users created recently

💰 Commissions created in last 24 hours: 0

  ℹ️  No commissions created recently

💵 Wallets with balance: 0

  ℹ️  No wallets have balances yet

═══════════════════════════════════════════
📋 SUMMARY
═══════════════════════════════════════════
⚠️  No recent webhook activity detected

Next steps:
1. Click on webhook in Shopify and send test notification
2. Or make a test purchase on your store
3. Run this script again to check results
```

---

## Security: Add HMAC Verification (After Testing)

Once webhook is working, add the signing secret for security:

**Your signing secret from Shopify**:
```
7ebb4b936402797f80d42b68290c82935c3e3b02706b47646ef2c314adda24c2
```

**Add to Vercel environment variables**:
1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Add:
   ```
   Name: SHOPIFY_WEBHOOK_SECRET
   Value: 7ebb4b936402797f80d42b68290c82935c3e3b02706b47646ef2c314adda24c2
   ```
3. Redeploy

Then the webhook will verify requests are actually from Shopify.

---

## Summary Checklist

- [ ] Click on webhook in Shopify
- [ ] Send test notification
- [ ] Check response (should be 200 OK)
- [ ] Run `node check-webhook-results.js`
- [ ] Check Shopify "Recent deliveries" for status
- [ ] If 200 OK, make a real test purchase
- [ ] Verify commission appears in database
- [ ] Check affiliate dashboard shows commission
- [ ] Add HMAC secret to Vercel (optional but recommended)

---

**Once you see 200 OK, your referral system is LIVE and fully automated!** 🎉

Let me know what status code you see when you send the test notification!
