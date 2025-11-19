-- Additional wallet functions for commission tracking
-- Run this in Supabase SQL Editor AFTER running the main schema

-- Function to increment pending balance
CREATE OR REPLACE FUNCTION increment_pending_balance(
  p_user_id UUID,
  p_amount DECIMAL(10,2)
)
RETURNS void AS $$
BEGIN
  UPDATE wallet
  SET
    pending_balance = pending_balance + p_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to approve commission and move from pending to available
CREATE OR REPLACE FUNCTION approve_commission(
  p_commission_id UUID
)
RETURNS void AS $$
DECLARE
  v_user_id UUID;
  v_amount DECIMAL(10,2);
BEGIN
  -- Get commission details
  SELECT user_id, commission_amount
  INTO v_user_id, v_amount
  FROM commissions
  WHERE id = p_commission_id;

  -- Update commission status
  UPDATE commissions
  SET
    status = 'approved',
    approved_at = NOW()
  WHERE id = p_commission_id;

  -- Update wallet
  UPDATE wallet
  SET
    pending_balance = pending_balance - v_amount,
    available_balance = available_balance + v_amount,
    total_earned = total_earned + v_amount,
    updated_at = NOW()
  WHERE user_id = v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process withdrawal
CREATE OR REPLACE FUNCTION process_withdrawal(
  p_user_id UUID,
  p_amount DECIMAL(10,2),
  p_paypal_email TEXT
)
RETURNS UUID AS $$
DECLARE
  v_withdrawal_id UUID;
  v_available_balance DECIMAL(10,2);
BEGIN
  -- Check available balance
  SELECT available_balance INTO v_available_balance
  FROM wallet
  WHERE user_id = p_user_id;

  IF v_available_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  -- Create withdrawal record
  INSERT INTO withdrawals (user_id, amount, paypal_email, status)
  VALUES (p_user_id, p_amount, p_paypal_email, 'pending')
  RETURNING id INTO v_withdrawal_id;

  -- Deduct from available balance
  UPDATE wallet
  SET
    available_balance = available_balance - p_amount,
    total_withdrawn = total_withdrawn + p_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id;

  RETURN v_withdrawal_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
