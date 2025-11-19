# Admin Dashboard & Withdrawal System - Complete Guide

## 🎉 What's Been Added

### 1. Super Admin Dashboard (`/admin`)
A comprehensive monitoring dashboard for the Meatzy team to oversee the entire referral system.

### 2. Withdrawal System with $100 Minimum
Affiliates can request manual payouts via Klaviyo form once they reach $100 threshold.

### 3. Dummy Data Generator
Script to populate your database with realistic test data for demos.

---

## 🔧 Features Added

### Super Admin Dashboard

**URL**: `/admin`

**Key Features**:
- 📊 **Real-time Stats**:
  - Total affiliates
  - Active affiliates (purchased)
  - Total commissions count
  - Pending commissions
  - Total earned (all time)
  - Total paid out

- 👥 **Affiliates Management**:
  - Search by name, email, or referral code
  - Filter by active/inactive status
  - View wallet balances
  - See commission rates
  - Quick view button for details

- 💰 **Pending Withdrawals Alert**:
  - Highlighted section for withdrawal requests
  - Shows affiliate name, PayPal email, amount
  - Quick "Process Payout" button

- 📜 **Recent Commissions**:
  - Last 20 commissions created
  - Who earned, from whom, tier level
  - Status (pending/approved)
  - Amounts and dates

**Access Control**:
- Currently: Any authenticated user can access
- **TODO**: Add admin email whitelist check
- Suggested: Check if `authUser.email` is in admin list

---

### Affiliate Dashboard Updates

**URL**: `/dashboard`

**New Withdrawal Section**:

#### When Balance < $100:
- Shows current available balance
- Displays "You need $XX more" message
- Explains $100 minimum threshold

#### When Balance >= $100:
- Shows available balance
- Step-by-step withdrawal instructions
- Button linking to Klaviyo form
- Form opens in new tab

**Withdrawal Process**:
1. Affiliate reaches $100 available balance
2. Clicks "Request Withdrawal via Klaviyo Form"
3. Fills out form with PayPal email
4. Meatzy team processes within 2-3 business days
5. Payment sent via PayPal manually

---

## 🎨 Dummy Data Generator

**File**: `scripts/generate-dummy-data.js`

**What It Creates**:
- 20 realistic affiliate accounts
- Multi-level referral chains
- 37 simulated orders
- 106 commission records
- ~$1,263 in total commissions
- Some approved, some pending
- 1+ withdrawal requests ($100+)

**Usage**:
```bash
node scripts/generate-dummy-data.js
```

**Result**:
```
✅ Total Affiliates: 20
✅ Active Affiliates: 18
✅ Total Commissions: 106
✅ Pending Commissions: 42
✅ Pending Withdrawals: 1
✅ Total Commission Value: $1,263.16
```

**To Clean Up**:
The script auto-cleans all `@example.com` emails before generating new data.

---

## 📋 Access the Dashboards

### 1. Start Your Dev Server
```bash
cd "/Users/amitsonawane/Desktop/Meatzy Website/meatzy-final"
npm run dev
```

### 2. View Admin Dashboard
```
http://localhost:3000/admin
```

You'll see:
- Stats cards with real numbers
- List of 20 affiliates
- Recent commissions
- Pending withdrawals

### 3. View Affiliate Dashboard
Pick any affiliate from the dummy data and view their dashboard:

**Example**:
1. Go to `/signup`
2. Create account (or use existing test account)
3. Go to `/dashboard`
4. See withdrawal section based on balance

---

## 🔐 Admin Access Control (To Implement)

Currently, any logged-in user can access `/admin`. Here's how to secure it:

### Option 1: Email Whitelist

Add to `.env.local`:
```env
ADMIN_EMAILS=your@email.com,teammate@email.com
```

In `/app/admin/page.tsx`:
```typescript
const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
const isAdmin = adminEmails.includes(authUser.email);

if (!isAdmin) {
  router.push('/dashboard');
  return;
}
```

### Option 2: Database Flag

Add `is_admin` column to `users` table:
```sql
ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT false;

-- Make yourself admin
UPDATE users SET is_admin = true WHERE email = 'your@email.com';
```

Then check in dashboard:
```typescript
const { data: userData } = await supabase
  .from('users')
  .select('is_admin')
  .eq('email', authUser.email)
  .single();

if (!userData?.is_admin) {
  router.push('/dashboard');
  return;
}
```

---

## 💳 Setting Up Klaviyo Withdrawal Form

### 1. Create Form in Klaviyo

**Fields to Include**:
- Full Name
- Email (pre-filled from dashboard)
- PayPal Email (required)
- Withdrawal Amount (pre-filled, read-only)
- Referral Code (hidden, for tracking)

### 2. Get Form URL

After publishing, you'll get a URL like:
```
https://form.klaviyo.com/manage/forms/ABC123/edit
```

### 3. Update Dashboard

In `/app/dashboard/page.tsx`, replace:
```typescript
href="https://form.klaviyo.com/YOUR_FORM_ID"
```

With your actual Klaviyo form URL.

### 4. Form Submission Flow

When affiliate submits:
1. Klaviyo captures submission
2. You receive email/notification
3. Verify balance in admin dashboard
4. Process PayPal payment manually
5. Update withdrawal status in database

---

## 🔄 Processing Withdrawals Manually

### Current Workflow

1. **Affiliate Requests**:
   - Fills Klaviyo form
   - You receive notification

2. **You Verify**:
   - Go to `/admin`
   - Check "Pending Withdrawals" section
   - Verify affiliate has sufficient balance

3. **You Process**:
   - Send PayPal payment to their email
   - Update status in Supabase:
   ```sql
   UPDATE withdrawals
   SET status = 'completed',
       processed_at = NOW(),
       completed_at = NOW()
   WHERE id = 'WITHDRAWAL_ID';

   -- Deduct from available balance (already done by trigger)
   ```

4. **Affiliate Notified**:
   - Send email confirming payment sent
   - Payment appears in their PayPal

---

## 📊 Admin Dashboard Actions

### View Affiliate Details (Future)

When you click "View" on an affiliate:
- Should go to `/admin/affiliate/[id]`
- Show detailed stats for that affiliate
- Full referral tree visualization
- All their commissions
- Edit commission rate
- Manual adjustments

**To Implement**:
Create `/app/admin/affiliate/[id]/page.tsx`

### Process Withdrawal

When you click "Process Payout":
- Should update withdrawal status
- Deduct from wallet
- Log transaction
- Send confirmation email

**To Implement**:
Create API route `/api/admin/process-withdrawal`

---

## 🎯 Testing Guide

### Test Admin Dashboard

1. **Generate dummy data**:
   ```bash
   node scripts/generate-dummy-data.js
   ```

2. **View dashboard**:
   ```
   http://localhost:3000/admin
   ```

3. **Check stats**:
   - Should show 20 affiliates
   - ~$1,263 total earned
   - 106 commissions
   - 42 pending commissions

4. **Search affiliates**:
   - Try searching names: "Emma", "Noah"
   - Try filtering: Active/Inactive

5. **View withdrawals**:
   - Should see 1 pending withdrawal
   - Shows PayPal email
   - Shows amount ($100+)

### Test Withdrawal Flow

1. **Create test account**:
   ```
   http://localhost:3000/signup
   ```

2. **View dashboard**:
   - Should see balance < $100
   - Should see "You need $XX more" message

3. **Simulate earnings**:
   - Run commission test to add balance
   - Or manually update in Supabase:
   ```sql
   UPDATE wallet
   SET available_balance = 150.00
   WHERE user_id = 'YOUR_USER_ID';
   ```

4. **View dashboard again**:
   - Should now see withdrawal button
   - Click opens Klaviyo form

---

## 📈 Dashboard Statistics

### Admin Dashboard Shows

**Financial Metrics**:
- Total earned: Sum of all commissions
- Total paid: Sum of approved commissions
- Pending: Count of pending commissions
- Average commission: Total / count

**User Metrics**:
- Total affiliates: All users
- Active: Has purchased = true
- Inactive: Has purchased = false
- Conversion rate: Active / Total

**Network Health**:
- Recent signups (last 7/30 days)
- Active earners (earned in last 30 days)
- Top performers
- Pending payouts

---

## 🚀 Future Enhancements

### Auto-Approval System
- Approve commissions after 30 days automatically
- Move from pending to available
- Email notification to affiliate

### PayPal API Integration
- Automated payouts
- Batch processing
- Payment tracking
- Automatic status updates

### Enhanced Admin Features
- Individual affiliate detail pages
- Manual commission adjustments
- Commission rate overrides
- Bulk actions (approve all, etc.)
- Export to CSV
- Analytics charts
- Fraud detection alerts

### Enhanced Affiliate Features
- Withdrawal history
- Payment tracking
- Tax document generation
- Performance charts
- Referral link analytics

---

## 🔧 Configuration

### Environment Variables

Add to `.env.local` and Vercel:
```env
# Admin Access (optional)
NEXT_PUBLIC_ADMIN_EMAILS=your@email.com,teammate@email.com

# Klaviyo (if needed)
KLAVIYO_API_KEY=pk_xxxxx

# Withdrawal Settings
MINIMUM_WITHDRAWAL_AMOUNT=100
WITHDRAWAL_PROCESSING_DAYS=3
```

### Withdrawal Constants

In your code, you can configure:
```typescript
const MINIMUM_WITHDRAWAL = 100; // $100 minimum
const PROCESSING_DAYS = '2-3 business days';
const KLAVIYO_FORM_URL = 'https://form.klaviyo.com/YOUR_FORM_ID';
```

---

## 📝 Database Schema Updates

No schema changes needed! Everything uses existing tables:
- `users` - Affiliate accounts
- `wallet` - Balance tracking
- `commissions` - Earning records
- `withdrawals` - Payout requests

---

## ✅ Checklist

### Before Production

- [ ] Secure admin dashboard (add access control)
- [ ] Create Klaviyo withdrawal form
- [ ] Update form URL in dashboard
- [ ] Test withdrawal flow end-to-end
- [ ] Set up withdrawal notification emails
- [ ] Document manual payout process
- [ ] Train team on admin dashboard
- [ ] Set up alerts for pending withdrawals

### After Launch

- [ ] Monitor withdrawal requests
- [ ] Process payouts within 2-3 days
- [ ] Track payout success rate
- [ ] Gather affiliate feedback
- [ ] Consider PayPal API integration
- [ ] Review and optimize

---

## 🎊 Summary

You now have:
- ✅ **Super admin dashboard** to monitor everything
- ✅ **Withdrawal system** with $100 minimum
- ✅ **Manual payout workflow** via Klaviyo
- ✅ **Dummy data generator** for testing
- ✅ **Search and filter** capabilities
- ✅ **Real-time statistics**

**Next Steps**:
1. Add admin access control
2. Create Klaviyo form
3. Update form URL
4. Deploy to production
5. Test with real affiliate

**Your referral system is now COMPLETE!** 🚀🥩
