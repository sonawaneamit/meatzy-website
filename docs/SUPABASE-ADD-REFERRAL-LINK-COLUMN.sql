-- ============================================================================
-- ADD REFERRAL_LINK COLUMN TO USERS TABLE
-- ============================================================================
-- This SQL adds a referral_link column to store the full referral URL
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================================

-- Add referral_link column to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS referral_link TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN public.users.referral_link IS 'Full referral link URL (e.g., https://getmeatzy.com?ref=ABC123) - stored for customer support lookups';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_referral_link ON public.users(referral_link);

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'users'
  AND column_name = 'referral_link';

-- Expected output:
-- column_name: referral_link
-- data_type: text
-- is_nullable: YES

-- ============================================================================
-- DONE! The referral_link will now be automatically stored when:
-- 1. Users visit the thank you page after purchase
-- 2. Users log in to their dashboard
-- 3. Customer support needs to look up their link
-- ============================================================================
