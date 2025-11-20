-- ============================================================================
-- CHECK REFERRAL LINKS - See which users have referral links
-- ============================================================================
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================================

-- Check users with referral links
SELECT
  email,
  referral_code,
  referral_link,
  created_at
FROM public.users
WHERE referral_link IS NOT NULL
ORDER BY created_at DESC;

-- This should show all users that have referral links populated
-- If you see your email (amitsonawane@me.com), it worked!

-- ============================================================================
-- If you want to see users WITHOUT referral links:
-- ============================================================================

SELECT
  email,
  referral_code,
  referral_link,
  created_at
FROM public.users
WHERE referral_code IS NOT NULL
  AND referral_link IS NULL
ORDER BY created_at DESC;

-- These are users with codes but no links (shouldn't exist after backfill)
