# Account Creation Implementation - Summary

## What Was Implemented

We've successfully implemented the Supabase Auth account creation flow for the referral system. When a new customer makes their first purchase through Shopify, the webhook will:

1. Create a user record in the `users` table (for referral tracking)
2. Attempt to create an auth account in Supabase Auth
3. Send a password setup email to the customer

## Files Modified

### 1. `/app/api/webhooks/shopify/order/route.ts`

**Changes:**
- Added `isNewUser` flag to track if this is a first-time customer
- Updated to call `sendPasswordSetupEmail()` for new users only
- Implemented `sendPasswordSetupEmail()` function that:
  - Creates the user in Supabase Auth with `email_confirm: true`
  - Generates a password recovery link (serves as initial password setup)
  - Sends the link via Supabase's built-in email system

**Key Code:**
```typescript
// Step 4: Send password setup email for new customers
if (isNewUser) {
  try {
    await sendPasswordSetupEmail(supabaseAdmin, user.email, user.referral_code);
    console.log('Sent password setup email to:', user.email);
  } catch (emailError) {
    console.error('Failed to send password setup email:', emailError);
    // Don't fail the webhook if email fails
  }
}
```

### 2. `.env.local`

**Added:**
```
NEXT_PUBLIC_SITE_URL=https://meatzy-website.vercel.app
```

This is used for the email redirect URL after password setup.

### 3. Test Script: `/scripts/test-password-setup.js`

Created a comprehensive test script to validate the password setup flow.

### 4. Documentation: `/docs/SUPABASE-AUTH-SETUP.md`

Complete setup guide explaining the Supabase Auth configuration.

## Current Issue: Database Trigger Conflict

**Problem:**
When trying to create a user in Supabase Auth, we get:
```
Database error creating new user
```

**Root Cause:**
Supabase likely has a database trigger that automatically creates a row in `public.users` when an auth user is created. This conflicts with our custom `users` table that already has a row for the customer.

## Solution Required

You need to configure Supabase to properly sync between `auth.users` and `public.users`. Here are the steps:

### Step 1: Check for Existing Triggers

1. Go to Supabase Dashboard → SQL Editor
2. Run this query:

```sql
SELECT
  trigger_name,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
  AND event_object_table = 'users';
```

### Step 2: Create or Update the Trigger

Option A: If there's NO trigger, you need to create one:

```sql
-- Function to handle new auth users
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into public.users, but use ON CONFLICT to handle existing users
  INSERT INTO public.users (
    id,
    email,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    NOW(),
    NOW()
  )
  ON CONFLICT (email) DO UPDATE
  SET
    id = NEW.id,  -- Update the auth ID
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger that fires when auth user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_auth_user();
```

Option B: If there IS a trigger, modify it to use `ON CONFLICT`:

```sql
-- Update existing function to handle conflicts
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at, updated_at)
  VALUES (NEW.id, NEW.email, NOW(), NOW())
  ON CONFLICT (email) DO UPDATE
  SET id = NEW.id, updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Step 3: Test the Fix

After updating the trigger, test with:

```bash
cd "/Users/amitsonawane/Desktop/Meatzy Website/meatzy-final"
NEXT_PUBLIC_SUPABASE_URL=https://ezgfwukgtdlynabdcucz.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=sb_secret_anAFEVQlaJwtylb7mfVJBQ_TdI99qW5 \
NEXT_PUBLIC_SITE_URL=https://meatzy-website.vercel.app \
node scripts/test-password-setup.js
```

You should see:
```
✅ Auth user created: [user-id]
✅ Password setup link generated!
📧 Email sent to: amitsonawane@me.com
```

## Email Template Customization

After fixing the database trigger, customize the password reset email:

1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **Email Templates**
3. Select **Reset Password** (this is what's used for password setup)
4. Update the template with MEATZY branding

**Suggested Template:**

**Subject:** `Welcome to MEATZY - Set Up Your Account`

**Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #2D2B25; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2D2B25; color: white; padding: 30px; text-align: center; }
    .content { background: white; padding: 30px; }
    .button {
      background: #C54A4A;
      color: white;
      padding: 15px 30px;
      text-decoration: none;
      border-radius: 8px;
      display: inline-block;
      font-weight: bold;
    }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🥩 Welcome to MEATZY!</h1>
    </div>

    <div class="content">
      <h2>Thanks for your purchase!</h2>

      <p>We've created an account for you to track your referrals and earn commissions on every sale.</p>

      <p><strong>Your Referral Code:</strong> {{ .Data.referral_code }}</p>

      <p>Start earning <strong>13% commission</strong> on direct referrals, plus earn from your entire network (up to 4 levels deep)!</p>

      <p style="text-align: center; margin: 30px 0;">
        <a href="{{ .ConfirmationURL }}" class="button">Set Password & Access Dashboard</a>
      </p>

      <p style="color: #666; font-size: 14px;">
        Or copy this link:<br>
        <code style="background: #f4f4f4; padding: 10px; display: block; margin-top: 10px; word-break: break-all;">{{ .ConfirmationURL }}</code>
      </p>

      <h3>What's Next?</h3>
      <ul>
        <li>Set your password using the button above</li>
        <li>Access your dashboard to view your referral link and QR code</li>
        <li>Share your link with friends and start earning!</li>
        <li>Track your commissions and network growth in real-time</li>
      </ul>
    </div>

    <div class="footer">
      <p>Premium Grass-Fed Meat Delivered Fresh</p>
      <p>Questions? Email us at support@getmeatzy.com</p>
    </div>
  </div>
</body>
</html>
```

## Production Deployment

### Vercel Environment Variables

Make sure these are set in your Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=https://ezgfwukgtdlynabdcucz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_IjT_eKYOcY7g4UP4-u65Yg_uiSLr76t
SUPABASE_SERVICE_ROLE_KEY=sb_secret_anAFEVQlaJwtylb7mfVJBQ_TdI99qW5
NEXT_PUBLIC_SITE_URL=https://meatzy-website.vercel.app
SHOPIFY_WEBHOOK_SECRET=7ebb4b936402797f80d42b68290c82935c3e3b02706b47646ef2c314adda24c2
```

### Testing in Production

1. Fix the Supabase database trigger (see Step 2 above)
2. Deploy the updated code to Vercel
3. Place a test order through Shopify (NOT test mode - real order)
4. Check the webhook logs in Vercel
5. Check your email for the password setup message
6. Click the link and set your password
7. Verify you can access the dashboard

## User Flow

Here's what customers will experience:

1. **Purchase** → Customer completes checkout on Shopify
2. **Redirect** → After order confirmation, redirected to `/thank-you` page
3. **Referral Widget** → See their referral link, QR code, and social sharing buttons
4. **Email** → Receive "Welcome to MEATZY - Set Up Your Account" email
5. **Set Password** → Click link in email → Set password
6. **Dashboard** → Redirected to dashboard to track earnings

## Next Steps

1. ✅ Implement password setup email flow (DONE)
2. ⏳ Fix Supabase database trigger (NEEDS YOUR ACTION)
3. ⏳ Customize email template in Supabase
4. ⏳ Test with real order in production
5. ⏳ Fix Shopify redirect (separate issue - test mode limitation)

## Support

If you need help with the database trigger setup, you can:
1. Check Supabase Discord/Forums
2. Review Supabase docs on Auth Triggers
3. Contact Supabase support with your project details
