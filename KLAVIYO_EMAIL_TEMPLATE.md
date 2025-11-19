# Klaviyo Email Template: Welcome Affiliate + Magic Link

## 📧 Email Flow After Purchase

When a customer completes their order, they automatically become an affiliate. Here's the email flow:

### **Email 1: Welcome to Meatzy Affiliates** (Sent Immediately)

**Trigger**: Webhook sends when order is created

---

## Email Template

### Subject Line Options:
- `🥩 Your Meatzy referral code is ready!`
- `Share Meatzy & earn 13% commission`
- `Welcome to Meatzy Affiliates, {{ first_name }}!`

---

### Email Body (HTML)

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Meatzy Affiliates</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F5F1E8;">

    <!-- Main Container -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F5F1E8;">
        <tr>
            <td align="center" style="padding: 40px 20px;">

                <!-- Email Content -->
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">

                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); padding: 40px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">
                                🥩 Welcome to Meatzy Affiliates!
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #F5F1E8; font-size: 16px;">
                                Thanks for your order! Now start earning.
                            </p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px;">

                            <p style="margin: 0 0 20px 0; color: #333; font-size: 16px; line-height: 1.6;">
                                Hi {{ first_name }},
                            </p>

                            <p style="margin: 0 0 20px 0; color: #333; font-size: 16px; line-height: 1.6;">
                                Your order is confirmed, and you're now part of the Meatzy affiliate program! 🎉
                            </p>

                            <p style="margin: 0 0 30px 0; color: #333; font-size: 16px; line-height: 1.6;">
                                Share premium American meat with friends and earn commissions on every order.
                            </p>

                            <!-- Referral Code Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); border-radius: 12px; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 30px; text-align: center;">
                                        <p style="margin: 0 0 10px 0; color: #F5F1E8; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                            Your Referral Code
                                        </p>
                                        <p style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 900; letter-spacing: 4px; font-family: 'Courier New', monospace;">
                                            {{ referral_code }}
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Commission Structure -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F5F1E8; border-radius: 8px; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <h3 style="margin: 0 0 15px 0; color: #8B4513; font-size: 18px; font-weight: 700;">
                                            How You Earn:
                                        </h3>
                                        <ul style="margin: 0; padding-left: 20px; color: #333; font-size: 15px; line-height: 1.8;">
                                            <li><strong>13% commission</strong> on direct referrals</li>
                                            <li><strong>2% commission</strong> on their referrals (Level 2)</li>
                                            <li><strong>1% commission</strong> on Level 3</li>
                                            <li><strong>1% commission</strong> on Level 4</li>
                                        </ul>
                                        <p style="margin: 15px 0 0 0; color: #8B4513; font-size: 14px; font-weight: 600;">
                                            💰 Earn from your entire network, up to 4 levels deep!
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ magic_link_url }}" style="display: inline-block; padding: 18px 50px; background-color: #8B4513; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                                            Access Your Dashboard →
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0 0 20px 0; color: #666; font-size: 14px; line-height: 1.6; text-align: center;">
                                This link will log you in automatically. No password needed!
                            </p>

                            <!-- Share Section -->
                            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">

                            <h3 style="margin: 0 0 15px 0; color: #8B4513; font-size: 20px; font-weight: 700; text-align: center;">
                                Start Sharing Today
                            </h3>

                            <p style="margin: 0 0 20px 0; color: #333; font-size: 15px; line-height: 1.6; text-align: center;">
                                Your personalized referral link:
                            </p>

                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 6px; margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 15px; text-align: center; font-family: 'Courier New', monospace; font-size: 14px; color: #8B4513; word-break: break-all;">
                                        {{ referral_link }}
                                    </td>
                                </tr>
                            </table>

                            <!-- Social Share Buttons -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                                <tr>
                                    <td align="center">
                                        <table cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td style="padding: 0 10px;">
                                                    <a href="https://www.facebook.com/sharer/sharer.php?u={{ referral_link_encoded }}" style="display: inline-block; width: 44px; height: 44px; background-color: #1877F2; border-radius: 50%; text-align: center; line-height: 44px; text-decoration: none;">
                                                        <span style="color: #ffffff; font-size: 20px;">f</span>
                                                    </a>
                                                </td>
                                                <td style="padding: 0 10px;">
                                                    <a href="https://twitter.com/intent/tweet?text=Check%20out%20Meatzy!&url={{ referral_link_encoded }}" style="display: inline-block; width: 44px; height: 44px; background-color: #1DA1F2; border-radius: 50%; text-align: center; line-height: 44px; text-decoration: none;">
                                                        <span style="color: #ffffff; font-size: 20px;">𝕏</span>
                                                    </a>
                                                </td>
                                                <td style="padding: 0 10px;">
                                                    <a href="https://api.whatsapp.com/send?text=Check%20out%20Meatzy!%20{{ referral_link_encoded }}" style="display: inline-block; width: 44px; height: 44px; background-color: #25D366; border-radius: 50%; text-align: center; line-height: 44px; text-decoration: none;">
                                                        <span style="color: #ffffff; font-size: 20px;">⚊</span>
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">

                            <!-- FAQs -->
                            <h3 style="margin: 0 0 15px 0; color: #8B4513; font-size: 18px; font-weight: 700;">
                                Quick Questions:
                            </h3>

                            <p style="margin: 0 0 10px 0; color: #333; font-size: 14px;">
                                <strong>When do I get paid?</strong><br>
                                Commissions become available after 30 days. Withdraw when you reach $100.
                            </p>

                            <p style="margin: 0 0 10px 0; color: #333; font-size: 14px;">
                                <strong>How do I track my earnings?</strong><br>
                                Log in to your dashboard to see real-time commissions and referrals.
                            </p>

                            <p style="margin: 0 0 10px 0; color: #333; font-size: 14px;">
                                <strong>Need help?</strong><br>
                                Email us at <a href="mailto:support@goodranchers.com" style="color: #8B4513;">support@goodranchers.com</a>
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
                            <p style="margin: 0 0 10px 0; color: #666; font-size: 12px;">
                                Meatzy by Good Ranchers<br>
                                Premium American Meat, Delivered
                            </p>
                            <p style="margin: 0; color: #999; font-size: 11px;">
                                You're receiving this because you made a purchase with Meatzy.<br>
                                <a href="{{ unsubscribe_link }}" style="color: #999; text-decoration: underline;">Unsubscribe</a>
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>
```

---

## Klaviyo Setup Instructions

### 1. **Create Flow in Klaviyo**

1. Go to **Flows** → **Create Flow** → **Create From Scratch**
2. Name it: "Affiliate Welcome - After Purchase"
3. Trigger: **Metric** → "Placed Order" (from Shopify)

### 2. **Add Conditional Split** (Optional)

Only send to first-time customers:
- **Condition**: `Placed Order` = 1 time

### 3. **Add Email**

- Drag email action into flow
- Use template above
- Subject: One of the options listed

### 4. **Dynamic Variables** (Klaviyo)

Replace these placeholders with Klaviyo variables:

| Placeholder | Klaviyo Variable |
|------------|------------------|
| `{{ first_name }}` | `{{ person.first_name }}` |
| `{{ referral_code }}` | `{{ event.properties.referral_code }}` * |
| `{{ referral_link }}` | `https://goodranchers.com?ref={{ event.properties.referral_code }}` |
| `{{ referral_link_encoded }}` | URL-encoded version of above |
| `{{ magic_link_url }}` | Generated by your webhook ** |

\* **Important**: Your webhook needs to send `referral_code` as a custom property

\*\* **Magic Link**: We'll cover this below

---

## Sending Custom Data from Webhook

Update your Shopify webhook to send data to Klaviyo:

```typescript
// In app/api/webhooks/shopify/order/route.ts

async function sendToKlaviyo(customer: any, referralCode: string) {
  const klaviyoApiKey = process.env.KLAVIYO_API_KEY;

  await fetch('https://a.klaviyo.com/api/events/', {
    method: 'POST',
    headers: {
      'Authorization': `Klaviyo-API-Key ${klaviyoApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        type: 'event',
        attributes: {
          profile: {
            $email: customer.email,
            $first_name: customer.firstName,
            $last_name: customer.lastName,
          },
          metric: {
            name: 'Affiliate Account Created',
          },
          properties: {
            referral_code: referralCode,
            referral_link: `https://goodranchers.com?ref=${referralCode}`,
            dashboard_url: 'https://goodranchers.com/dashboard',
          },
        },
      },
    }),
  });
}
```

---

## Magic Link Integration

### Option 1: Supabase Magic Link (Automatic)

Supabase will send the magic link email automatically. Customize in Supabase dashboard:
- **Settings** → **Auth** → **Email Templates**
- Edit "Magic Link" template

### Option 2: Custom Magic Link via Klaviyo

Generate magic link in webhook and send to Klaviyo:

```typescript
// In webhook
const { data: magicLinkData } = await supabaseAdmin.auth.admin.generateLink({
  type: 'magiclink',
  email: customer.email,
  options: {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
  },
});

const magicLinkUrl = magicLinkData.properties.action_link;

// Send to Klaviyo with magic_link_url property
```

---

## Testing Checklist

- [ ] Create test order in Shopify
- [ ] Verify email is received
- [ ] Check referral code displays correctly
- [ ] Test magic link login
- [ ] Verify dashboard access
- [ ] Test share buttons
- [ ] Test on mobile devices

---

## Email Performance Tips

1. **Subject Line A/B Test**:
   - Version A: "🥩 Your Meatzy referral code is ready!"
   - Version B: "Share Meatzy & earn 13% commission"

2. **Send Time**: Immediately after order (within 5 minutes)

3. **Follow-up Sequence**:
   - Day 3: "Have you shared your link yet?"
   - Day 7: "Your first commission: How to earn"
   - Day 30: "Ready to withdraw? You've earned $X"

4. **Personalization**:
   - Use first name
   - Show order details
   - Reference their box type

---

## Next Steps

1. Set up Klaviyo flow with this template
2. Add `KLAVIYO_API_KEY` to environment variables
3. Update webhook to send data to Klaviyo
4. Test with a real order
5. Monitor open rates and conversions

**Your customers will now become affiliates automatically!** 🚀
