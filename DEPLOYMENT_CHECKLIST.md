# Meatzy Referral System - Deployment Checklist

## Pre-Deployment (Local Environment)

### ✅ Completed
- [x] Supabase project created
- [x] Database schema deployed (`supabase-schema.sql`)
- [x] Environment variables configured (`.env.local`)
- [x] Basic tables and triggers verified
- [x] Frontend components built
- [x] Backend API routes created
- [x] Test suite created and passing (5/5 tests)

### ⚠️ Required Before Deploy
- [ ] **CRITICAL**: Run `supabase-wallet-functions.sql` in Supabase SQL Editor
  - This adds the 3 wallet management functions
  - Without these, commissions won't update wallet balances
  - Test with: `node test-wallet-update.js`

- [ ] Test local build
  ```bash
  npm run build
  npm run start
  ```

- [ ] Clean up test data (optional)
  ```bash
  node test-referral-system.js --cleanup
  ```

## Vercel Deployment

### Step 1: Connect Repository
- [ ] Push code to GitHub
- [ ] Connect repository to Vercel
- [ ] Select `meatzy-final` as root directory (if in monorepo)

### Step 2: Configure Environment Variables
Add these in Vercel Project Settings → Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ezgfwukgtdlynabdcucz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_IjT_eKYOcY7g4UP4-u65Yg_uiSLr76t
SUPABASE_SERVICE_ROLE_KEY=sb_secret_anAFEVQlaJwtylb7mfVJBQ_TdI99qW5
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=meatzystore.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=a5bdc1bfd39a768240c3d49013570733
```

### Step 3: Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Note your production URL (e.g., `meatzy.vercel.app`)

## Post-Deployment Configuration

### Shopify Webhook Setup
1. [ ] Go to Shopify Admin → Settings → Notifications → Webhooks
2. [ ] Click "Create webhook"
3. [ ] Configure:
   - **Event**: Order creation
   - **Format**: JSON
   - **URL**: `https://YOUR-VERCEL-URL.vercel.app/api/webhooks/shopify/order`
   - **API version**: Latest
4. [ ] Save webhook
5. [ ] Test webhook with a real Shopify order

### Optional: HMAC Verification (Recommended for Production)
- [ ] Add `SHOPIFY_WEBHOOK_SECRET` to Vercel environment variables
- [ ] Uncomment HMAC verification in `/app/api/webhooks/shopify/order/route.ts`
- [ ] Redeploy

## Production Testing

### Test 1: Referral Link Capture
- [ ] Visit: `https://YOUR-VERCEL-URL.vercel.app?ref=TEST1234`
- [ ] Open browser console
- [ ] Should see: "Referral code captured: TEST1234"
- [ ] Check localStorage for `meatzy_referral_code`

### Test 2: User Signup Flow
- [ ] Go to `/signup` on production
- [ ] Create account with/without referral code
- [ ] Should redirect to `/dashboard`
- [ ] Dashboard should display:
  - [ ] Wallet balances
  - [ ] Referral link with copy button
  - [ ] Empty state for commissions and referrals

### Test 3: Referral Tree
- [ ] Copy your referral link from dashboard
- [ ] Share with a friend or use incognito window
- [ ] Create second account using your referral link
- [ ] Check first account's dashboard
  - [ ] Should show 1 referral in "Your Referrals" section

### Test 4: Real Shopify Order (Most Important!)
- [ ] Create test order in Shopify with real/test payment
- [ ] Include referral code in order notes OR
- [ ] Make sure customer exists in referral system
- [ ] Check Shopify webhook logs for successful delivery
- [ ] Check Supabase:
  - [ ] User created/updated in `users` table
  - [ ] Commission record in `commissions` table
  - [ ] Wallet balance updated in `wallet` table
- [ ] Check referrer's dashboard for new commission

### Test 5: Multi-Level Referrals
- [ ] User A signs up
- [ ] User B signs up with A's code
- [ ] User C signs up with B's code
- [ ] User D makes a purchase
- [ ] Verify commissions:
  - [ ] User C gets Tier 1 commission (13%)
  - [ ] User B gets Tier 2 commission (2%)
  - [ ] User A gets Tier 3 commission (1%)

## Monitoring & Maintenance

### Database Health Checks
Run these SQL queries regularly:

**Active affiliates with earnings**:
```sql
SELECT
  u.email,
  u.referral_code,
  w.total_earned,
  COUNT(DISTINCT ut.user_id) as total_referrals
FROM users u
JOIN wallet w ON w.user_id = u.id
LEFT JOIN user_tree ut ON ut.ancestor_id = u.id AND ut.level = 1
WHERE u.is_active = true
GROUP BY u.id, w.id
ORDER BY w.total_earned DESC;
```

**Recent commissions**:
```sql
SELECT
  DATE(c.created_at) as date,
  COUNT(*) as commission_count,
  SUM(c.commission_amount) as total_amount
FROM commissions c
WHERE c.created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(c.created_at)
ORDER BY date DESC;
```

**Pending withdrawals**:
```sql
SELECT
  u.email,
  w.amount,
  w.paypal_email,
  w.created_at
FROM withdrawals w
JOIN users u ON u.id = w.user_id
WHERE w.status = 'pending'
ORDER BY w.created_at;
```

### Automated Monitoring (Future)
- [ ] Set up Sentry for error tracking
- [ ] Add Vercel Analytics
- [ ] Create Supabase alerts for critical events
- [ ] Monitor webhook delivery rates
- [ ] Track signup → purchase conversion rates

## Security Checklist

### Supabase
- [x] Row Level Security (RLS) enabled on all tables
- [x] Service role key stored securely (server-side only)
- [ ] Consider IP restrictions for API access (Enterprise plan)
- [ ] Review and audit RLS policies monthly

### Webhooks
- [ ] Implement HMAC signature verification
- [ ] Rate limit webhook endpoint (Vercel Edge Config)
- [ ] Log all webhook attempts for audit

### User Data
- [ ] Privacy policy updated with referral program terms
- [ ] GDPR compliance (if applicable)
- [ ] User data deletion process documented

## Performance Optimization

### Database
- [x] Indexes created on foreign keys
- [x] Indexes on frequently queried columns
- [ ] Consider materialized views for analytics (future)

### Frontend
- [ ] Enable Vercel Image Optimization
- [ ] Consider React Query for data caching
- [ ] Lazy load dashboard components

### API
- [ ] Rate limiting on API routes (Vercel Edge Middleware)
- [ ] Cache referral code lookups (Redis/Vercel KV - future)

## Backup & Recovery

- [ ] Enable Supabase automatic backups (Project Settings → Backups)
- [ ] Document recovery procedures
- [ ] Test backup restoration process quarterly

## Documentation

- [x] REFERRAL_SYSTEM_README.md
- [x] SETUP_INSTRUCTIONS.md
- [x] DEPLOYMENT_CHECKLIST.md (this file)
- [ ] Create video walkthrough for affiliates
- [ ] FAQ page for common questions

## Launch Readiness

### Must-Have Before Public Launch
- [ ] Wallet functions installed and tested
- [ ] Shopify webhook configured and tested
- [ ] Real money test transaction completed
- [ ] Commission payout process documented
- [ ] Customer support contact info added
- [ ] Terms & conditions for affiliates

### Nice-to-Have for Better UX
- [ ] Email notifications for commissions
- [ ] Welcome email with referral link
- [ ] Social sharing buttons on dashboard
- [ ] Referral link QR code generator
- [ ] Mobile-responsive design tested

### Marketing Materials
- [ ] Affiliate program landing page
- [ ] Commission structure clearly displayed
- [ ] Success stories/testimonials
- [ ] Getting started guide for affiliates

---

## Quick Reference

### Important URLs
- **Production Site**: https://YOUR-VERCEL-URL.vercel.app
- **Supabase Dashboard**: https://ezgfwukgtdlynabdcucz.supabase.co
- **Shopify Admin**: https://meatzystore.myshopify.com/admin
- **Vercel Dashboard**: https://vercel.com/dashboard

### Emergency Contacts
- **Developer**: [Your contact]
- **Supabase Support**: support@supabase.io
- **Vercel Support**: support@vercel.com

### Critical Scripts
```bash
# Verify Supabase setup
node verify-supabase.js

# Test referral system
node test-referral-system.js

# Test wallet updates
node test-wallet-update.js

# Clean up test data
node test-referral-system.js --cleanup
```

---

**Last Updated**: 2024
**Status**: Ready for deployment pending wallet functions installation
