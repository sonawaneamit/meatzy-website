# MEATZY REFERRAL SYSTEM - MVP

## Overview
Complete 4-tier MLM referral system with commission tracking, user dashboards, and Shopify integration.

## Features Built

### ✅ Core Features
- **Referral Link Tracking**: Automatic URL parameter capture (`?ref=CODE`)
- **4-Tier Commission Structure**: 13% / 2% / 1% / 1%
- **User Signup**: Email-based authentication (no SMS for now)
- **Affiliate Dashboard**: View balance, commissions, and referrals
- **Shopify Integration**: Webhook to track orders and calculate commissions
- **Wallet System**: Pending and available balances
- **Tree Tracking**: Multi-level referral tree up to 4 tiers

### 📊 Database Schema (Supabase)
- **users**: User accounts with referral codes
- **user_tree**: Efficient ancestor tracking (4 levels)
- **commissions**: Commission records per order
- **subscriptions**: Shopify subscription tracking
- **wallet**: User balance tracking
- **withdrawals**: Payout management
- **discount_codes**: First purchase discounts

---

## Setup Instructions

### 1. Supabase Setup

**A. Run SQL Schema**
1. Go to your Supabase dashboard: https://ezgfwukgtdlynabdcucz.supabase.co
2. Navigate to **SQL Editor**
3. Create new query and run `supabase-schema.sql`
4. Then run `supabase-wallet-functions.sql`

**B. API Keys (Already Configured)**
```env
NEXT_PUBLIC_SUPABASE_URL=https://ezgfwukgtdlynabdcucz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_IjT_eKYOcY7g4UP4-u65Yg_uiSLr76t
SUPABASE_SERVICE_ROLE_KEY=sb_secret_anAFEVQlaJwtylb7mfVJBQ_TdI99qW5
```

---

### 2. Shopify Webhook Setup

**Configure Order Webhook**:
1. Go to Shopify Admin → Settings → Notifications → Webhooks
2. Click "Create webhook"
3. **Event**: Order creation
4. **Format**: JSON
5. **URL**: `https://your-domain.vercel.app/api/webhooks/shopify/order`

**What it does**:
- Creates/updates user in referral system
- Calculates commissions for 4 tiers
- Updates wallet balances

---

## How It Works

### User Journey 1: Purchase First (Automatic Affiliate)
1. User clicks referral link: `?ref=ABC123`
2. Referral code stored in localStorage
3. User adds box to cart → Shopify checkout
4. Shopify webhook fires → User created in system
5. User automatically gets referral link (emailed/dashboard)
6. Commission rate: **100%** (active subscriber)

### User Journey 2: Sign Up as Affiliate (No Purchase)
1. User visits `/signup`
2. Fills form (optional referral code)
3. Account created → Referral link generated
4. Commission rate: **50%** (until first purchase)
5. Access dashboard at `/dashboard`

### Commission Calculation Example
```
Person A refers Person B → B purchases $100 box
├─ Person A earns: $100 × 13% × 1.0 (rate) = $13.00 (Tier 1)
│
Person B refers Person C → C purchases $150 box
├─ Person B earns: $150 × 13% × 1.0 = $19.50 (Tier 1)
└─ Person A earns: $150 × 2% × 1.0 = $3.00 (Tier 2)
│
Person C refers Person D → D purchases $200 box
├─ Person C earns: $200 × 13% = $26.00 (Tier 1)
├─ Person B earns: $200 × 2% = $4.00 (Tier 2)
└─ Person A earns: $200 × 1% = $2.00 (Tier 3)
```

---

## Pages Created

### Public Pages
- `/signup` - Affiliate signup form
- `/login` - User login
- `/` - Homepage (with referral tracking)

### Protected Pages
- `/dashboard` - User dashboard (requires auth)
  - Wallet balances
  - Referral link with copy button
  - Commission history
  - Direct referrals list

### API Endpoints
- `/api/webhooks/shopify/order` - Order webhook handler

---

## Key Files

### Configuration
- `.env.local` - Environment variables
- `supabase-schema.sql` - Database schema
- `supabase-wallet-functions.sql` - Wallet SQL functions

### Utilities
- `lib/supabase/client.ts` - Browser Supabase client
- `lib/supabase/server.ts` - Server Supabase client
- `lib/supabase/referral.ts` - Referral system utilities

### Components
- `hooks/useReferralTracking.ts` - URL tracking hook
- `components/ReferralTracker.tsx` - Auto-tracking component

### Pages
- `app/signup/page.tsx` - Signup page
- `app/login/page.tsx` - Login page
- `app/dashboard/page.tsx` - Dashboard
- `app/api/webhooks/shopify/order/route.ts` - Webhook

---

## Commission Tiers

| Level | Percentage | Description |
|-------|------------|-------------|
| Tier 1 | 13% | Direct referral |
| Tier 2 | 2% | Referral of referral |
| Tier 3 | 1% | 3rd level down |
| Tier 4 | 1% | 4th level down |

### Commission Rates
- **100%**: Active subscribers (purchased + active)
- **50%**:
  - Signed up without purchase
  - Paused >60 days with <20 direct referrals
- **0%**: After 6 months if <10 direct referrals (manual monitoring)

---

## Testing the System

### 1. Test Referral Link
```bash
http://localhost:3000?ref=TEST1234
```
- Open browser console
- Check for: "Referral code captured: TEST1234"
- Check localStorage: `meatzy_referral_code`

### 2. Test Signup
1. Go to `/signup`
2. Fill form with referral code
3. Submit → Should redirect to `/dashboard`
4. Check dashboard for referral link

### 3. Test Order Webhook (Manual)
```bash
curl -X POST http://localhost:3000/api/webhooks/shopify/order \
  -H "Content-Type: application/json" \
  -d '{
    "id": 123456,
    "order_number": 1001,
    "total_price": "189.00",
    "customer": {
      "id": "789",
      "email": "test@example.com",
      "first_name": "John",
      "last_name": "Doe"
    },
    "note_attributes": [
      { "name": "referral_code", "value": "TEST1234" }
    ]
  }'
```

---

## Next Steps (Post-MVP)

### Features to Add
- [ ] PayPal withdrawal integration
- [ ] Subscription management UI
- [ ] Admin panel for overrides
- [ ] Email notifications
- [ ] Full tree visualization
- [ ] Automated commission approval
- [ ] Automated 60-day/6-month monitoring
- [ ] Mobile app
- [ ] Analytics dashboard

### Shopify Integration Enhancements
- [ ] Discount code generation per referrer
- [ ] Subscription webhooks
- [ ] Customer portal integration

---

## Troubleshooting

### Issue: User not found in dashboard
**Solution**: Make sure Supabase Auth user exists AND user record in `users` table

### Issue: Commissions not calculating
**Solution**:
1. Check Shopify webhook is configured
2. Verify webhook endpoint is accessible
3. Check browser console / server logs

### Issue: Referral code not saving
**Solution**:
1. Check browser localStorage
2. Ensure ReferralTracker component is loaded
3. Clear cache and try again

---

## Database Queries (Useful)

### Check all users
```sql
SELECT id, email, referral_code, has_purchased, commission_rate
FROM users
ORDER BY created_at DESC;
```

### Check user's tree
```sql
SELECT
  ut.level,
  u.email,
  u.full_name,
  u.created_at
FROM user_tree ut
JOIN users u ON u.id = ut.user_id
WHERE ut.ancestor_id = 'USER_ID_HERE'
ORDER BY ut.level, u.created_at;
```

### Check commissions
```sql
SELECT
  c.*,
  u.email as earner_email,
  ref.email as buyer_email
FROM commissions c
JOIN users u ON u.id = c.user_id
JOIN users ref ON ref.id = c.referred_user_id
ORDER BY c.created_at DESC;
```

---

## Support

For issues or questions:
1. Check browser console for errors
2. Check Supabase logs
3. Review this README
4. Test with manual webhook calls

---

**Status**: MVP Complete ✅
**Next**: Deploy to Vercel and test with real Shopify orders
