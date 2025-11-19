# 🚀 Seamless Affiliate System - Complete Setup Guide

## What We Built: Social Snowball Style Flow

Your customers now automatically become affiliates with **ZERO friction**:

1. ✅ Customer arrives via referral link → **Popup shows who referred them**
2. ✅ Customer completes purchase → **Instantly becomes an affiliate**
3. ✅ Thank you page → **Shows their NEW referral code immediately**
4. ✅ Email arrives → **Magic link to access dashboard (no password needed)**
5. ✅ Customer logs in → **Sees earnings, shares link, makes money**

---

## 📊 The Complete Flow

```
Sarah shares her link
        ↓
John clicks → goodranchers.com?ref=SARAH123
        ↓
🎉 Popup: "Sarah sent you premium meat!"
        ↓
John adds to cart (referral code auto-applied)
        ↓
John checks out normally
        ↓
🎊 Thank You Page Widget appears:
   "Share Meatzy and earn 13%!"
   Your code: JOHN84927
   [Copy Link] [Share on Social]
        ↓
📧 Email arrives:
   "Welcome to Meatzy Affiliates!"
   [Access Your Dashboard] ← Magic link
        ↓
John clicks → Instantly logged in to dashboard
        ↓
John sees: $0 earned, but code ready to share
        ↓
John shares with friends → Earns commissions!
```

---

## 🛠️ Setup Steps

### **Step 1: Deploy Your Code**

You've already committed the code. Now make sure these are deployed:

```bash
# Make sure these files are in your repo:
✅ app/api/webhooks/shopify/order/route.ts (updated with magic link)
✅ app/api/get-referral-code/route.ts (new)
✅ app/api/get-referrer-info/route.ts (new)
✅ app/login/page.tsx (updated with magic link toggle)
✅ components/ReferralPopup.tsx (new)
✅ shopify-thank-you-widget.js (new)
```

**Deploy to Vercel:**
- Push to GitHub (already done ✅)
- Vercel auto-deploys
- Wait for deployment to complete

---

### **Step 2: Add Environment Variables to Vercel**

Go to Vercel → Your Project → Settings → Environment Variables

Add these:

```env
NEXT_PUBLIC_SITE_URL=https://goodranchers.com
SHOPIFY_WEBHOOK_SECRET=7ebb4b936402797f80d42b68290c82935c3e3b02706b47646ef2c314adda24c2
KLAVIYO_API_KEY=pk_your_key_here (get from Klaviyo)
```

**Redeploy** after adding variables.

---

### **Step 3: Shopify Plus Checkout Customizations**

#### **A) Add Referral Popup to Your Site**

Add to your homepage layout or `app/layout.tsx`:

```typescript
import ReferralPopup from '../components/ReferralPopup';

export default function Layout({ children }) {
  return (
    <>
      <ReferralPopup />
      {/* rest of your layout */}
      {children}
    </>
  );
}
```

#### **B) Add Thank You Page Widget**

1. Go to Shopify Admin
2. **Settings** → **Checkout**
3. Scroll to **Order status page** section
4. Click **Edit** on "Additional scripts"
5. Copy entire content of `shopify-thank-you-widget.js`
6. Paste it into the script box
7. **Important**: Replace `https://your-domain.vercel.app` with your actual domain
8. Click **Save**

**Test**: Place a test order and check the thank you page!

---

### **Step 4: Set Up Klaviyo Email**

#### **Option A: Use Supabase Default (Quick)**

Supabase sends magic link emails automatically! Just customize the template:

1. Go to Supabase Dashboard
2. **Authentication** → **Email Templates**
3. Click **Magic Link** template
4. Customize with your branding
5. Save

#### **Option B: Use Klaviyo (Advanced)**

Follow instructions in `KLAVIYO_EMAIL_TEMPLATE.md`:

1. Create "Affiliate Welcome" flow
2. Trigger on "Placed Order"
3. Use provided HTML template
4. Add custom webhook integration

---

### **Step 5: Update Shopify Webhook**

Your webhook is already created, but verify the URL:

1. Shopify Admin → **Settings** → **Notifications**
2. Scroll to **Webhooks**
3. Find "Order creation" webhook
4. URL should be: `https://goodranchers.com/api/webhooks/shopify/order`
5. Format: **JSON**
6. Verify it's enabled

---

### **Step 6: Configure Supabase Auth**

Enable magic links in Supabase:

1. Go to Supabase Dashboard
2. **Authentication** → **Providers**
3. Find **Email** provider
4. Enable **Magic Link**
5. Set **Site URL**: `https://goodranchers.com`
6. Set **Redirect URLs**: `https://goodranchers.com/dashboard`
7. Save

---

## 🧪 Testing the Complete Flow

### **Test 1: Referral Popup**

1. Open: `https://goodranchers.com?ref=TEST123`
2. Should see popup: "A friend sent you..."
3. Verify it stores referral code

### **Test 2: Purchase Flow**

1. Add product to cart (with referral code in URL)
2. Complete checkout (use test mode)
3. Check webhook logs in Vercel
4. Verify user created in Supabase
5. Check thank you page shows widget with referral code

### **Test 3: Email & Magic Link**

1. Check email inbox (used at checkout)
2. Should receive either:
   - Supabase magic link email (if using Option A)
   - Klaviyo welcome email (if using Option B)
3. Click magic link
4. Should redirect to dashboard
5. Verify you're logged in automatically

### **Test 4: Dashboard Access**

1. Go to `/dashboard`
2. Should see your referral code
3. Copy your referral link
4. Share with test account
5. Verify tracking works

---

## 📈 Success Metrics to Track

**Week 1:**
- How many customers receive their referral code?
- Email open rate (target: >40%)
- Magic link click rate (target: >20%)
- Dashboard logins (target: >15% of customers)

**Week 2-4:**
- How many customers share their link?
- Referral conversion rate
- Average commissions earned
- Withdrawal requests

**Month 1:**
- Total affiliate signups
- Active affiliates (shared at least once)
- Total referral revenue
- Top performers

---

## 🎯 Optimization Tips

### **Increase Dashboard Logins**

1. **Follow-up Email** (Day 3):
   - "Have you checked your dashboard yet?"
   - Show preview of what they'll see
   - Remind them how to earn

2. **Push Notification** (if applicable):
   - "You earned your first commission!"
   - "Your link was clicked 5 times"

### **Increase Sharing**

1. **Incentive**:
   - "Share within 24 hours, get $10 bonus"
   - "First 100 shares get exclusive merch"

2. **Social Proof**:
   - Show in email: "Top affiliates earned $X this month"
   - Leaderboard in dashboard

3. **Make Sharing Easier**:
   - Pre-written social media posts
   - Shareable graphics/images
   - QR code for their link

### **Reduce Friction**

1. **Thank You Page**:
   - Test different widget designs
   - A/B test copy
   - Add video explaining how it works

2. **Email**:
   - A/B test subject lines
   - Test different send times
   - Personalize based on order

---

## 🐛 Troubleshooting

### **Problem: Widget not showing on thank you page**

**Check**:
- Script is saved in Shopify
- Domain URL is correct (not localhost)
- API endpoint is accessible
- Customer email exists in order

**Debug**:
```javascript
// Add to widget script:
console.log('Customer email:', customerEmail);
console.log('API response:', data);
```

### **Problem: Magic link not working**

**Check**:
- Supabase magic links are enabled
- Redirect URL is whitelisted
- Email is in inbox (check spam)
- Link hasn't expired (valid for 1 hour)

**Debug**:
- Check Supabase logs
- Verify webhook sent email
- Test magic link manually in login page

### **Problem: Referral code not captured**

**Check**:
- ReferralTracker component is included
- Referral code is in cart attributes
- Webhook is receiving the code
- Check Shopify order for referral code in notes

**Debug**:
```bash
# Check webhook logs:
vercel logs --app=your-app-name
```

---

## 📚 Files Reference

| File | Purpose |
|------|---------|
| `app/api/webhooks/shopify/order/route.ts` | Handles Shopify orders, creates affiliates, sends magic link |
| `app/api/get-referral-code/route.ts` | Returns referral code for thank you page widget |
| `app/api/get-referrer-info/route.ts` | Returns referrer name for popup |
| `app/login/page.tsx` | Login page with magic link option |
| `components/ReferralPopup.tsx` | Popup showing who referred the visitor |
| `components/ReferralTracker.tsx` | Tracks referral codes in cart |
| `shopify-thank-you-widget.js` | Thank you page widget (Shopify Plus) |
| `KLAVIYO_EMAIL_TEMPLATE.md` | Klaviyo email template and setup |

---

## 🚀 Launch Checklist

### **Before Launch:**

- [ ] All code deployed to Vercel
- [ ] Environment variables added
- [ ] Shopify webhook configured and tested
- [ ] Thank you page widget installed
- [ ] Referral popup added to homepage
- [ ] Supabase auth configured
- [ ] Email template set up (Supabase or Klaviyo)
- [ ] Test complete flow end-to-end
- [ ] Check on mobile devices
- [ ] Verify in Safari, Chrome, Firefox

### **Day of Launch:**

- [ ] Monitor Vercel logs
- [ ] Check webhook responses
- [ ] Track email deliverability
- [ ] Watch for error reports
- [ ] Test with real order
- [ ] Verify commissions are calculated
- [ ] Check dashboard loads properly

### **Week 1:**

- [ ] Review success metrics
- [ ] Gather customer feedback
- [ ] Fix any bugs reported
- [ ] Optimize based on data
- [ ] Send follow-up emails

---

## 💡 What Makes This Special

### **Compared to Social Snowball:**

| Feature | Social Snowball | Your System |
|---------|----------------|-------------|
| Auto-enrollment | ✅ | ✅ |
| Thank you page widget | ✅ | ✅ |
| Magic link login | ❌ | ✅ |
| 4-tier MLM | ❌ | ✅ |
| Custom branding | Limited | Full control |
| Cost | $99-299/month | $0 |
| Data ownership | Their platform | Your database |

**You built a better system for FREE!** 🎉

---

## 🎊 You're Ready to Launch!

Your seamless affiliate system is complete:

✅ **Auto-enrollment**: Every customer becomes an affiliate
✅ **Instant gratification**: See referral code immediately
✅ **Zero friction**: Magic link login, no password
✅ **Social proof**: Popup shows who referred them
✅ **Full tracking**: 4-tier MLM with real-time dashboard
✅ **Scalable**: Built to handle thousands of affiliates

**Next step**: Test with a real order and launch! 🚀🥩

---

**Questions?** Check the other guides:
- `ADMIN_DASHBOARD_GUIDE.md` - Admin features
- `COMMISSION_STRUCTURE_FIXED.md` - How commissions work
- `KLAVIYO_EMAIL_TEMPLATE.md` - Email setup
- `SHOPIFY_WEBHOOK_SETUP.md` - Webhook details
