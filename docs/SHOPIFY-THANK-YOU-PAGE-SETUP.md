# Shopify Thank You Page Redirect Setup

This guide shows you how to redirect customers to your custom thank you page after checkout.

## What We Built

A custom thank you page at `https://getmeatzy.com/thank-you` that shows:
- ✅ Order confirmation message
- ✅ Order number and customer details
- ✅ What's next steps
- ✅ **Customer's referral link with QR code**
- ✅ Social sharing buttons
- ✅ Commission structure explanation
- ✅ Link to dashboard

## How It Works

1. Customer completes checkout on Shopify
2. Shopify redirects to: `https://getmeatzy.com/thank-you?order_id=123&email=customer@email.com&name=John+Doe`
3. Thank you page fetches customer's referral data from Supabase
4. Shows beautiful referral widget encouraging them to share

---

## Setup Instructions

### Method 1: Shopify Scripts (Recommended - Easy)

1. **Go to Shopify Admin**
   - Navigate to: **Settings** → **Checkout**

2. **Scroll to "Order status page" section**
   - Find "Additional scripts" text box

3. **Add this script:**

```html
<script>
  // Redirect to custom thank you page after 2 seconds
  (function() {
    // Get order details from Shopify
    var orderNumber = Shopify.checkout.order_id || '';
    var customerEmail = Shopify.checkout.email || '';
    var customerName = Shopify.checkout.billing_address
      ? Shopify.checkout.billing_address.first_name + ' ' + Shopify.checkout.billing_address.last_name
      : '';

    // Build redirect URL with parameters
    var redirectUrl = 'https://getmeatzy.com/thank-you' +
      '?order_id=' + encodeURIComponent(orderNumber) +
      '&email=' + encodeURIComponent(customerEmail) +
      '&name=' + encodeURIComponent(customerName);

    // Show Shopify's default confirmation briefly, then redirect
    setTimeout(function() {
      window.location.href = redirectUrl;
    }, 2000); // 2 second delay
  })();
</script>

<!-- Optional: Show a message while redirecting -->
<div style="background: #f0f8f0; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; border: 2px solid #4CAF50;">
  <p style="margin: 0; font-size: 16px; color: #2D2B25;">
    <strong>🎉 Redirecting to your personalized thank you page...</strong>
  </p>
</div>
```

4. **Save**

5. **Test**
   - Complete a test order
   - Verify it redirects to your thank you page
   - Check that referral widget appears

---

### Method 2: Shopify Plus - Checkout Settings (If you have Plus)

If you have Shopify Plus, you can customize the checkout experience more directly:

1. **Go to Shopify Admin**
   - Navigate to: **Settings** → **Checkout**

2. **Under "Order status page"**
   - Click "Customize" button

3. **In the Checkout Editor:**
   - Add a "Custom HTML" block
   - Paste the redirect script from Method 1
   - Save and publish

---

### Method 3: Order Confirmation Email (Alternative)

If you prefer not to redirect, you can include the referral link in the order confirmation email:

1. **Go to Shopify Admin**
   - Navigate to: **Settings** → **Notifications**

2. **Click "Order confirmation"**

3. **Add this to the email template (at the bottom):**

```liquid
<div style="background: #2D2B25; padding: 30px; margin: 30px 0; border-radius: 8px; text-align: center;">
  <h2 style="color: white; margin-bottom: 15px;">Start Earning Today! 💰</h2>
  <p style="color: white; font-size: 16px; margin-bottom: 20px;">
    Share MEATZY with friends and earn <strong style="color: #D4AF37;">13% commission</strong> on every sale!
  </p>
  <a href="https://getmeatzy.com/dashboard"
     style="display: inline-block; background: #8FBC8F; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
    Get Your Referral Link →
  </a>
</div>
```

4. **Save**

---

## Testing Your Setup

### Test Checklist:

1. **Place a test order**
   - Use Shopify's test mode
   - Complete full checkout process

2. **Verify redirect**
   - Should redirect to `https://getmeatzy.com/thank-you`
   - URL should include order_id, email, and name parameters

3. **Check referral widget**
   - Referral link should appear
   - QR code should be visible
   - Copy button should work
   - Social share buttons should work

4. **Test with different scenarios**
   - New customer (user created by webhook)
   - Existing customer (already has referral code)
   - Customer without referral code

### Test URLs:

You can manually test the thank you page with these example URLs:

```
# Test with all parameters
https://getmeatzy.com/thank-you?order_id=1234&email=test@example.com&name=John+Doe

# Test with just email (minimal)
https://getmeatzy.com/thank-you?email=test@example.com

# Test with no parameters (should still work, just no personalization)
https://getmeatzy.com/thank-you
```

---

## Troubleshooting

### Issue: Redirect doesn't work

**Check:**
- Script is in "Additional scripts" section, not "Additional checkout scripts"
- Script is saved and published
- Test in incognito mode (clear cache)

**Solution:**
- Increase timeout from 2 seconds to 5 seconds
- Check browser console for JavaScript errors

---

### Issue: Referral widget doesn't show

**Check:**
- Email parameter is being passed in URL
- User exists in Supabase database
- User has a referral code

**Solution:**
- Check your webhook is creating users properly
- Verify Supabase connection in browser console
- Check Network tab for API errors

---

### Issue: QR code doesn't generate

**Check:**
- `qrcode` npm package is installed
- No errors in browser console

**Solution:**
```bash
npm install qrcode @types/qrcode
```

---

### Issue: Customer sees Shopify page AND custom page

**Problem:** Shopify shows default confirmation, then redirects

**Solution:** This is intentional! The 2-second delay allows Shopify to track the conversion before redirecting. If you want instant redirect, change timeout to 0:

```javascript
setTimeout(function() {
  window.location.href = redirectUrl;
}, 0); // Instant redirect
```

---

## Customization Options

### Change Redirect Delay

Modify the `setTimeout` value (in milliseconds):

```javascript
setTimeout(function() {
  window.location.href = redirectUrl;
}, 3000); // 3 seconds
```

### Skip Redirect for Certain Orders

Only redirect for orders over $100:

```javascript
var orderTotal = parseFloat(Shopify.checkout.total_price) / 100; // Convert cents to dollars

if (orderTotal >= 100) {
  setTimeout(function() {
    window.location.href = redirectUrl;
  }, 2000);
}
```

### Customize Loading Message

Change the HTML message shown during redirect:

```html
<div style="background: #2D2B25; padding: 30px; margin: 20px 0; border-radius: 12px; text-align: center;">
  <h2 style="margin: 0; font-size: 24px; color: white; margin-bottom: 10px;">
    🥩 Thank You for Your Order!
  </h2>
  <p style="margin: 0; font-size: 16px; color: #D4AF37;">
    Preparing your personalized experience...
  </p>
</div>
```

---

## Security Considerations

1. **Email Validation**
   - Thank you page validates email format
   - Prevents injection attacks

2. **No Sensitive Data**
   - Order number is just for display
   - No payment info passed in URL
   - Referral data fetched server-side from Supabase

3. **Rate Limiting**
   - Consider adding rate limiting to thank you page
   - Prevent abuse of referral data endpoint

---

## Analytics Tracking

Add to your thank you page to track conversions:

```javascript
// Google Analytics
gtag('event', 'purchase_complete', {
  order_id: orderNumber,
  referral_shown: !!referralCode
});

// Facebook Pixel
fbq('track', 'Purchase', {
  value: orderTotal,
  currency: 'USD'
});
```

---

## Next Steps After Setup

1. **Test thoroughly** with real test orders
2. **Monitor analytics** - track how many customers share
3. **A/B test messaging** - try different commission highlights
4. **Add email reminder** - send referral link 3 days after purchase
5. **Create referral leaderboard** - gamify the sharing

---

## Support

If you run into issues:

1. Check Shopify's script is enabled and saved
2. Verify URL parameters are being passed
3. Test Supabase connection
4. Check browser console for errors
5. Verify webhook is creating users properly

---

## Quick Reference

### Where to Add Script:
**Shopify Admin → Settings → Checkout → "Additional scripts"**

### Thank You Page URL:
**https://getmeatzy.com/thank-you**

### URL Parameters:
- `order_id` - Shopify order number
- `email` - Customer email
- `name` - Customer full name

### Files Modified:
- `/app/thank-you/page.tsx` - Thank you page component
- `/lib/referral-utils.ts` - Utility functions

---

That's it! Your custom thank you page with referral widget is ready to go! 🚀
