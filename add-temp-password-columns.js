/**
 * Database Migration: Add temporary password columns to users table
 *
 * This script provides the SQL needed to add columns for storing
 * temporary passwords that are generated when orders are placed.
 */

console.log('\n' + '='.repeat(80));
console.log('DATABASE MIGRATION: Add Temporary Password Columns');
console.log('='.repeat(80));

console.log('\n📝 Run this SQL in Supabase SQL Editor:\n');
console.log('='.repeat(80));
console.log(`
-- Add columns for temporary password functionality
ALTER TABLE users
ADD COLUMN IF NOT EXISTS temporary_password TEXT,
ADD COLUMN IF NOT EXISTS requires_password_change BOOLEAN DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN users.temporary_password IS 'Temporary password generated for new customers after Shopify order. Cleared after first login.';
COMMENT ON COLUMN users.requires_password_change IS 'Flag indicating user must change password on first login.';
`);
console.log('='.repeat(80));

console.log('\n📍 Steps:');
console.log('   1. Go to: https://supabase.com/dashboard/project/[your-project]/sql');
console.log('   2. Copy and paste the SQL above');
console.log('   3. Click "Run" to execute');
console.log('\n✅ After running this migration, the webhook will be able to store temporary passwords.\n');
