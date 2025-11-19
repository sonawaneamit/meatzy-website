-- ============================================================================
-- SUPABASE AUTH TRIGGER FIX
-- ============================================================================
-- This SQL fixes the database trigger that syncs auth.users with public.users
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================================

-- Step 1: Check current triggers (for debugging)
-- Uncomment to see what triggers currently exist:
-- SELECT
--   trigger_name,
--   event_object_table,
--   action_timing,
--   event_manipulation,
--   action_statement
-- FROM information_schema.triggers
-- WHERE event_object_schema = 'auth'
--   OR event_object_table = 'users';

-- Step 2: Drop the existing trigger function (if it exists)
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_auth_user() CASCADE;

-- Step 3: Create the updated trigger function with ON CONFLICT
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert new user into public.users
  -- Use ON CONFLICT to handle cases where user already exists
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
  ON CONFLICT (email)
  DO UPDATE SET
    id = EXCLUDED.id,           -- Update to use the auth user ID
    updated_at = EXCLUDED.updated_at;

  RETURN NEW;
END;
$$;

-- Step 4: Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_auth_user();

-- Step 5: Verify the trigger was created
SELECT
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Expected output:
-- trigger_name: on_auth_user_created
-- event_object_table: users
-- action_timing: AFTER
-- event_manipulation: INSERT

-- ============================================================================
-- DONE! Now test by running:
-- cd "/Users/amitsonawane/Desktop/Meatzy Website/meatzy-final"
-- NEXT_PUBLIC_SUPABASE_URL=https://ezgfwukgtdlynabdcucz.supabase.co \
-- SUPABASE_SERVICE_ROLE_KEY=sb_secret_anAFEVQlaJwtylb7mfVJBQ_TdI99qW5 \
-- node scripts/diagnose-supabase.js
-- ============================================================================
