# Shopify Thank You Page Redirect - Setup Guide

## 🎯 What This Does

After customers complete checkout, they'll be automatically redirected to your custom thank you page at `https://meatzy-website.vercel.app/thank-you` where they can:
- See their complete order summary
- Get their unique referral link
- Start earning commissions immediately

---

## 📋 Step-by-Step Setup

### Step 1: Access Shopify Admin

1. Log in to your Shopify admin panel
2. Navigate to: **Settings** (bottom left corner)

### Step 2: Find Checkout Settings

1. In Settings, click **Checkout**
2. Scroll down to the **Order status page** section
3. Look for **Additional scripts** text area

> **Note**: This is different from "Checkout scripts" - make sure you're in the Order status page section!

### Step 3: Add the Redirect Script

1. Open the file `/docs/SHOPIFY-REDIRECT-SCRIPT.html`
2. Copy **ALL** the contents (lines 1-106)
3. Paste into the **Additional scripts** field in Shopify
4. Click **Save** at the bottom right

### Step 4: Verify Configuration

Before going live, check these settings in the script:

```javascript
var config = {
  redirectUrl: 'https://meatzy-website.vercel.app/thank-you',  // ✅ Production URL
  delay: 2000,  // ✅ 2 seconds (allows Shopify conversion tracking)
  debug: false  // ✅ Should be false for production
};
```

**For testing only**: Change `debug: false` to `debug: true` and check browser console for logs.

---

## 🧪 Testing the Redirect

### Important: Test Mode Limitations

⚠️ **Shopify's test checkout does NOT trigger the redirect script**

To properly test:

1. **Option A - Real Order (Recommended)**:
   - Place a small real order ($1-5)
   - Complete actual checkout
   - Verify redirect happens after 2 seconds

2. **Option B - Preview Mode**:
   - Use browser developer tools
   - Navigate to any order status page
   - Manually run the script in console
   - Check if redirect URL is built correctly

### What to Look For

When testing with a real order, you should see:

1. ✅ Shopify order confirmation page loads
2. ✅ "Thank You for Your Order!" message appears
3. ✅ After 2 seconds, automatic redirect to custom thank you page
4. ✅ Custom thank you page shows:
   - Order summary with line items
   - Shipping address
   - Total amount
   - Referral widget with unique code

---

## 🔧 Troubleshooting

### Issue: Redirect Not Happening

**Possible causes**:

1. **Script not saved properly**
   - Go back to Shopify Admin → Settings → Checkout
   - Verify script is still in Additional scripts field
   - Click Save again

2. **Testing in test mode**
   - Test mode doesn't trigger Additional scripts
   - Use a real order to test

3. **Browser blocking redirect**
   - Check browser console for errors (F12)
   - Look for popup blocker warnings
   - Temporarily disable ad blockers

4. **Incorrect URL**
   - Verify `redirectUrl` matches your deployed site
   - Production: `https://meatzy-website.vercel.app/thank-you`
   - Local testing: `http://localhost:3000/thank-you`

### Issue: Redirect Happens But Page Shows Error

**Possible causes**:

1. **Missing order_id parameter**
   - Enable debug mode: `debug: true`
   - Check console logs to see what's being extracted
   - Verify `Shopify.checkout.order_id` is available

2. **API endpoint not working**
   - Check `/api/shopify/order` endpoint
   - Verify Shopify credentials in environment variables
   - Check Vercel deployment logs

3. **User not created in database**
   - Verify Supabase webhook is working
   - Run diagnostic: `node scripts/diagnose-supabase.js`
   - Check that auth trigger is set up correctly

### Issue: Order Details Not Showing

**Check these**:

1. **Shopify API credentials**:
   ```bash
   # Verify in Vercel environment variables:
   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxx
   ```

2. **API permissions**:
   - Go to Shopify Admin → Apps → Develop apps
   - Verify app has `read_orders` permission
   - Regenerate token if needed

3. **Order ID format**:
   - Script passes order number (e.g., "1169")
   - API tries order number first, then internal ID
   - Check browser Network tab to see actual API call

---

## 🎨 Customization Options

### Change Redirect Delay

```javascript
delay: 2000,  // 2 seconds (recommended)
delay: 5000,  // 5 seconds (longer confirmation time)
delay: 0,     // Instant (not recommended - breaks tracking)
```

> **Important**: Keep delay at least 1-2 seconds for Shopify conversion tracking!

### Change Redirect URL

For different environments:

```javascript
// Production
redirectUrl: 'https://meatzy-website.vercel.app/thank-you'

// Staging
redirectUrl: 'https://meatzy-staging.vercel.app/thank-you'

// Local testing
redirectUrl: 'http://localhost:3000/thank-you'
```

### Customize Loading Message

Edit the HTML section (lines 70-81) in the script:

```html
<div style="background: linear-gradient(135deg, #C54A4A 0%, #8B3A3A 100%); ...">
  <h2 style="...">
    🎉 Thank You for Your Order!
  </h2>
  <p style="...">
    Redirecting to your personalized thank you page...
  </p>
</div>
```

---

## 📊 Success Metrics

Once live, you should see:

- ✅ 100% of customers redirect to custom thank you page
- ✅ Order details populate correctly
- ✅ Referral codes generated for all customers
- ✅ Customers can immediately share their referral link

Monitor in:
- Google Analytics (page views for `/thank-you`)
- Supabase dashboard (new users created)
- Vercel logs (API calls to `/api/shopify/order`)

---

## 🚀 Going Live Checklist

Before enabling for all customers:

- [ ] Script added to Shopify Additional scripts
- [ ] `debug: false` in config
- [ ] Correct production URL set
- [ ] Tested with at least one real order
- [ ] Order details display correctly
- [ ] Referral widget shows up
- [ ] Password setup link works
- [ ] Social sharing buttons work
- [ ] Environment variables set in Vercel:
  - [ ] `SHOPIFY_STORE_DOMAIN`
  - [ ] `SHOPIFY_ADMIN_ACCESS_TOKEN`
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`

---

## 🆘 Need Help?

If you encounter issues:

1. **Enable debug mode** in the script and check browser console
2. **Run diagnostics**:
   ```bash
   cd "/Users/amitsonawane/Desktop/Meatzy Website/meatzy-final"
   NEXT_PUBLIC_SUPABASE_URL=https://ezgfwukgtdlynabdcucz.supabase.co \
   SUPABASE_SERVICE_ROLE_KEY=sb_secret_anAFEVQlaJwtylb7mfVJBQ_TdI99qW5 \
   node scripts/diagnose-supabase.js
   ```
3. **Check Vercel logs** for API errors
4. **Check Supabase logs** for database errors

---

## 📁 Related Files

- `/docs/SHOPIFY-REDIRECT-SCRIPT.html` - The actual script to paste
- `/app/thank-you/page.tsx` - Custom thank you page component
- `/app/api/shopify/order/route.ts` - API endpoint for order details
- `/docs/SUPABASE-FIX-TRIGGER.sql` - Database trigger setup

---

**Last Updated**: 2025-11-19
**Status**: Ready for production ✅
