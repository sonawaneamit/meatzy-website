-- Add missing columns for temporary password functionality
-- Run this in Supabase SQL Editor

ALTER TABLE users
ADD COLUMN IF NOT EXISTS temporary_password TEXT,
ADD COLUMN IF NOT EXISTS requires_password_change BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Add index for slug lookups
CREATE INDEX IF NOT EXISTS idx_users_slug ON users(slug);

-- Add comment for documentation
COMMENT ON COLUMN users.temporary_password IS 'Temporary password shown on thank-you page, should be null after first login';
COMMENT ON COLUMN users.requires_password_change IS 'True if user needs to change password on first login';
COMMENT ON COLUMN users.slug IS 'Human-readable slug for SafeLinks (e.g., natalia-8c4f)';
