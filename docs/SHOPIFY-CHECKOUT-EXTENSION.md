# Shopify Plus Checkout Extension Setup Guide

This guide explains how to create a Shopify Plus post-purchase checkout extension that displays the customer's referral link after they complete a purchase.

## Prerequisites

- **Shopify Plus account** (required for checkout extensions)
- **Shopify CLI** installed
- **Partner Dashboard** access
- Node.js 18+ installed

## Architecture Overview

```
Customer completes purchase
    ↓
Shopify fires post-purchase event
    ↓
Extension loads (React component)
    ↓
Extension calls your API: /api/get-user-referral?email=customer@email.com
    ↓
API returns referral link + QR code
    ↓
Extension displays referral widget
```

## Step 1: Install Shopify CLI

```bash
npm install -g @shopify/cli @shopify/app
```

Verify installation:
```bash
shopify version
```

## Step 2: Create Shopify App

1. Go to your [Shopify Partner Dashboard](https://partners.shopify.com/)
2. Click "Apps" → "Create app"
3. Choose "Public app" or "Custom app" (for your store only)
4. Fill in app details:
   - **App name**: "Meatzy Referral Extension"
   - **App URL**: `https://getmeatzy.com`
   - **Allowed redirection URL(s)**: `https://getmeatzy.com/auth/callback`

## Step 3: Initialize Extension Project

Create a new directory for your extension:

```bash
mkdir meatzy-shopify-extension
cd meatzy-shopify-extension
shopify app init
```

Follow prompts:
- Select "checkout-ui-extension" as the extension type
- Choose "TypeScript + React" as the language
- Name it "referral-widget"

## Step 4: Configure Extension

Edit `shopify.app.toml`:

```toml
# Learn more about configuring your app at https://shopify.dev/docs/apps/tools/cli/configuration

name = "meatzy-referral-extension"
client_id = "YOUR_CLIENT_ID" # From partner dashboard
application_url = "https://getmeatzy.com"
embedded = true

[access_scopes]
# Required scopes for checkout extensions
scopes = "read_orders,read_customers"

[auth]
redirect_urls = [
  "https://getmeatzy.com/auth/callback"
]

[webhooks]
api_version = "2024-01"

[[extensions]]
type = "checkout_post_purchase"
name = "referral-widget"
handle = "referral-widget"

[extensions.settings]
# API endpoint for fetching referral data
api_url = "https://getmeatzy.com/api/get-user-referral"
```

## Step 5: Create Extension Component

Replace `extensions/referral-widget/src/index.tsx`:

```tsx
import React, { useState, useEffect } from 'react';
import {
  render,
  Banner,
  Button,
  Heading,
  Image,
  Text,
  TextBlock,
  BlockStack,
  InlineStack,
  useExtensionApi,
} from '@shopify/checkout-ui-extensions-react';

render('Checkout::PostPurchase::Render', () => <ReferralWidget />);

function ReferralWidget() {
  const { extensionPoint, shop, order } = useExtensionApi();
  const [loading, setLoading] = useState(true);
  const [referralData, setReferralData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const customerEmail = order.email;

      if (!customerEmail) {
        setError('No email found');
        setLoading(false);
        return;
      }

      // Call your API endpoint
      const response = await fetch(
        `https://getmeatzy.com/api/get-user-referral?email=${encodeURIComponent(customerEmail)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch referral data');
      }

      const data = await response.json();

      if (data.exists) {
        setReferralData(data);
      } else {
        // User doesn't exist yet - will be created by webhook
        setError('Creating your account...');
      }
    } catch (err) {
      console.error('Error fetching referral data:', err);
      setError('Unable to load referral link');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (referralData?.referralLink) {
      // Use Shopify's clipboard API
      extensionPoint.clipboard.writeText(referralData.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <BlockStack spacing="loose">
        <Text size="large">Loading your referral link...</Text>
      </BlockStack>
    );
  }

  if (error || !referralData) {
    return null; // Don't show widget if there's an error
  }

  return (
    <BlockStack spacing="loose">
      {/* Header */}
      <Banner status="success">
        <BlockStack spacing="tight">
          <Heading>Thank you for your order! 🎉</Heading>
          <Text>
            Share MEATZY with friends and earn{' '}
            <Text emphasis="bold">13% commission</Text> on every sale!
          </Text>
        </BlockStack>
      </Banner>

      {/* Referral Link Section */}
      <BlockStack spacing="base">
        <Heading level={2}>Your Referral Link</Heading>

        <TextBlock>
          <Text size="small" appearance="subdued">
            Share this link to start earning:
          </Text>
        </TextBlock>

        <InlineStack spacing="tight">
          <TextBlock>
            <Text appearance="info" emphasis="bold">
              {referralData.referralLink}
            </Text>
          </TextBlock>
        </InlineStack>

        <Button onPress={copyToClipboard} kind="primary">
          {copied ? '✓ Copied!' : 'Copy Link'}
        </Button>
      </BlockStack>

      {/* QR Code Section */}
      {referralData.qrCodeDataUrl && (
        <BlockStack spacing="base">
          <Heading level={2}>Share with QR Code</Heading>

          <Image
            source={referralData.qrCodeDataUrl}
            alt="Referral QR Code"
            aspectRatio={1}
          />

          <Text size="small" appearance="subdued">
            Scan this QR code to share your link
          </Text>
        </BlockStack>
      )}

      {/* Commission Info */}
      <Banner status="info">
        <BlockStack spacing="tight">
          <Text emphasis="bold">How it works:</Text>
          <Text size="small">
            • Earn 13% on direct referrals
          </Text>
          <Text size="small">
            • Earn 2% on 2nd level referrals
          </Text>
          <Text size="small">
            • Earn 1% on 3rd and 4th level referrals
          </Text>
          <Text size="small">
            • Track earnings in your dashboard
          </Text>
        </BlockStack>
      </Banner>

      {/* CTA to Dashboard */}
      <Button
        kind="secondary"
        onPress={() => {
          // Open dashboard in new tab
          extensionPoint.navigation.open('https://getmeatzy.com/dashboard');
        }}
      >
        View Dashboard
      </Button>
    </BlockStack>
  );
}
```

## Step 6: Configure Extension Settings

Create `extensions/referral-widget/shopify.extension.toml`:

```toml
type = "checkout_post_purchase"
name = "Meatzy Referral Widget"
handle = "referral-widget"

[settings]
[[settings.fields]]
key = "enabled"
type = "boolean"
name = "Enable Referral Widget"
description = "Show referral link to customers after purchase"

[[settings.fields]]
key = "commission_rate"
type = "number_decimal"
name = "Commission Rate"
description = "Direct referral commission percentage"

[settings.fields.validations]
min = 0
max = 100
```

## Step 7: Test Extension Locally

1. Start development server:
```bash
shopify app dev
```

2. Follow the URL to install the extension on your development store

3. Complete a test purchase and verify the widget appears

## Step 8: Deploy Extension

Once testing is complete:

```bash
shopify app deploy
```

Then submit for review in Partner Dashboard:
1. Go to "Apps" → Your app → "Extensions"
2. Click "Submit for review"
3. Wait for Shopify approval (usually 2-3 business days)

## Step 9: Configure Shopify Store

After approval:

1. Go to your Shopify admin
2. Navigate to **Settings** → **Checkout**
3. Scroll to **Post-purchase page**
4. Enable "Meatzy Referral Widget"
5. Save changes

## Testing Checklist

- [ ] Extension loads on post-purchase page
- [ ] API endpoint returns correct referral data
- [ ] Referral link displays correctly
- [ ] QR code renders properly
- [ ] Copy button works
- [ ] Dashboard link opens correctly
- [ ] Widget doesn't show if user doesn't exist yet
- [ ] Error handling works gracefully

## Troubleshooting

### Extension doesn't appear
- Verify Shopify Plus account
- Check extension is enabled in checkout settings
- Ensure extension is deployed and approved

### API returns 404
- Check API endpoint URL is correct
- Verify user exists in Supabase
- Check CORS settings if needed

### QR code doesn't load
- Verify QR code generation in API
- Check image data URL format
- Test with smaller QR code size

### Copy button doesn't work
- Use Shopify's clipboard API only
- Don't use browser `navigator.clipboard`

## CORS Configuration

If you encounter CORS issues, add to `next.config.js`:

```javascript
async headers() {
  return [
    {
      source: '/api/get-user-referral',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: 'https://checkout.shopify.com' },
        { key: 'Access-Control-Allow-Methods', value: 'GET' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
      ],
    },
  ];
}
```

## Security Considerations

1. **Rate Limiting**: Implement rate limiting on API endpoint
2. **Email Validation**: Validate email format before querying
3. **Error Messages**: Don't expose sensitive info in errors
4. **Service Role Key**: Keep `SUPABASE_SERVICE_ROLE_KEY` in environment variables only

## Support Resources

- [Shopify Checkout Extensions Docs](https://shopify.dev/docs/api/checkout-extensions)
- [Shopify CLI Reference](https://shopify.dev/docs/apps/tools/cli)
- [Post-Purchase Extension Tutorial](https://shopify.dev/docs/apps/checkout/post-purchase)
- [Checkout UI Extensions API](https://shopify.dev/docs/api/checkout-ui-extensions)

## Next Steps

After extension is live:
1. Monitor API logs for errors
2. Track conversion rate (orders → referrals activated)
3. Gather user feedback
4. Add analytics tracking
5. A/B test different messaging

---

**Questions?** Reach out to Shopify Partner Support or consult the Shopify dev community.
