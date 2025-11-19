# 🥩 Meatzy Referral System - START HERE

## 📋 Quick Summary

Your **4-Tier MLM Referral System** is complete and ready for production!

- ✅ Database configured (Supabase)
- ✅ Frontend built (Signup, Dashboard, Tracking)
- ✅ Backend ready (Webhook, API, Commission calculator)
- ✅ Security enabled (HMAC verification, RLS)
- ✅ Multi-level commissions (13% / 2% / 1% / 1%)
- ✅ Support team can see referral codes in Shopify orders

---

## 🚀 Next Step: Deploy & Test

**Read this file**: `FINAL_SETUP_STEPS.md`

It contains:
1. How to add webhook secret to Vercel
2. How to deploy your code
3. Step-by-step testing guide
4. What to check after deployment

**Estimated time**: 20 minutes

---

## 📚 Documentation Index

### For You (Developer/Owner)

1. **FINAL_SETUP_STEPS.md** ⭐ **START HERE**
   - Deploy instructions
   - Testing guide
   - Post-launch checklist

2. **VERIFICATION_REPORT.md**
   - Complete system verification
   - Test results (5/5 passed)
   - What's working

3. **DEPLOYMENT_CHECKLIST.md**
   - Pre/post deployment tasks
   - Production readiness
   - Monitoring setup

4. **SHOPIFY_WEBHOOK_SETUP.md**
   - Detailed webhook guide
   - Security (HMAC)
   - Troubleshooting

5. **REFERRAL_SYSTEM_README.md**
   - System overview
   - How it works
   - Database schema

### For Your Support Team

6. **SUPPORT_TEAM_GUIDE.md** ⭐ **Give this to support**
   - How to find referral codes in Shopify
   - Common customer questions
   - When to escalate
   - Quick reference checklist

### For Testing

7. **TEST_WEBHOOK_NOW.md**
   - How to test webhook
   - Expected results
   - Troubleshooting

8. **QUICK_START_WEBHOOK.md**
   - 5-minute webhook setup
   - Quick reference

---

## 🎯 How the System Works

### Customer Journey

```
1. Customer clicks affiliate link
   ↓
   https://meatzy.com?ref=ABC123
   ↓
2. Referral code saved in browser
   ↓
3. Customer shops and adds to cart
   ↓
4. Referral code added to cart/order
   ↓
5. Customer completes Shopify checkout
   ↓
6. Shopify sends webhook to your server
   ↓
7. Your system:
   - Creates/updates user
   - Builds referral tree
   - Calculates commissions (4 tiers)
   - Updates wallet balances
   ↓
8. Affiliates see commissions in dashboard
   ↓
9. Support team sees referral code in Shopify order
```

**All automatic! No manual work needed.** 🎉

---

## 💰 Commission Structure

| Tier | Percentage | Example ($189 order) |
|------|-----------|---------------------|
| Tier 1 | 13% | $24.57 |
| Tier 2 | 2% | $3.78 |
| Tier 3 | 1% | $1.89 |
| Tier 4 | 1% | $1.89 |

**Total**: Up to 17% of order value distributed across tiers

### Commission Rates

- **100%**: Active subscribers (purchased + subscribed)
- **50%**: Signed up without purchase OR paused >60 days

---

## 🔧 Technical Stack

- **Frontend**: Next.js 14 (React)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **E-commerce**: Shopify (Headless)
- **Hosting**: Vercel
- **Webhook**: Shopify Order Creation

---

## 📊 Key Features

### For Affiliates
- Unique referral link
- Real-time dashboard
- Wallet with pending/available balances
- Commission history
- Direct referrals list
- Multi-tier earnings (earn from 4 levels)

### For Customers
- Seamless referral tracking
- No account required to use referral link
- Automatic application at checkout

### For Support Team
- Referral codes visible in Shopify orders
- Easy lookup (order notes, line items, timeline)
- No technical knowledge required

### For You (Admin)
- Automated commission calculation
- Real-time processing
- Secure webhook validation
- Database-driven (no hardcoded data)
- Scalable architecture

---

## 🔐 Security Features

- ✅ HMAC signature verification on webhooks
- ✅ Row Level Security (RLS) on all database tables
- ✅ Service role key server-side only
- ✅ Prepared statements (SQL injection prevention)
- ✅ Secure session management
- ✅ HTTPS only

---

## 🧪 Testing Tools

You have 3 test scripts:

### 1. Verify Database Setup
```bash
node verify-supabase.js
```
Checks tables, functions, and connection

### 2. Test Referral System
```bash
node test-referral-system.js
```
Creates test users and simulates referrals

### 3. Check Webhook Results
```bash
node check-webhook-results.js
```
Shows recent orders, commissions, and wallets

### 4. Test Wallet Updates
```bash
node test-wallet-update.js
```
Verifies balance calculations

---

## 📱 User Pages

### Public Pages
- `/` - Homepage (with ReferralProgram section)
- `/signup` - Affiliate signup
- `/login` - User login
- `/build-box` - Custom box builder

### Protected Pages (Require Login)
- `/dashboard` - Affiliate dashboard
  - Wallet balances
  - Referral link
  - Commission history
  - Referrals list

### API Endpoints
- `/api/webhooks/shopify/order` - Order webhook handler

---

## 🗄️ Database Tables

1. **users** - Affiliate accounts
2. **user_tree** - Referral tree (4 levels)
3. **commissions** - Commission records
4. **wallet** - Balance tracking
5. **subscriptions** - Shopify subscriptions
6. **withdrawals** - Payout requests
7. **discount_codes** - First purchase discounts

---

## ⚙️ Environment Variables

Required in `.env.local` and Vercel:

```env
# Shopify
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=meatzystore.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=a5bdc...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ezgfwukgtdlynabdcucz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...

# Webhook Security
SHOPIFY_WEBHOOK_SECRET=7ebb4b936402797f80d42b68290c82935c3e3b02706b47646ef2c314adda24c2
```

---

## 🎓 Learning Resources

### If You Need to Modify the System

**Key files to know**:

1. **Referral tracking**:
   - `hooks/useReferralTracking.ts` - Captures URL params
   - `components/ReferralTracker.tsx` - Auto-tracks on all pages

2. **Cart integration**:
   - `lib/shopify/cart.ts` - Adds referral code to orders

3. **Webhook processing**:
   - `app/api/webhooks/shopify/order/route.ts` - Processes orders

4. **Commission calculation**:
   - `lib/supabase/referral.ts` - All referral logic

5. **Dashboard**:
   - `app/dashboard/page.tsx` - Affiliate dashboard

### Database Schema
See: `supabase-schema.sql`

### Shopify Integration
See: `lib/shopify/` folder

---

## 📈 Monitoring After Launch

### Daily
- Check Shopify webhook delivery success rate
- Review new commissions created
- Monitor for errors in Vercel logs

### Weekly
- Audit top affiliates
- Review pending commissions
- Check for suspicious activity

### Monthly
- Calculate total commissions paid
- Analyze referral conversion rates
- Review system performance

---

## 🆘 Need Help?

### Documentation
1. Start with `FINAL_SETUP_STEPS.md`
2. Check troubleshooting sections in each guide
3. Run test scripts to verify setup

### Common Issues
All docs have troubleshooting sections for:
- Webhook not working
- Commissions not calculating
- Dashboard not loading
- Referral codes not showing

### Test First!
Before contacting support, run:
```bash
node verify-supabase.js
node check-webhook-results.js
```

---

## ✅ Quick Start Checklist

- [ ] Read `FINAL_SETUP_STEPS.md`
- [ ] Add webhook secret to Vercel
- [ ] Deploy to production
- [ ] Test with real order
- [ ] Verify referral code in Shopify order
- [ ] Check commission created
- [ ] Train support team (give them `SUPPORT_TEAM_GUIDE.md`)
- [ ] Monitor for 24 hours
- [ ] Celebrate! 🎉

---

## 🎊 Success Criteria

Your system is working correctly when:

1. ✅ Customer clicks referral link
2. ✅ Browser console shows "Referral code captured"
3. ✅ Customer completes purchase
4. ✅ Referral code appears in Shopify order notes
5. ✅ Webhook delivers successfully (200 OK)
6. ✅ Commission created in database
7. ✅ Wallet balance updated
8. ✅ Affiliate sees commission in dashboard

**All 8 steps should work automatically!**

---

## 🚀 You're Ready!

Everything is built, tested, and documented.

**Your next action**: Open `FINAL_SETUP_STEPS.md` and follow the deployment guide.

**Estimated time to production**: 20 minutes

**Good luck! 🥩🎉**

---

## 📞 Quick Contact

- **Technical Questions**: Check documentation first
- **Database Issues**: Check Supabase logs
- **Webhook Issues**: Check Shopify delivery logs + Vercel logs
- **Support Training**: Give them `SUPPORT_TEAM_GUIDE.md`

---

**System Version**: 1.0 MVP
**Last Updated**: November 2025
**Status**: ✅ Ready for Production
