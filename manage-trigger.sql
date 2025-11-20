-- Find and manage the Supabase auth trigger
-- Run this SQL in Supabase SQL Editor

-- 1. Find the trigger that creates public.users from auth.users
SELECT
    trigger_name,
    event_object_table,
    action_statement,
    action_timing,
    event_manipulation
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
   OR action_statement LIKE '%public.users%'
ORDER BY trigger_name;

-- 2. List all functions that might be handling new user creation
SELECT
    proname as function_name,
    prosrc as function_body
FROM pg_proc
WHERE proname LIKE '%user%'
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY proname;

-- 3. If you find a trigger called something like "on_auth_user_created"
-- You can disable it with (UNCOMMENT AND MODIFY THE NAME):
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 4. Or if you want to keep it but modify it to not fail on duplicate emails:
-- ALTER TRIGGER trigger_name ... (depends on how it's set up)

-- FOR NOW, LET'S TRY A DIFFERENT APPROACH:
-- Add a function to handle auth user creation that won't fail on duplicates
