-- MEATZY REFERRAL SYSTEM DATABASE SCHEMA
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,

  -- Referral tracking
  referral_code TEXT UNIQUE NOT NULL,
  referrer_id UUID REFERENCES users(id),

  -- Shopify integration
  shopify_customer_id TEXT UNIQUE,

  -- Status
  is_active BOOLEAN DEFAULT true,
  has_purchased BOOLEAN DEFAULT false,

  -- Commission settings
  commission_rate DECIMAL(3,2) DEFAULT 1.0, -- 1.0 = 100%, 0.5 = 50%
  commission_override DECIMAL(3,2), -- Manual override by admin

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_referrer_id ON users(referrer_id);
CREATE INDEX idx_users_shopify_customer_id ON users(shopify_customer_id);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- USER TREE (for efficient ancestor queries)
-- ============================================
CREATE TABLE user_tree (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ancestor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 4),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, ancestor_id, level)
);

-- Indexes for tree queries
CREATE INDEX idx_user_tree_user_id ON user_tree(user_id);
CREATE INDEX idx_user_tree_ancestor_id ON user_tree(ancestor_id);
CREATE INDEX idx_user_tree_level ON user_tree(level);

-- ============================================
-- SUBSCRIPTIONS
-- ============================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Shopify data
  shopify_subscription_id TEXT UNIQUE,
  shopify_order_id TEXT,

  -- Subscription details
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  box_type TEXT CHECK (box_type IN ('custom', 'curated')),
  frequency TEXT, -- weekly, biweekly, monthly, every-2-months

  -- Tracking
  paused_since TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  next_shipment_date TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_shopify_subscription_id ON subscriptions(shopify_subscription_id);

-- ============================================
-- COMMISSIONS
-- ============================================
CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Who earns
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- What triggered it
  order_id TEXT NOT NULL, -- Shopify order ID
  referred_user_id UUID NOT NULL REFERENCES users(id),

  -- Commission details
  tier_level INTEGER NOT NULL CHECK (tier_level BETWEEN 1 AND 4),
  base_percentage DECIMAL(4,2) NOT NULL, -- 13.00, 2.00, 1.00, 1.00
  applied_rate DECIMAL(3,2) NOT NULL DEFAULT 1.0, -- User's commission rate (1.0 or 0.5)

  -- Amounts
  order_total DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,

  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_commissions_user_id ON commissions(user_id);
CREATE INDEX idx_commissions_order_id ON commissions(order_id);
CREATE INDEX idx_commissions_status ON commissions(status);
CREATE INDEX idx_commissions_referred_user_id ON commissions(referred_user_id);

-- ============================================
-- WALLET
-- ============================================
CREATE TABLE wallet (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Balances
  available_balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  pending_balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_earned DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_withdrawn DECIMAL(10,2) NOT NULL DEFAULT 0.00,

  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_wallet_user_id ON wallet(user_id);

-- ============================================
-- WITHDRAWALS
-- ============================================
CREATE TABLE withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  amount DECIMAL(10,2) NOT NULL,
  paypal_email TEXT,

  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),

  notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);

-- ============================================
-- DISCOUNT CODES (for first purchase tracking)
-- ============================================
CREATE TABLE discount_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  code TEXT UNIQUE NOT NULL,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 10.00,
  discount_type TEXT NOT NULL DEFAULT 'fixed' CHECK (discount_type IN ('fixed', 'percentage')),

  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_discount_codes_user_id ON discount_codes(user_id);
CREATE INDEX idx_discount_codes_code ON discount_codes(code);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));

    -- Check if it exists
    SELECT EXISTS(SELECT 1 FROM users WHERE referral_code = code) INTO exists;

    EXIT WHEN NOT exists;
  END LOOP;

  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to update user tree when new user signs up
CREATE OR REPLACE FUNCTION update_user_tree()
RETURNS TRIGGER AS $$
DECLARE
  ancestor_record RECORD;
  current_level INTEGER;
BEGIN
  -- If user has a referrer
  IF NEW.referrer_id IS NOT NULL THEN

    -- Add direct referrer (level 1)
    INSERT INTO user_tree (user_id, ancestor_id, level)
    VALUES (NEW.id, NEW.referrer_id, 1);

    -- Add referrer's ancestors (levels 2-4)
    FOR ancestor_record IN
      SELECT ancestor_id, level
      FROM user_tree
      WHERE user_id = NEW.referrer_id
      AND level < 4
    LOOP
      current_level := ancestor_record.level + 1;

      INSERT INTO user_tree (user_id, ancestor_id, level)
      VALUES (NEW.id, ancestor_record.ancestor_id, current_level);
    END LOOP;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update user tree
CREATE TRIGGER trigger_update_user_tree
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION update_user_tree();

-- Function to create wallet for new user
CREATE OR REPLACE FUNCTION create_wallet_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO wallet (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically create wallet
CREATE TRIGGER trigger_create_wallet
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION create_wallet_for_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallet_updated_at BEFORE UPDATE ON wallet
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tree ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own data" ON users
FOR SELECT USING (auth.uid() = id);

-- Users can view their direct referrals (level 1)
CREATE POLICY "Users can view direct referrals" ON users
FOR SELECT USING (
  id IN (
    SELECT user_id FROM user_tree
    WHERE ancestor_id = auth.uid() AND level = 1
  )
);

-- Users can view their tree
CREATE POLICY "Users can view own tree" ON user_tree
FOR SELECT USING (
  ancestor_id = auth.uid()
  OR user_id = auth.uid()
);

-- Users can view own subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions
FOR SELECT USING (user_id = auth.uid());

-- Users can view own commissions
CREATE POLICY "Users can view own commissions" ON commissions
FOR SELECT USING (user_id = auth.uid());

-- Users can view own wallet
CREATE POLICY "Users can view own wallet" ON wallet
FOR SELECT USING (user_id = auth.uid());

-- Users can view own withdrawals
CREATE POLICY "Users can view own withdrawals" ON withdrawals
FOR SELECT USING (user_id = auth.uid());

-- ============================================
-- SAMPLE DATA (for testing)
-- ============================================

-- Create a test user
-- INSERT INTO users (email, full_name, referral_code, has_purchased, commission_rate)
-- VALUES ('test@meatzy.com', 'Test User', 'TEST1234', true, 1.0);
