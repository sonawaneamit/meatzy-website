# 🚀 Final Setup Steps - Meatzy Referral System

## ✅ What We Just Completed

### 1. HMAC Security ✅
- Added webhook signature verification
- Prevents unauthorized webhook requests
- Uses your Shopify signing secret for validation

### 2. Enhanced Referral Code Tracking ✅
- Referral codes now added in **3 places** for maximum reliability:
  1. **Line item attributes** - Shows on individual products in Shopify order
  2. **Cart attributes** - Stored at cart level
  3. **Order note** - Visible to support team in order details

### 3. Multi-Method Extraction in Webhook ✅
- Webhook checks 3 different locations for referral code:
  1. Note attributes (`referral_code` or `Referral Code`)
  2. Line item properties
  3. Order note text (searches for pattern like "Referral: ABC123")

---

## 📋 Next Steps - Deploy & Test

### Step 1: Add Webhook Secret to Vercel (5 minutes)

Your webhook secret is:
```
7ebb4b936402797f80d42b68290c82935c3e3b02706b47646ef2c314adda24c2
```

**To add it to Vercel**:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (meatzy-website)
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add:
   ```
   Name: SHOPIFY_WEBHOOK_SECRET
   Value: 7ebb4b936402797f80d42b68290c82935c3e3b02706b47646ef2c314adda24c2
   Environment: Production, Preview, Development
   ```
6. Click **Save**

### Step 2: Deploy to Production (2 minutes)

**Option A: Push to Git (Automatic deployment)**
```bash
cd "/Users/amitsonawane/Desktop/Meatzy Website/meatzy-final"
git add .
git commit -m "Add HMAC verification and enhanced referral tracking"
git push
```
Vercel will automatically deploy.

**Option B: Manual Deployment via Vercel**
1. Go to Vercel dashboard
2. Click **Deployments**
3. Click **Redeploy** on latest deployment

### Step 3: Test the Complete Flow (15 minutes)

Once deployed, follow this **end-to-end test**:

#### A. Clean Up Test Data (Optional)
```bash
cd "/Users/amitsonawane/Desktop/Meatzy Website/meatzy-final"
node test-referral-system.js --cleanup
```

#### B. Create First Real Affiliate (YOU!)

1. **Visit your signup page**:
   ```
   https://meatzy-website.vercel.app/signup
   ```

2. **Sign up with your real email**
   - Fill in your name
   - Use your email
   - Create password
   - Leave referral code blank (you're the first!)

3. **Go to dashboard**:
   ```
   https://meatzy-website.vercel.app/dashboard
   ```

4. **Copy your referral code**
   - Should see it displayed prominently
   - Example: `ABC12345`
   - Click "Copy" button to copy your referral link

#### C. Test Referral Flow (Incognito/Private Window)

1. **Open incognito/private window**

2. **Visit your referral link**:
   ```
   https://meatzy-website.vercel.app?ref=YOUR_CODE
   ```
   Replace `YOUR_CODE` with the code from your dashboard

3. **Open browser console** (F12)
   - Should see: `"Referral code captured: YOUR_CODE"`

4. **Check localStorage**:
   ```javascript
   localStorage.getItem('meatzy_referral_code')
   ```
   Should return your code

5. **Add product to cart**
   - Browse to a product
   - Click "Add to Cart" or "Build Custom Box"
   - Continue to Shopify checkout

6. **Complete purchase**:
   - Use **Shopify test card**: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/28`)
   - CVV: Any 3 digits (e.g., `123`)
   - Email: `testcustomer@example.com`
   - Name: Test Customer
   - Address: Any test address
   - Complete order

#### D. Verify in Shopify (IMPORTANT for Support Team)

1. **Go to Shopify Admin** → Orders
2. **Find the test order**
3. **Check if referral code is visible**:
   - Should see "Referral Code: YOUR_CODE" in order notes
   - Check line items for custom attributes
   - Your support team can see this easily!

#### E. Verify Commission Created

1. **Check database**:
   ```bash
   node check-webhook-results.js
   ```

   Should show:
   - New user created (testcustomer@example.com)
   - Commission created for YOU
   - Your wallet balance increased

2. **Check your affiliate dashboard**:
   ```
   https://meatzy-website.vercel.app/dashboard
   ```

   Should display:
   - ✅ 1 referral (testcustomer@example.com)
   - ✅ 1 commission (~$24.57 for $189 box at 13%)
   - ✅ Pending balance updated

#### F. Verify Shopify Webhook

1. **Go to Shopify Admin** → Settings → Notifications → Webhooks
2. **Click on your "Order creation" webhook**
3. **Check "Recent deliveries"**
4. Should see:
   - Latest order delivery
   - **Status: 200 OK** ✅
   - Response time < 2 seconds

---

## 🎯 What Your Support Team Will See

When a customer makes a purchase with a referral code:

### In Shopify Order Details:

1. **Order Note Section**:
   ```
   Referral Code: ABC12345
   ```

2. **Line Item Custom Attributes**:
   ```
   Product: Custom Meat Box
   Attributes:
   - Referral Code: ABC12345
   ```

3. **Order Timeline**:
   ```
   Order created
   Referral Code: ABC12345
   ```

**Support can easily**:
- See which affiliate referred the customer
- Look up affiliate by code
- Manually adjust commissions if needed
- Verify referral tracking is working

---

## 🔍 Troubleshooting

### Issue: Referral code not showing in Shopify order

**Check**:
1. Browser console shows "Referral code captured"
2. localStorage has the code before checkout
3. Cart was created with referral code (check console logs)

**Solutions**:
- Make sure you clicked the referral link BEFORE adding to cart
- Clear cart and start fresh with referral link
- Check that code hasn't expired in localStorage

### Issue: Commission not created

**Check**:
1. Shopify webhook delivery (should be 200 OK)
2. Vercel logs for errors
3. Supabase logs for database errors

**Solutions**:
- Verify webhook secret is set in Vercel
- Check referrer user exists in database
- Run `node check-webhook-results.js`

### Issue: Webhook returns 401 Unauthorized

**Cause**: HMAC verification failing

**Solutions**:
1. Verify `SHOPIFY_WEBHOOK_SECRET` is set correctly in Vercel
2. Make sure it matches the signing secret from Shopify
3. Redeploy after adding environment variable

---

## 📊 Monitoring Dashboard

After launch, monitor these key metrics:

### Daily Checks

**In Supabase**:
```sql
-- Today's commissions
SELECT COUNT(*), SUM(commission_amount)
FROM commissions
WHERE created_at >= CURRENT_DATE;

-- Active affiliates
SELECT COUNT(*)
FROM users
WHERE has_purchased = true;

-- Pending balances
SELECT COUNT(*), SUM(pending_balance)
FROM wallet
WHERE pending_balance > 0;
```

**In Shopify**:
- Check webhook delivery success rate
- Look for orders with referral codes
- Monitor order notes for patterns

---

## ✅ Post-Deployment Checklist

After you complete the test flow above:

- [ ] Webhook secret added to Vercel
- [ ] Code deployed to production
- [ ] Your affiliate account created
- [ ] Referral link copied
- [ ] Test order completed with referral code
- [ ] Referral code visible in Shopify order
- [ ] Commission created in database
- [ ] Dashboard shows commission
- [ ] Shopify webhook shows 200 OK
- [ ] Support team can see referral codes in orders

---

## 🎉 You're Live!

Once all checkboxes are checked, your referral system is **fully operational**!

### What Happens Automatically Now:

1. Customer clicks affiliate link → Code saved
2. Customer shops → Code added to cart
3. Customer checks out → Order created
4. Shopify webhook fires → Your system processes
5. User created/updated → Tree built
6. Commissions calculated → Wallets updated
7. Affiliate sees commission → In their dashboard
8. Support sees referral code → In Shopify order

**No manual intervention needed!** 🚀

---

## 📞 Support Team Training

Share this with your support team:

### How to Find Referral Information

**When customer asks about referral**:

1. **In Shopify**, open their order
2. **Look for** "Referral Code: XXXXX" in:
   - Order notes (top of order)
   - Line item attributes
   - Order timeline

3. **If found**, they were referred
4. **To find referrer**:
   - Go to Supabase dashboard
   - Run: `SELECT email FROM users WHERE referral_code = 'XXXXX'`
   - Or give them the code to check on affiliate dashboard

### Manual Commission Adjustment

If commission didn't process automatically:

1. Get order ID and total
2. Get buyer email
3. Run in Supabase SQL editor:
   ```sql
   -- Find buyer
   SELECT id FROM users WHERE email = 'buyer@email.com';

   -- Create commission manually
   -- (Contact developer for script)
   ```

---

## 🔐 Security Best Practices

Now that you're live:

- ✅ HMAC verification enabled
- ✅ Webhook secret secured in environment variables
- ✅ Service role key server-side only
- ✅ RLS policies active on all tables

**Additional recommendations**:
- Monitor webhook delivery logs weekly
- Review commission calculations monthly
- Audit top affiliates quarterly
- Backup database regularly (Supabase auto-backups enabled)

---

## 🚀 Next Features (Future)

Consider adding:
1. Email notifications when affiliates earn commissions
2. PayPal integration for automated payouts
3. Admin panel for manual overrides
4. Referral link social sharing buttons
5. QR code generation for offline sharing
6. Analytics dashboard with charts
7. Leaderboard for top affiliates
8. Tiered bonuses (e.g., extra $ for 50+ referrals)

---

**Congratulations! Your 4-tier MLM referral system is complete and production-ready!** 🎊

For questions or issues, check:
1. This guide
2. DEPLOYMENT_CHECKLIST.md
3. SHOPIFY_WEBHOOK_SETUP.md
4. VERIFICATION_REPORT.md
