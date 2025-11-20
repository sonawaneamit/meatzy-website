-- =====================================================
-- Commission Automation Database Functions
-- =====================================================
-- These functions support automatic commission approval
-- and reversal based on Shopify order fulfillment status
-- =====================================================

-- Function 1: Approve Commission
-- Moves amount from pending_balance → available_balance
-- Also adds to lifetime_earnings
CREATE OR REPLACE FUNCTION approve_commission(
  p_user_id UUID,
  p_amount DECIMAL
)
RETURNS VOID AS $$
BEGIN
  -- Insert wallet record if it doesn't exist
  INSERT INTO wallet (user_id, pending_balance, available_balance, lifetime_earnings)
  VALUES (p_user_id, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;

  -- Move from pending → available and add to lifetime
  UPDATE wallet
  SET
    pending_balance = pending_balance - p_amount,
    available_balance = available_balance + p_amount,
    lifetime_earnings = lifetime_earnings + p_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function 2: Decrement Pending Balance
-- Subtracts amount from pending_balance (for cancelled pending commissions)
CREATE OR REPLACE FUNCTION decrement_pending_balance(
  p_user_id UUID,
  p_amount DECIMAL
)
RETURNS VOID AS $$
BEGIN
  -- Insert wallet record if it doesn't exist
  INSERT INTO wallet (user_id, pending_balance, available_balance, lifetime_earnings)
  VALUES (p_user_id, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;

  -- Subtract from pending balance
  UPDATE wallet
  SET
    pending_balance = GREATEST(0, pending_balance - p_amount),
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function 3: Reverse Approved Commission
-- Subtracts from available_balance and lifetime_earnings (for cancelled approved commissions)
CREATE OR REPLACE FUNCTION reverse_approved_commission(
  p_user_id UUID,
  p_amount DECIMAL
)
RETURNS VOID AS $$
BEGIN
  -- Insert wallet record if it doesn't exist
  INSERT INTO wallet (user_id, pending_balance, available_balance, lifetime_earnings)
  VALUES (p_user_id, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;

  -- Subtract from available balance and lifetime earnings
  UPDATE wallet
  SET
    available_balance = GREATEST(0, available_balance - p_amount),
    lifetime_earnings = GREATEST(0, lifetime_earnings - p_amount),
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Add new columns to commissions table
-- =====================================================
-- Add approved_at and cancelled_at timestamps
ALTER TABLE commissions
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;

-- =====================================================
-- DONE! Now run this SQL in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql
-- =====================================================
