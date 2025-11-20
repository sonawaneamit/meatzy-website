-- Alternative approach: Disable the auth trigger entirely
-- We'll manage users creation manually in our application code

-- Step 1: Find and drop the existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Verify it's gone
SELECT
    trigger_name,
    event_object_table
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
   AND event_object_table = 'users';

-- This should return no rows if the trigger was successfully dropped

-- IMPORTANT: With no trigger, you need to manually create users records
-- Our dashboard already does this in the completePendingSetup function!
--
-- Flow without trigger:
-- 1. Webhook creates pending_user_setup record
-- 2. Magic link sent
-- 3. User clicks -> auth.users created (NO trigger, NO users record)
-- 4. Dashboard detects new_user=true
-- 5. Dashboard calls completePendingSetup which:
--    a. Reads pending_user_setup
--    b. MANUALLY creates users record (not via trigger)
--    c. Calculates commissions
--    d. Deletes pending_user_setup

-- This is actually cleaner because we have full control!
