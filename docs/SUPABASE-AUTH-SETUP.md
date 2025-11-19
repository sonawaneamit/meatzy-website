# Supabase Auth Setup for Account Creation

## Overview

When a new customer makes their first purchase through Shopify, we need to:
1. Create their record in the `users` table (for referral tracking)
2. Create their auth account in Supabase Auth (for dashboard login)
3. Send them a password setup email

## Current Issue

Supabase Auth likely has a database trigger that automatically creates a row in `public.users` when an auth user is created. This conflicts with our custom `users` table that's used for the referral system.

## Solution Options

### Option 1: Use Auth User ID as Primary Key (Recommended)

Modify the `users` table to use Supabase Auth's user ID as the primary key instead of generating our own UUIDs.

**Steps:**
1. In Supabase Dashboard, go to SQL Editor
2. Run this migration:

```sql
-- First, check if there are any database triggers that create users
SELECT * FROM information_schema.triggers WHERE event_object_table = 'users';

-- Disable the trigger if it exists (example name - check your actual trigger name)
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- If you need to recreate the table structure:
-- The users table should use auth.uid() as the primary key
-- This way, when Supabase Auth creates a user, it will use the same ID
```

### Option 2: Database Trigger to Sync Auth and Users Table

Create a database trigger that syncs `auth.users` with `public.users`:

```sql
-- Function to create user record when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at, updated_at)
  VALUES (NEW.id, NEW.email, NOW(), NOW())
  ON CONFLICT (id) DO NOTHING; -- Don't fail if user already exists

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger that fires after auth user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_auth_user();
```

### Option 3: Skip Auth User Creation if User Exists

Modify the webhook to only create an auth user if the user doesn't already exist in the users table:

```typescript
async function sendPasswordSetupEmail(supabaseAdmin: any, email: string, referralCode: string) {
  // Check if user already exists in auth
  const { data: existingAuthUser } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1,
  });

  // Search for user by email
  const authUser = existingAuthUser?.users?.find((u: any) => u.email === email);

  if (!authUser) {
    // Create auth user only if they don't exist
    const { error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        referral_code: referralCode,
      },
    });

    if (signUpError) {
      console.error('Error creating auth user:', signUpError);
      // Continue anyway to send password reset link
    }
  }

  // Always try to send password setup link (recovery email)
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
    },
  });

  if (error) {
    throw error;
  }

  console.log(`Password setup email sent to ${email}`);
}
```

## Testing

Once the database trigger issue is resolved, test with:

```bash
cd "/Users/amitsonawane/Desktop/Meatzy Website/meatzy-final"
NEXT_PUBLIC_SUPABASE_URL=https://ezgfwukgtdlynabdcucz.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=sb_secret_anAFEVQlaJwtylb7mfVJBQ_TdI99qW5 \
NEXT_PUBLIC_SITE_URL=https://meatzy-website.vercel.app \
node scripts/test-password-setup.js
```

## Email Template Customization

To customize the password reset email template:

1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **Email Templates**
3. Select **Reset Password** template
4. Customize the HTML and subject line with your branding
5. Make sure to include `{{ .ConfirmationURL }}` in the template

**Suggested Email Content:**

```html
<h2>Welcome to MEATZY!</h2>
<p>Thanks for your purchase! We've created an account for you to track your referrals and commissions.</p>
<p><strong>Your Referral Code:</strong> {{ .Data.referral_code }}</p>
<p>Click the button below to set your password and access your dashboard:</p>
<a href="{{ .ConfirmationURL }}" style="background: #2D2B25; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Set Password & Access Dashboard</a>
<p>Or copy this link: {{ .ConfirmationURL }}</p>
<p>Start earning 13% commission on every referral!</p>
```

## Webhook Environment Variables

Make sure these are set in your production environment (Vercel):

```
NEXT_PUBLIC_SUPABASE_URL=https://ezgfwukgtdlynabdcucz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_anAFEVQlaJwtylb7mfVJBQ_TdI99qW5
NEXT_PUBLIC_SITE_URL=https://meatzy-website.vercel.app
SHOPIFY_WEBHOOK_SECRET=7ebb4b936402797f80d42b68290c82935c3e3b02706b47646ef2c314adda24c2
```

## Next Steps

1. Check for existing database triggers in Supabase
2. Implement one of the solution options above
3. Test with the test script
4. Customize the email template
5. Deploy to production and test with a real order
