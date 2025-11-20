-- Check if there's a trigger that auto-creates users records from auth.users
-- Run this in Supabase SQL Editor

-- Check for triggers on auth schema
SELECT
    trigger_schema,
    trigger_name,
    event_object_schema,
    event_object_table,
    action_statement,
    action_timing
FROM information_schema.triggers
WHERE trigger_schema = 'auth' OR event_object_schema = 'auth'
ORDER BY trigger_name;

-- Check for functions that might be handling user creation
SELECT
    routine_schema,
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema IN ('auth', 'public')
AND routine_name LIKE '%user%'
ORDER BY routine_name;

-- Check if there's a function called handle_new_user or similar
SELECT proname, prosrc
FROM pg_proc
WHERE proname LIKE '%user%'
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
