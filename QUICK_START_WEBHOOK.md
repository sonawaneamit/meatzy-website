# Quick Start: Shopify Webhook Setup (5 Minutes)

## 🎯 Goal
Connect Shopify to your referral system so commissions are automatically calculated when customers make purchases.

---

## 📋 Prerequisites

- [ ] Website deployed (you need a production URL)
- [ ] Shopify Admin access
- [ ] Have your production URL ready (e.g., `meatzy.vercel.app`)

---

## 🚀 Setup Steps

### 1. Log into Shopify Admin
Go to: `https://meatzystore.myshopify.com/admin`

### 2. Navigate to Webhooks
**Settings** (bottom left) → **Notifications** → Scroll to **Webhooks** → **Create webhook**

### 3. Fill in the Form

**Event**: `Order creation` (select from dropdown)

**Format**: `JSON`

**URL**:
```
https://YOUR-PRODUCTION-URL.com/api/webhooks/shopify/order
```

**Example URLs**:
- If using Vercel: `https://meatzy.vercel.app/api/webhooks/shopify/order`
- If custom domain: `https://www.meatzy.com/api/webhooks/shopify/order`

**Webhook API version**: Select latest (e.g., `2024-10`)

### 4. Save
Click **"Save webhook"** button

### 5. Test It
Click on the webhook you just created → **"Send test notification"**

**Expected Result**: ✅ Status 200 (Success)

---

## ✅ Verification

After creating a real test order:

1. **Check Shopify**:
   - Settings → Notifications → Webhooks
   - Click your webhook
   - "Recent deliveries" should show 200 OK

2. **Check Supabase**:
   ```sql
   -- See recent commissions
   SELECT * FROM commissions ORDER BY created_at DESC LIMIT 5;

   -- See wallet balances
   SELECT u.email, w.pending_balance
   FROM wallet w
   JOIN users u ON u.id = w.user_id
   WHERE w.pending_balance > 0;
   ```

3. **Check Dashboard**:
   - Log into your affiliate account
   - Should see new commission in dashboard

---

## 🔍 What This Webhook Does

```
Customer completes purchase on Shopify
           ↓
Shopify sends order data to your webhook
           ↓
Your API extracts customer info & referral code
           ↓
Creates/updates user in database
           ↓
Looks up referral tree (up to 4 levels)
           ↓
Calculates commissions (13% / 2% / 1% / 1%)
           ↓
Updates wallet balances
           ↓
Done! Affiliates see commissions in dashboard
```

---

## 🧪 Testing Flow

### Complete Test (Recommended)

1. **Create Account A**:
   - Go to `/signup`
   - Create account
   - Copy referral code (e.g., `ABC123`)

2. **Use Referral Link**:
   - Open incognito/private window
   - Visit: `https://your-site.com?ref=ABC123`

3. **Make Purchase**:
   - Add product to cart
   - Complete checkout
   - Use test card: `4242 4242 4242 4242`

4. **Check Results**:
   - Log back into Account A
   - Dashboard should show:
     - ✅ New referral
     - ✅ New commission
     - ✅ Increased pending balance

---

## ⚠️ Common Issues

### Issue: Webhook returns 404
**Fix**: Check URL is exactly: `/api/webhooks/shopify/order`

### Issue: Webhook returns 500
**Fix**:
1. Check Vercel logs for errors
2. Verify environment variables are set
3. Run `node verify-supabase.js`

### Issue: No commission created
**Fix**: Referral code must be passed to Shopify. See [SHOPIFY_WEBHOOK_SETUP.md](./SHOPIFY_WEBHOOK_SETUP.md) for methods.

---

## 🔐 Security (Optional but Recommended)

After webhook is working, add HMAC verification:

1. In Shopify webhook settings, find **"Signing secret"**
2. Copy it
3. Add to Vercel environment variables:
   ```
   SHOPIFY_WEBHOOK_SECRET=your_secret_here
   ```
4. Uncomment verification code in `/app/api/webhooks/shopify/order/route.ts`
5. Redeploy

---

## 📚 More Details

For complete documentation, see:
- [SHOPIFY_WEBHOOK_SETUP.md](./SHOPIFY_WEBHOOK_SETUP.md) - Full guide
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Production checklist

---

## 🎉 You're Done!

Once the webhook shows **200 OK**, your referral system is fully automated!

Every purchase will automatically:
- Create/update users
- Calculate commissions
- Update wallet balances
- Track the referral tree

**No manual intervention needed!** 🚀
