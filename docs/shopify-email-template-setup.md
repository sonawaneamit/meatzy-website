# Shopify Order Confirmation Email - Custom Thank You Button Setup

This guide shows how to add a "Access Your Referral Dashboard" button to Shopify's order confirmation email that links to your custom thank you page.

## Why This Works Better Than Thank You Page Redirect

✅ **Customer gets link in their email** - Can access anytime, not just immediately after checkout
✅ **No JavaScript required** - Works in all email clients
✅ **Persistent access** - Customer can return to get their referral link later
✅ **Higher engagement** - Emails have better visibility than post-checkout pages
✅ **No app required** - Simple email template customization

## Installation Steps

### 1. Go to Shopify Email Templates

1. Open **Shopify Admin**
2. Navigate to **Settings → Notifications**
3. Find and click **"Order confirmation"** in the list
4. This opens the email template editor

### 2. Add the Custom Button

1. Scroll to the **bottom** of the email template
2. Find the closing `</body>` tag (or near the end)
3. **Paste the code** from `shopify-email-template-button.html` BEFORE the closing tag
4. Click **"Save"**

### 3. Test the Email

**Option 1: Send Test Email**
1. In the email template editor, look for "Send test email"
2. Enter your email address
3. Click send
4. Check the email - you should see the referral dashboard button at the bottom

**Option 2: Place Test Order**
1. Place a test order in your store
2. Check the order confirmation email
3. Verify the button appears and links correctly

## What Customers Will See

### Email Content:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃  [Order confirmation details...]  ┃
┃                                    ┃
┃  ╔══════════════════════════════╗ ┃
┃  ║          🎉                  ║ ┃
┃  ║                               ║ ┃
┃  ║   START EARNING TODAY!        ║ ┃
┃  ║                               ║ ┃
┃  ║ Share MEATZY with friends     ║ ┃
┃  ║ and earn 13% commission       ║ ┃
┃  ║                               ║ ┃
┃  ║   [Access Your Referral       ║ ┃
┃  ║    Dashboard →]               ║ ┃
┃  ║                               ║ ┃
┃  ║   What You'll Get:            ║ ┃
┃  ║   • Your unique referral link ║ ┃
┃  ║   • Social sharing tools      ║ ┃
┃  ║   • Track earnings            ║ ┃
┃  ║   • Earn from 4 levels deep   ║ ┃
┃  ╚══════════════════════════════╝ ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Button Links To:
```
https://getmeatzy.com/thank-you?order_id=1171&email=customer@email.com&name=Jon+Doe
```

### Customer Journey:
1. ✅ Places order on Shopify
2. ✅ Receives order confirmation email
3. ✅ Sees branded "Start Earning Today!" section at bottom
4. ✅ Clicks "Access Your Referral Dashboard" button
5. ✅ Lands on custom thank you page with:
   - Order summary
   - Referral link + QR code
   - Social sharing buttons
   - Password setup form
   - Commission structure

## Design Details

**Color Scheme**:
- Background: Gradient red (Meatzy brand colors)
- Button: Mint green (#B8D5B8) with olive text
- Text: White with opacity for hierarchy

**Typography**:
- Headlines: Bebas Neue (brand font)
- Fallback: Helvetica, Arial, sans-serif
- All caps for emphasis

**Layout**:
- Centered design
- Responsive (works on mobile and desktop)
- Clear visual hierarchy
- Prominent CTA button

## Benefits List in Email

The email shows what customers will get:
- ✅ Your unique referral link + QR code
- ✅ Social sharing tools for Instagram, TikTok, Facebook
- ✅ Track your earnings in real-time
- ✅ Earn from 4 levels deep (13%, 2%, 1%, 1%)

## Customization Options

### Change Button Text:
Find this line:
```html
Access Your Referral Dashboard →
```
Change to your preferred text.

### Change Button Color:
Find this line:
```html
background-color: #B8D5B8;
```
Change hex code to your color.

### Change Headline:
Find this line:
```html
Start Earning Today!
```
Change to your preferred headline.

## Troubleshooting

**Button not showing in email?**
- Verify you saved the template in Shopify
- Check that code was pasted BEFORE closing `</body>` tag
- Send test email to verify

**Button link not working?**
- Check that custom domain is correct: `https://getmeatzy.com`
- Verify thank you page exists at `/thank-you`
- Test the URL manually

**Styling looks broken?**
- Email clients strip some CSS - use inline styles only
- Test in multiple email clients (Gmail, Apple Mail, Outlook)
- Avoid complex layouts

## Alternative: Plain Text Link

If you prefer a simpler approach, you can add just a text link:

```html
<p style="text-align: center; margin: 30px 0; padding: 20px; background: #F9F5F0; border-radius: 8px;">
  🎉 <strong>Start earning today!</strong><br>
  <a href="https://getmeatzy.com/thank-you?order_id={{ order.order_number }}&email={{ customer.email }}&name={{ customer.first_name }}%20{{ customer.last_name }}"
     style="color: #C4504C; font-weight: bold; font-size: 18px;">
    Access your referral dashboard →
  </a>
</p>
```

## Next Steps

After installation:
1. Send test email to verify appearance
2. Place test order to verify button works end-to-end
3. Monitor click-through rate from emails
4. Adjust copy/design based on customer engagement

This email integration ensures EVERY customer gets access to their referral tools, even if they miss the thank you page redirect!
