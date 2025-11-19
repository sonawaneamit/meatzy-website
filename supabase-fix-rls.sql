-- Fix Row-Level Security policies to allow user creation
-- Run this in Supabase SQL Editor

-- Allow users to insert their own record during signup
CREATE POLICY "Users can create own account" ON users
FOR INSERT
WITH CHECK (true);

-- Allow users to update their own record
CREATE POLICY "Users can update own data" ON users
FOR UPDATE
USING (auth.uid() = id);

-- Allow service role to insert users (for webhook)
-- This is already covered by service_role bypass, but good to be explicit

-- Allow inserts to user_tree (triggered automatically)
CREATE POLICY "Allow user_tree inserts" ON user_tree
FOR INSERT
WITH CHECK (true);

-- Allow inserts to wallet (triggered automatically)
CREATE POLICY "Allow wallet inserts" ON wallet
FOR INSERT
WITH CHECK (true);

-- Allow inserts to commissions (from webhooks)
CREATE POLICY "Allow commission inserts" ON commissions
FOR INSERT
WITH CHECK (true);

-- Allow inserts to subscriptions (from webhooks)
CREATE POLICY "Allow subscription inserts" ON subscriptions
FOR INSERT
WITH CHECK (true);
