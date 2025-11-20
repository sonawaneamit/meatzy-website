-- Fix Supabase's auth trigger to do UPSERT instead of INSERT
-- This allows webhook to create users record first, and auth creation to update it

-- Step 1: Find the existing trigger and function
SELECT
    trigger_name,
    event_object_table,
    action_statement,
    action_timing,
    event_manipulation
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
   AND event_object_table = 'users'
ORDER BY trigger_name;

-- Step 2: Find the function that handles new user creation
SELECT
    proname as function_name,
    prosrc as function_body
FROM pg_proc
WHERE proname LIKE '%user%'
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY proname;

-- Step 3: Create or replace the trigger function to do UPSERT
-- This function will be called when a new auth.users record is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Use INSERT ... ON CONFLICT to upsert instead of just insert
  INSERT INTO public.users (id, email, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NOW(),
    NOW()
  )
  ON CONFLICT (email)
  DO UPDATE SET
    id = EXCLUDED.id,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Create the trigger if it doesn't exist
-- If it already exists, you'll need to drop it first and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Verify the trigger was created
SELECT
    trigger_name,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- IMPORTANT NOTES:
-- 1. This trigger now does UPSERT on email, not just INSERT
-- 2. If a users record exists with that email, it updates the ID to match auth.users
-- 3. This allows webhook to create users record first, then auth creation updates it
-- 4. The ON CONFLICT clause prevents the "duplicate key" error
