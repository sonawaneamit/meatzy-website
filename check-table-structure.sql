-- Run this SQL in Supabase SQL Editor to check table constraints

-- Check users table structure
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Check for NOT NULL constraints on users table
SELECT
    column_name,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
AND is_nullable = 'NO'
AND column_default IS NULL;

-- Check for triggers on auth.users
SELECT
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
AND event_object_schema = 'auth';
