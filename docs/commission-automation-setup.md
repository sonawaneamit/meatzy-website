# Commission Automation Setup Guide

This guide explains how to set up automatic commission approval based on Shopify order fulfillment status.

## Overview

**Automatic Commission Flow:**
1. ✅ Order Created → Commissions created as `pending`
2. 📦 Order Fulfilled → Commissions auto-approved (pending → available)
3. ❌ Order Cancelled → Commissions reversed/removed

## Step 1: Database Setup

Run the SQL migration in Supabase:

1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/ezgfwukgtdlynabdcucz/sql)
2. Copy and paste the entire contents of `supabase-commission-automation.sql`
3. Click "Run" to execute

This creates:
- `approve_commission()` - Moves pending → available balance
- `decrement_pending_balance()` - Removes from pending (for cancelled orders)
- `reverse_approved_commission()` - Reverses approved commissions
- Adds `approved_at` and `cancelled_at` columns to commissions table

## Step 2: Deploy Code

The webhook handlers have been created:
- `/api/webhooks/shopify/order-fulfilled` - Auto-approves commissions
- `/api/webhooks/shopify/order-cancelled` - Reverses commissions

Deploy to Vercel:
```bash
git add .
git commit -m "Add commission automation webhooks"
git push
```

## Step 3: Configure Shopify Webhooks

### A. Order Fulfilled Webhook

1. Go to Shopify Admin → Settings → Notifications
2. Scroll down to "Webhooks" section
3. Click "Create webhook"
4. Configure:
   - **Event:** Order fulfillment
   - **Format:** JSON
   - **URL:** `https://getmeatzy.com/api/webhooks/shopify/order-fulfilled`
   - **Webhook API version:** Latest (2024-01 or newer)
5. Click "Save"

### B. Order Cancelled Webhook

1. Click "Create webhook" again
2. Configure:
   - **Event:** Order cancellation
   - **Format:** JSON
   - **URL:** `https://getmeatzy.com/api/webhooks/shopify/order-cancelled`
   - **Webhook API version:** Latest (2024-01 or newer)
3. Click "Save"

## How It Works

### Order Fulfilled Flow:
```
Order Fulfilled (Shopify)
  ↓
Webhook triggers /order-fulfilled
  ↓
Find all pending commissions for order_id
  ↓
For each commission:
  - Update status: pending → approved
  - Add approved_at timestamp
  - Move $ from pending_balance → available_balance
  - Add $ to lifetime_earnings
  ↓
Affiliates can now withdraw funds
```

### Order Cancelled Flow:
```
Order Cancelled (Shopify)
  ↓
Webhook triggers /order-cancelled
  ↓
Find all commissions for order_id (pending or approved)
  ↓
For each commission:
  - Update status → cancelled
  - Add cancelled_at timestamp
  - If pending: subtract from pending_balance
  - If approved: subtract from available_balance + lifetime_earnings
  ↓
Commission removed from affiliate wallet
```

## Testing

### Test Order Fulfillment:
1. Place a test order via referral link
2. Check admin panel - commission should be "pending"
3. In Shopify Admin, fulfill the order
4. Refresh admin panel - commission should move to "available"
5. Check affiliate's wallet - should see amount in available_balance

### Test Order Cancellation:
1. Place a test order via referral link
2. Check that commission is created (pending)
3. In Shopify Admin, cancel the order
4. Refresh admin panel - commission should be removed/reversed
5. Check affiliate's wallet - pending_balance should decrease

## Commission Statuses

| Status | Description | Wallet Impact |
|--------|-------------|---------------|
| `pending` | Order created, awaiting fulfillment | Added to `pending_balance` |
| `approved` | Order fulfilled, ready to withdraw | Moved to `available_balance` + `lifetime_earnings` |
| `cancelled` | Order cancelled, commission removed | Subtracted from balances |

## Security

- All webhooks verify HMAC signature using `SHOPIFY_WEBHOOK_SECRET`
- Uses service role key for database operations
- Prevents unauthorized commission manipulation

## Troubleshooting

**Commissions not auto-approving?**
- Check Vercel deployment logs
- Verify webhook URL is correct in Shopify
- Check SHOPIFY_WEBHOOK_SECRET environment variable

**Webhook signature verification failing?**
- Ensure SHOPIFY_WEBHOOK_SECRET matches Shopify Admin
- Check that webhook format is "JSON" not "XML"

**Database functions failing?**
- Verify SQL migration ran successfully
- Check Supabase logs for errors
- Ensure service role key has correct permissions
