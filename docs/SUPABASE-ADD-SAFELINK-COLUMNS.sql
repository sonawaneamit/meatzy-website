-- ============================================================================
-- ADD SAFELINK AND DISCOUNT CODE COLUMNS TO USERS TABLE
-- ============================================================================
-- This SQL adds columns for SafeLink slugs and Shopify discount codes
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================================

-- Add slug column for SafeLinks (e.g., "natalia-8c4f")
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Add discount code column (stores Shopify discount code like "REF-ABC12345")
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS shopify_discount_code TEXT;

-- Add timestamp for when discount was created
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS discount_created_at TIMESTAMP WITH TIME ZONE;

-- Add comments to explain the columns
COMMENT ON COLUMN public.users.slug IS 'Human-readable SafeLink slug for referral URLs (e.g., getmeatzy.com/go/natalia-8c4f)';
COMMENT ON COLUMN public.users.shopify_discount_code IS 'Shopify discount code created for this affiliate (e.g., REF-ABC12345)';
COMMENT ON COLUMN public.users.discount_created_at IS 'Timestamp when the Shopify discount code was created';

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_slug ON public.users(slug);
CREATE INDEX IF NOT EXISTS idx_users_shopify_discount_code ON public.users(shopify_discount_code);

-- Verify the columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'users'
  AND column_name IN ('slug', 'shopify_discount_code', 'discount_created_at')
ORDER BY column_name;

-- Expected output:
-- column_name             | data_type                   | is_nullable
-- ------------------------|----------------------------|-------------
-- discount_created_at     | timestamp with time zone   | YES
-- shopify_discount_code   | text                       | YES
-- slug                    | text                       | YES

-- ============================================================================
-- DONE! The columns will be populated:
-- 1. slug: Generated and backfilled for all existing users
-- 2. shopify_discount_code: Created on-demand when user's SafeLink is first used
-- 3. discount_created_at: Set when discount code is created
-- ============================================================================
