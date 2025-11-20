# Shopify Thank You Page Redirect Setup

This guide shows how to add a redirect button (with auto-redirect) to Shopify's order confirmation page that sends customers to your custom thank you page with referral tools.

## Installation Steps

### 1. Copy the Script

Open `shopify-thank-you-redirect.html` and copy the entire contents.

### 2. Add to Shopify

1. Go to **Shopify Admin**
2. Navigate to **Settings → Checkout**
3. Scroll down to **Order status page**
4. Find the **Additional scripts** section
5. Paste the entire script from `shopify-thank-you-redirect.html`
6. Click **Save**

## What Customers Will See

After completing an order on Shopify, customers will see:

### Visual Elements:
- **Gradient box** with Meatzy branding colors
- **Title**: "🎉 Start Earning Today!"
- **Subtitle**: "View your referral dashboard and share your link to earn 13% commission"
- **Large button**: "Access Your Referral Dashboard"
- **Countdown timer**: "Auto-redirecting in 5 seconds..."

### Behavior:
- **Auto-redirect**: Page automatically redirects after 5 seconds
- **Manual click**: Customer can click button to redirect immediately
- **URL parameters**: Passes order_id, email, and name to custom thank you page

## How It Works

1. **Shopify displays** default order confirmation
2. **Script injects** branded redirect box below order details
3. **Timer counts down** from 5 seconds
4. **Auto-redirects** to:
   ```
   https://getmeatzy.com/thank-you?order_id=1171&email=customer@email.com&name=Jon+Doe
   ```

5. **Custom thank you page** loads with:
   - Order summary
   - Referral link with QR code
   - Social sharing buttons
   - Password setup form
   - Commission structure

## Benefits

✅ Seamless transition from Shopify checkout to custom referral page
✅ Customer gets referral tools immediately after purchase
✅ 5-second delay allows quick review of order confirmation
✅ Manual button click option for impatient customers
✅ Branded design matches Meatzy colors

## Testing

1. Place a test order in your Shopify store
2. Complete checkout
3. Verify the redirect box appears on order confirmation page
4. Confirm auto-redirect after 5 seconds
5. Check that custom thank you page loads with correct order details

## Troubleshooting

**Redirect box not showing?**
- Clear browser cache
- Verify script was saved in Shopify Admin
- Check browser console for JavaScript errors

**Wrong order details?**
- Verify Shopify Liquid variables are available: `{{ order.order_number }}`, `{{ customer.email }}`
- Check that customer is logged in or provided email during checkout

**Redirect not working?**
- Ensure custom domain is correct: `https://getmeatzy.com`
- Verify thank you page route exists: `/thank-you`

## Future Enhancement

Once Shopify Apps or Checkout Extensibility is set up, you can:
- Skip Shopify thank you page entirely
- Redirect immediately after order completion
- Customize the entire checkout experience

For now, this script provides a clean bridge between Shopify's confirmation and your custom referral page.
