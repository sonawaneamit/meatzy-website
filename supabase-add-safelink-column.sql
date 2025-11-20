-- =====================================================
-- Add SafeLink Column to Users Table
-- =====================================================
-- This adds a computed safe_link column that stores the full SafeLink URL
-- for easy access by customer support
-- =====================================================

-- Add the safe_link column
ALTER TABLE users
ADD COLUMN IF NOT EXISTS safe_link TEXT;

-- Populate existing users with their SafeLinks
UPDATE users
SET safe_link = 'https://getmeatzy.com/go/' || slug
WHERE slug IS NOT NULL;

-- Create a function to automatically update safe_link when slug changes
CREATE OR REPLACE FUNCTION update_safe_link()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NOT NULL THEN
    NEW.safe_link := 'https://getmeatzy.com/go/' || NEW.slug;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update safe_link
DROP TRIGGER IF EXISTS trigger_update_safe_link ON users;
CREATE TRIGGER trigger_update_safe_link
  BEFORE INSERT OR UPDATE OF slug ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_safe_link();

-- Add comment for documentation
COMMENT ON COLUMN users.safe_link IS 'Full SafeLink URL (auto-generated from slug): https://getmeatzy.com/go/{slug}';

-- =====================================================
-- DONE! Now run this SQL in Supabase SQL Editor
-- =====================================================
