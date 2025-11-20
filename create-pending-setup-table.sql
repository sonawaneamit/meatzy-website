-- Create table to temporarily store webhook data before user authenticates
-- This allows us to work WITH Supabase's auth trigger instead of against it

CREATE TABLE IF NOT EXISTS pending_user_setup (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  referral_code TEXT,
  referred_by_code TEXT,
  shopify_customer_id TEXT,
  shopify_order_id TEXT,
  order_total DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- Create index for fast email lookups
CREATE INDEX IF NOT EXISTS idx_pending_setup_email ON pending_user_setup(email);

-- Auto-delete expired records
CREATE OR REPLACE FUNCTION delete_expired_pending_setups()
RETURNS void AS $$
BEGIN
  DELETE FROM pending_user_setup WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- You can run this periodically or set up a cron job
-- For now, run manually: SELECT delete_expired_pending_setups();
