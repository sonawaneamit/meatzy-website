-- Fix for database trigger issue: Make referral_code nullable
-- Run this SQL in Supabase SQL Editor

-- Make referral_code nullable so the trigger can create users without it
ALTER TABLE users
ALTER COLUMN referral_code DROP NOT NULL;

-- Make sure email is the only required field for the trigger to work
-- All other fields should be nullable or have defaults

-- Verify the changes
SELECT
    column_name,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN ('referral_code', 'email', 'full_name')
ORDER BY column_name;
