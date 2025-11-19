# Meatzy Referral System - Complete Setup Guide

## ✅ Current Status

Based on our verification, here's what's been set up:

### Database Setup ✅
- **Connection**: Working
- **Tables**: All 7 required tables exist
  - users
  - user_tree
  - subscriptions
  - commissions
  - wallet
  - withdrawals
  - discount_codes
- **Triggers**: User tree and wallet creation triggers are active
- **Test Results**: 5/5 tests passed

### Application Setup ✅
- **Frontend Components**: All working
  - ReferralTracker (automatic URL parameter capture)
  - Signup page with referral code field
  - Dashboard with wallet, commissions, and referrals display
- **Backend**: Shopify webhook handler ready
- **Environment**: `.env.local` configured correctly

## ⚠️ Action Required

### 1. Complete Database Function Setup

You need to run **one more SQL file** in Supabase SQL Editor to enable wallet balance updates:

**File**: `supabase-wallet-functions.sql`

**Steps**:
1. Go to your Supabase dashboard: https://ezgfwukgtdlynabdcucz.supabase.co
2. Click on **SQL Editor** in the left sidebar
3. Click **+ New query**
4. Copy and paste the entire contents of `supabase-wallet-functions.sql`
5. Click **Run** or press Cmd/Ctrl + Enter

This file contains 3 critical functions:
- `increment_pending_balance` - Adds to user's pending balance when commission is earned
- `approve_commission` - Moves pending balance to available balance
- `process_withdrawal` - Handles user withdrawals to PayPal

**Why this is needed**: The test suite creates commissions but the wallet balances don't update because these functions are missing.

### 2. Verify Function Installation

After running the SQL file, test it by running:

```bash
node test-wallet-update.js
```

You should see the wallet balance increase by $25.00.

## 📋 Production Deployment Checklist

### Before Deploying to Vercel

- [ ] Supabase database schema fully set up (including wallet functions)
- [ ] Test suite passes (run `node test-referral-system.js`)
- [ ] Wallet update test passes (run `node test-wallet-update.js`)
- [ ] Environment variables ready for Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
  - `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`

### After Deploying to Vercel

- [ ] Update Shopify webhook URL:
  - Go to Shopify Admin → Settings → Notifications → Webhooks
  - Create webhook for "Order creation"
  - Format: JSON
  - URL: `https://your-vercel-url.vercel.app/api/webhooks/shopify/order`
  - (Optional) Add HMAC verification for security

- [ ] Test referral flow on production:
  - Visit site with `?ref=CODE` parameter
  - Complete a test order in Shopify
  - Verify commission is created in Supabase
  - Check wallet balance updates

- [ ] Create your first admin/test user:
  - Go to `/signup`
  - Create account
  - Copy your referral code
  - Share it to test the full flow

## 🧪 Testing the System

### Local Testing

1. **Test referral link capture**:
   ```
   http://localhost:3000?ref=TEST1234
   ```
   Open browser console and check for: "Referral code captured: TEST1234"

2. **Test signup flow**:
   - Go to `/signup`
   - Fill form with optional referral code
   - Should redirect to `/dashboard` after signup
   - Dashboard should show your unique referral link

3. **Test webhook (manual)**:
   ```bash
   curl -X POST http://localhost:3000/api/webhooks/shopify/order \
     -H "Content-Type: application/json" \
     -d '{
       "id": 123456,
       "order_number": 1001,
       "total_price": "189.00",
       "customer": {
         "id": "789",
         "email": "customer@example.com",
         "first_name": "John",
         "last_name": "Doe"
       },
       "note_attributes": [
         { "name": "referral_code", "value": "YOUR_CODE_HERE" }
       ]
     }'
   ```

### Automated Tests

Run the comprehensive test suite:
```bash
node test-referral-system.js
```

This creates test users and simulates the full referral flow including:
- User creation with/without referral codes
- Multi-level referral tree (3+ levels)
- Commission calculation (4 tiers)
- Wallet balance updates

Clean up test data:
```bash
node test-referral-system.js --cleanup
```

## 🔧 Troubleshooting

### Issue: Commissions created but wallet balance is $0

**Solution**: Run `supabase-wallet-functions.sql` in Supabase SQL Editor

### Issue: User tree not created

**Solution**: The trigger should handle this automatically. Verify:
```sql
SELECT * FROM user_tree WHERE user_id = 'YOUR_USER_ID';
```

### Issue: ReferralTracker not capturing URL parameters

**Solution**:
1. Check browser console for "Referral code captured" message
2. Verify localStorage has `meatzy_referral_code` key
3. Clear cache and try again

### Issue: Dashboard shows no data

**Solution**: Make sure:
1. User is authenticated (check `/login`)
2. User exists in both `auth.users` AND `public.users` tables
3. Wallet was created (trigger should do this automatically)

## 📊 Database Queries for Monitoring

### Check all users and their stats
```sql
SELECT
  id,
  email,
  full_name,
  referral_code,
  has_purchased,
  commission_rate,
  created_at
FROM users
ORDER BY created_at DESC;
```

### View user's referral tree
```sql
SELECT
  ut.level,
  u.email,
  u.full_name,
  u.has_purchased,
  u.created_at
FROM user_tree ut
JOIN users u ON u.id = ut.user_id
WHERE ut.ancestor_id = 'USER_ID_HERE'
ORDER BY ut.level, u.created_at;
```

### Check commission earnings
```sql
SELECT
  c.id,
  c.tier_level,
  c.commission_amount,
  c.status,
  earner.email as earner_email,
  buyer.email as buyer_email,
  c.created_at
FROM commissions c
JOIN users earner ON earner.id = c.user_id
JOIN users buyer ON buyer.id = c.referred_user_id
ORDER BY c.created_at DESC
LIMIT 20;
```

### View wallet balances
```sql
SELECT
  u.email,
  u.full_name,
  w.available_balance,
  w.pending_balance,
  w.total_earned,
  w.total_withdrawn
FROM wallet w
JOIN users u ON u.id = w.user_id
WHERE w.total_earned > 0
ORDER BY w.total_earned DESC;
```

## 🚀 Next Steps After MVP

Once the system is running smoothly, consider adding:

1. **PayPal Integration** - Automated withdrawals
2. **Email Notifications** - Commission alerts, welcome emails
3. **Admin Panel** - Manual overrides, user management
4. **Analytics Dashboard** - Conversion rates, top affiliates
5. **Mobile App** - React Native or PWA
6. **Discount Code Generation** - Unique codes per referrer
7. **Subscription Management UI** - Pause/cancel directly in dashboard
8. **Gamification** - Leaderboards, badges, bonuses

## 📞 Support

If you encounter any issues:

1. Check this guide first
2. Review the REFERRAL_SYSTEM_README.md
3. Run verification script: `node verify-supabase.js`
4. Check Supabase logs for errors
5. Inspect browser console for frontend errors

---

**Status**: Ready for production once wallet functions are installed! 🎉
