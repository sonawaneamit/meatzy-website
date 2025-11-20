# POST-LAUNCH TO-DO: Affiliate Monitoring & Automation System

**Status**: Pending Shopify Subscription App Integration
**Created**: 2025-11-20
**Priority**: High (Phase 2 - Post-Launch)
**Estimated Timeline**: 1-2 weeks implementation + 1 week testing

---

## Executive Summary

### Current System Status ✅

Our affiliate referral system has a **solid foundation** with:
- ✅ 4-tier MLM structure (13% / 2% / 1% / 1%)
- ✅ Commission calculation engine
- ✅ Basic rate management (100% active, 50% inactive)
- ✅ Admin manual override capability
- ✅ Referral tree tracking
- ✅ First purchase auto-upgrade (50% → 100%)

### What's Missing ❌

The system **lacks automated enforcement** of business rules:
- ❌ Pause-based commission reductions
- ❌ Referral count monitoring
- ❌ Calendar year tracking
- ❌ Scheduled monitoring jobs
- ❌ Automated flagging system
- ❌ 6-month review process

### Why We're Waiting

**Prerequisites**:
1. **Shopify Subscription App** must be connected to backend
2. **Subscription webhooks** need to be configured
3. **Pause/resume events** must flow into our system
4. Real subscription data required for accurate testing

**Current Manual Process**:
- Admin team reviews accounts manually
- Commission adjustments done via override
- No automated monitoring or alerts

---

## Business Rules to Implement

### Rule 1: Active Subscriber Commission (100%)

**Condition**: User has purchased AND has active subscription

**Current Implementation**: ✅ Partially working
- First purchase triggers 100% rate
- BUT: No check if subscription is still active

**Needs Implementation**:
```typescript
// Check active subscription status continuously
if (user.has_purchased && subscription.status === 'active') {
  commission_rate = 1.0; // 100%
}
```

---

### Rule 2: Paused Subscription Commission Reduction (50%)

**Condition**: User paused for >60 days within calendar year AND has <20 active direct referrals

**Current Implementation**: ❌ Not implemented

**Needs Implementation**:

#### Database Changes
```sql
-- Add pause tracking fields
ALTER TABLE users ADD COLUMN pause_cumulative_days_current_year INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN last_pause_check_date TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN active_direct_referral_count INTEGER DEFAULT 0;

-- Create pause history table
CREATE TABLE pause_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  paused_at TIMESTAMPTZ NOT NULL,
  resumed_at TIMESTAMPTZ,
  duration_days INTEGER,
  calendar_year INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_pause_history_user_year ON pause_history(user_id, calendar_year);
```

#### Code Logic
```typescript
async function checkPauseReductions() {
  // Find users with paused subscriptions
  const { data: pausedUsers } = await supabase
    .from('users')
    .select(`
      id,
      commission_rate,
      commission_override,
      subscriptions!inner (status, paused_since)
    `)
    .eq('subscriptions.status', 'paused')
    .is('commission_override', null); // Don't override admin manual settings

  for (const user of pausedUsers) {
    // Calculate pause duration
    const pauseDays = calculateDaysBetween(
      user.subscriptions.paused_since,
      new Date()
    );

    // Count active direct referrals
    const activeReferrals = await countActiveDirectReferrals(user.id);

    // Apply rule: >60 days pause AND <20 active referrals
    if (pauseDays > 60 && activeReferrals < 20) {
      await supabase
        .from('users')
        .update({
          commission_rate: 0.5,
          pause_cumulative_days_current_year: pauseDays
        })
        .eq('id', user.id);

      // Log the reduction
      console.log(`Reduced commission to 50% for user ${user.id}: ${pauseDays} days paused, ${activeReferrals} active referrals`);
    }
  }
}
```

#### Scheduled Job
```typescript
// Run daily at 2 AM
// File: /lib/cron/check-pause-reductions.ts
import cron from 'node-cron';

cron.schedule('0 2 * * *', async () => {
  console.log('Running pause-based commission reduction check...');
  await checkPauseReductions();
});
```

---

### Rule 3: Exception for High Performers (20+ Active Referrals)

**Condition**: User with 20+ active direct referrals keeps 100% commission even when paused

**Current Implementation**: ❌ Not implemented

**Needs Implementation**:
```typescript
// In checkPauseReductions() function
if (pauseDays > 60) {
  const activeReferrals = await countActiveDirectReferrals(user.id);

  if (activeReferrals >= 20) {
    // Exception: Keep 100% commission
    console.log(`User ${user.id} keeps 100% (${activeReferrals} active referrals)`);
    continue; // Skip reduction
  } else if (activeReferrals >= 10 && activeReferrals < 20) {
    // Reduce to 50%
    await updateCommissionRate(user.id, 0.5);
  } else {
    // <10 referrals: Flag for review
    await flagForReview(user.id, 'LOW_REFERRALS_PAUSED');
  }
}
```

---

### Rule 4: Signup Without Purchase (50%)

**Condition**: User signed up but hasn't made first purchase

**Current Implementation**: ✅ Working correctly

**Code Reference**: `/lib/supabase/referral.ts` Line 63-65
```typescript
const commissionRate = params.hasPurchased ? 1.0 : 0.5;
```

**Exception Logic to Add**:
```typescript
// Exception: If user gets 20+ active direct referrals BEFORE purchasing
if (!user.has_purchased) {
  const activeReferrals = await countActiveDirectReferrals(user.id);

  if (activeReferrals >= 20) {
    // Upgrade to 100% even without purchase
    await supabase
      .from('users')
      .update({ commission_rate: 1.0 })
      .eq('id', user.id);
  }
}
```

---

### Rule 5: 6-Month Monitoring & Flagging

**Condition**: After 6 months, flag accounts for manual review based on referral count

**Current Implementation**: ❌ Not implemented

**Needs Implementation**:

#### Database Changes
```sql
-- Add monitoring fields
ALTER TABLE users ADD COLUMN monitoring_start_date TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE users ADD COLUMN monitoring_flag BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN flag_reason TEXT;
ALTER TABLE users ADD COLUMN last_monitoring_check TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN flagged_at TIMESTAMPTZ;

-- Create admin notifications table
CREATE TABLE admin_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  notification_type TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('info', 'warning', 'critical')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_notifications_unread ON admin_notifications(is_read, created_at);
```

#### Monitoring Logic
```typescript
async function runSixMonthMonitoring() {
  const sixMonthsAgo = subMonths(new Date(), 6);

  // Find users created 6+ months ago
  const { data: users } = await supabase
    .from('users')
    .select('id, email, full_name, created_at, monitoring_flag, active_direct_referral_count')
    .lt('created_at', sixMonthsAgo)
    .eq('monitoring_flag', false);

  for (const user of users) {
    const activeReferrals = user.active_direct_referral_count ||
                           await countActiveDirectReferrals(user.id);

    let flagReason = null;
    let newCommissionRate = null;

    // Apply 6-month rules
    if (activeReferrals < 10) {
      flagReason = `CRITICAL: ${activeReferrals} active referrals after 6 months. Consider deactivation.`;
      newCommissionRate = 0.0; // Lose commission
    } else if (activeReferrals < 20) {
      flagReason = `WARNING: ${activeReferrals} active referrals after 6 months. Consider 50% reduction.`;
      newCommissionRate = 0.5;
    }

    if (flagReason) {
      // Flag the account
      await supabase
        .from('users')
        .update({
          monitoring_flag: true,
          flag_reason: flagReason,
          flagged_at: new Date().toISOString(),
          last_monitoring_check: new Date().toISOString(),
        })
        .eq('id', user.id);

      // Create admin notification
      await supabase
        .from('admin_notifications')
        .insert({
          user_id: user.id,
          notification_type: 'COMMISSION_REVIEW_REQUIRED',
          message: `${user.full_name} (${user.email}): ${flagReason}`,
          severity: activeReferrals < 10 ? 'critical' : 'warning',
        });

      // Optionally auto-apply commission change
      if (newCommissionRate !== null) {
        await supabase
          .from('users')
          .update({ commission_rate: newCommissionRate })
          .eq('id', user.id);
      }

      console.log(`Flagged user ${user.id}: ${flagReason}`);
    }
  }
}

// Run monthly
cron.schedule('0 3 1 * *', runSixMonthMonitoring); // 1st of each month at 3 AM
```

---

### Rule 6: Active Referral Definition

**Condition**: Define what makes a referral "active"

**Current Implementation**: ❌ Not defined in code

**Business Definition Needed**:

```typescript
/**
 * A referral is considered "active" if:
 * 1. They have made at least one purchase (has_purchased = true)
 * 2. They have an active subscription (subscription.status = 'active')
 *
 * Inactive referrals:
 * - Never purchased
 * - Cancelled subscription
 * - Paused subscription (?)  ← CLARIFY: Does paused count as active or inactive?
 */

async function countActiveDirectReferrals(userId: string): Promise<number> {
  const { data, count } = await supabase
    .from('user_tree')
    .select(`
      user_id,
      users!inner (
        has_purchased,
        subscriptions!inner (status)
      )
    `, { count: 'exact' })
    .eq('ancestor_id', userId)
    .eq('level', 1) // Direct referrals only
    .eq('users.has_purchased', true)
    .eq('users.subscriptions.status', 'active'); // ← Or include 'paused'?

  return count || 0;
}

// Store this count for performance
async function updateActiveReferralCounts() {
  // Run this after subscription status changes
  const { data: users } = await supabase
    .from('users')
    .select('id');

  for (const user of users) {
    const count = await countActiveDirectReferrals(user.id);

    await supabase
      .from('users')
      .update({ active_direct_referral_count: count })
      .eq('id', user.id);
  }
}
```

**Decision Required**: Does "paused" subscription count as "active" referral?
- **Option A**: Only `status = 'active'` counts (strict)
- **Option B**: Both `active` and `paused` count (lenient)

---

### Rule 7: Calendar Year Pause Tracking

**Condition**: Track cumulative pause days within each calendar year, reset on Jan 1

**Current Implementation**: ❌ Not implemented

**Needs Implementation**:

#### Webhook Handler
```typescript
// File: /app/api/webhooks/shopify/subscription/pause/route.ts
export async function POST(request: Request) {
  const { user_id, paused_at } = await request.json();

  const currentYear = new Date().getFullYear();

  // Record pause event
  await supabase
    .from('pause_history')
    .insert({
      user_id,
      paused_at,
      calendar_year: currentYear,
    });

  console.log(`Subscription paused for user ${user_id}`);
  return new Response('OK', { status: 200 });
}

// File: /app/api/webhooks/shopify/subscription/resume/route.ts
export async function POST(request: Request) {
  const { user_id, resumed_at } = await request.json();

  // Find most recent pause record
  const { data: pauseRecord } = await supabase
    .from('pause_history')
    .select('*')
    .eq('user_id', user_id)
    .is('resumed_at', null)
    .order('paused_at', { ascending: false })
    .limit(1)
    .single();

  if (pauseRecord) {
    const pauseDays = calculateDaysBetween(pauseRecord.paused_at, resumed_at);

    // Update pause record
    await supabase
      .from('pause_history')
      .update({
        resumed_at,
        duration_days: pauseDays,
      })
      .eq('id', pauseRecord.id);

    // Update cumulative total
    const { data: yearTotal } = await supabase
      .from('pause_history')
      .select('duration_days')
      .eq('user_id', user_id)
      .eq('calendar_year', new Date().getFullYear());

    const totalDays = yearTotal.reduce((sum, record) => sum + (record.duration_days || 0), 0);

    await supabase
      .from('users')
      .update({ pause_cumulative_days_current_year: totalDays })
      .eq('id', user_id);
  }

  return new Response('OK', { status: 200 });
}
```

#### Year-End Reset Job
```typescript
// Run on January 1st at midnight
cron.schedule('0 0 1 1 *', async () => {
  console.log('Resetting calendar year pause tracking...');

  await supabase
    .from('users')
    .update({
      pause_cumulative_days_current_year: 0,
      last_pause_check_date: new Date().toISOString(),
    });

  console.log('Calendar year pause tracking reset complete');
});
```

---

## Implementation Phases

### Phase 1: Database Schema Updates (Day 1)

**Tasks**:
- [ ] Add new columns to `users` table
- [ ] Create `pause_history` table
- [ ] Create `admin_notifications` table
- [ ] Add indexes for performance
- [ ] Test schema changes in development

**Files to Modify**:
- `supabase-schema.sql`
- Create migration file: `migrations/003_affiliate_monitoring.sql`

**Testing**:
- Verify all fields created
- Test indexes work
- Check foreign key constraints

---

### Phase 2: Shopify Webhook Integration (Days 2-3)

**Tasks**:
- [ ] Create subscription pause webhook handler
- [ ] Create subscription resume webhook handler
- [ ] Create subscription cancel webhook handler
- [ ] Update order webhook to check subscription status
- [ ] Test webhook endpoints with Shopify test events

**Files to Create**:
- `/app/api/webhooks/shopify/subscription/pause/route.ts`
- `/app/api/webhooks/shopify/subscription/resume/route.ts`
- `/app/api/webhooks/shopify/subscription/cancel/route.ts`
- `/app/api/webhooks/shopify/subscription/activate/route.ts`

**Shopify Setup Required**:
- Configure subscription webhooks in Shopify admin
- Map Shopify customer IDs to our user IDs
- Test webhook delivery

**Testing**:
- Test pause event → creates pause_history record
- Test resume event → updates pause_history with duration
- Test cumulative pause calculation
- Verify calendar year tracking

---

### Phase 3: Business Logic Functions (Days 4-5)

**Tasks**:
- [ ] Implement `countActiveDirectReferrals()` function
- [ ] Implement `checkPauseReductions()` function
- [ ] Implement `runSixMonthMonitoring()` function
- [ ] Implement `updateActiveReferralCounts()` function
- [ ] Create utility functions for date calculations

**Files to Create**:
- `/lib/affiliate-monitoring/pause-checker.ts`
- `/lib/affiliate-monitoring/referral-counter.ts`
- `/lib/affiliate-monitoring/six-month-review.ts`
- `/lib/affiliate-monitoring/utils.ts`

**Testing**:
- Unit tests for each function
- Test edge cases (exactly 20 referrals, exactly 60 days, etc.)
- Test with mock data

---

### Phase 4: Scheduled Jobs (Day 6)

**Tasks**:
- [ ] Set up cron job infrastructure
- [ ] Create daily pause check job (2 AM)
- [ ] Create monthly monitoring job (1st of month, 3 AM)
- [ ] Create year-end reset job (Jan 1, midnight)
- [ ] Create hourly referral count update job
- [ ] Configure job logging and error handling

**Files to Create**:
- `/lib/cron/daily-pause-check.ts`
- `/lib/cron/monthly-monitoring.ts`
- `/lib/cron/yearly-reset.ts`
- `/lib/cron/update-referral-counts.ts`
- `/lib/cron/index.ts` (job orchestrator)

**Deployment Consideration**:
- Use Vercel Cron or external service (e.g., Render Cron Jobs)
- Add monitoring/alerting for failed jobs
- Log job execution history

**Testing**:
- Manually trigger each job
- Verify database updates
- Test error handling
- Check performance with large datasets

---

### Phase 5: Admin Dashboard Enhancements (Days 7-8)

**Tasks**:
- [ ] Add "Flagged Accounts" view to admin dashboard
- [ ] Show pause duration for each affiliate
- [ ] Display active referral count
- [ ] Add "Monitoring Status" column
- [ ] Create notification panel for admin
- [ ] Add bulk actions (approve, reject, adjust rate)
- [ ] Add filtering by flag status

**Files to Modify**:
- `/app/admin/page.tsx`
- `/app/admin/affiliate/[id]/page.tsx`
- Create: `/app/admin/flagged-accounts/page.tsx`
- Create: `/app/admin/notifications/page.tsx`

**UI Components**:
```typescript
// Example: Flagged accounts view
interface FlaggedAccount {
  id: string;
  full_name: string;
  email: string;
  flag_reason: string;
  active_referral_count: number;
  pause_cumulative_days: number;
  flagged_at: string;
}

function FlaggedAccountsPage() {
  return (
    <div>
      <h1>Flagged Accounts - Requiring Review</h1>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Flag Reason</th>
            <th>Active Referrals</th>
            <th>Days Paused (This Year)</th>
            <th>Current Rate</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {flaggedAccounts.map(account => (
            <tr key={account.id}>
              <td>{account.full_name}</td>
              <td className="text-red-600">{account.flag_reason}</td>
              <td>{account.active_referral_count}</td>
              <td>{account.pause_cumulative_days}</td>
              <td>{account.commission_rate * 100}%</td>
              <td>
                <button onClick={() => reviewAccount(account.id)}>Review</button>
                <button onClick={() => clearFlag(account.id)}>Clear Flag</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

**Testing**:
- Test notification system
- Test bulk actions
- Test filtering and sorting
- Mobile responsiveness

---

### Phase 6: Testing & Validation (Days 9-10)

**Test Scenarios**:

1. **Pause Reduction Test**:
   - [ ] User pauses for 59 days → No reduction
   - [ ] User pauses for 61 days with 19 referrals → 50% reduction
   - [ ] User pauses for 61 days with 20 referrals → No reduction
   - [ ] User pauses for 61 days with 9 referrals → Flagged

2. **6-Month Monitoring Test**:
   - [ ] User at 6 months with 9 referrals → 0% rate, flagged critical
   - [ ] User at 6 months with 15 referrals → 50% rate, flagged warning
   - [ ] User at 6 months with 25 referrals → No change

3. **Calendar Year Test**:
   - [ ] User pauses 30 days in Jan, 35 days in July → Total 65 days → Triggers reduction
   - [ ] Reset on Jan 1 → Cumulative days back to 0

4. **Active Referral Count Test**:
   - [ ] User has 25 total referrals, 18 active → Uses 18 for thresholds
   - [ ] Referral cancels subscription → Count decreases by 1

5. **Admin Override Test**:
   - [ ] Admin sets override → Automated system doesn't change it
   - [ ] Admin removes override → Automated system resumes

**Edge Cases**:
- User created on Dec 31 → 6 months = June 30
- User pauses on Dec 25, resumes Jan 5 → Split across calendar years
- User has exactly 20 referrals → Confirm no reduction
- Multiple subscriptions per user (if applicable)

**Performance Testing**:
- [ ] Test with 1,000 users
- [ ] Test with 10,000 users
- [ ] Measure cron job execution time
- [ ] Optimize queries if needed

---

## Technical Implementation Details

### Database Functions

```sql
-- Function to count active direct referrals
CREATE OR REPLACE FUNCTION count_active_direct_referrals(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  referral_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO referral_count
  FROM user_tree ut
  INNER JOIN users u ON ut.user_id = u.id
  INNER JOIN subscriptions s ON u.id = s.user_id
  WHERE ut.ancestor_id = p_user_id
    AND ut.level = 1
    AND u.has_purchased = true
    AND s.status = 'active';

  RETURN referral_count;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update referral counts automatically
CREATE OR REPLACE FUNCTION update_referrer_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update direct referral count for the referrer
  UPDATE users
  SET active_direct_referral_count = count_active_direct_referrals(id)
  WHERE id = NEW.referrer_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_referral_counts
AFTER INSERT OR UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_referrer_counts();
```

### Environment Variables Needed

```env
# Cron job configuration
CRON_ENABLED=true
CRON_SECRET_KEY=your-secret-key-here

# Admin notification settings
ADMIN_EMAIL=team@getmeatzy.com
NOTIFICATION_WEBHOOK_URL=https://hooks.slack.com/... (optional)

# Monitoring settings
MONITORING_START_DATE=2025-01-01
SIX_MONTH_CHECK_ENABLED=true
AUTO_APPLY_COMMISSION_CHANGES=false  # Set true to auto-apply, false to flag only
```

---

## Admin Manual Override Protection

**Critical Rule**: Never override admin manual settings

```typescript
// Before applying automated commission changes
const { data: user } = await supabase
  .from('users')
  .select('commission_override')
  .eq('id', userId)
  .single();

if (user.commission_override !== null) {
  console.log(`Skipping automated adjustment for user ${userId}: Admin override in place`);
  return; // Don't touch this user
}

// Proceed with automated adjustment only if no override
await supabase
  .from('users')
  .update({ commission_rate: newRate })
  .eq('id', userId)
  .is('commission_override', null); // Double-check in query
```

---

## Notification System

### Email Templates to Create

**1. Flagged Account Notification (to Admin)**
```
Subject: [Meatzy Affiliate] Account Flagged for Review - {user.full_name}

User: {user.full_name} ({user.email})
Reason: {flag_reason}
Active Referrals: {active_referral_count}
Days Paused (This Year): {pause_cumulative_days}
Current Commission Rate: {commission_rate * 100}%

Action Required: Review this account in the admin dashboard.

[View Account] [Adjust Commission] [Clear Flag]
```

**2. Commission Rate Change (to User)**
```
Subject: Your Meatzy Affiliate Commission Status Update

Hi {user.full_name},

Your affiliate commission rate has been adjusted based on your account activity.

New Commission Rate: {new_rate * 100}%
Reason: {reason}

To maintain 100% commission:
- Keep your subscription active
- Build at least 20 active direct referrals

Questions? Contact our support team.

Best,
The Meatzy Team
```

---

## Monitoring & Logging

### Metrics to Track

```typescript
// Log all commission changes
interface CommissionChangeLog {
  user_id: string;
  old_rate: number;
  new_rate: number;
  reason: string;
  changed_by: 'AUTOMATED' | 'ADMIN';
  changed_at: string;
}

// Create logs table
CREATE TABLE commission_change_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  old_rate DECIMAL(3,2),
  new_rate DECIMAL(3,2),
  reason TEXT,
  changed_by TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Dashboard Metrics

Display in admin dashboard:
- Total flagged accounts
- Accounts reduced to 50% this month
- Accounts at 0% commission
- Average active referral count
- Total pause days across all users

---

## Decision Points & Questions

### Questions for Meatzy Team:

1. **Active Referral Definition**:
   - Does a "paused" subscription count as "active" referral?
   - Or only "active" status counts?

2. **Auto-Apply vs. Flag-Only Mode**:
   - Should the system automatically change commission rates?
   - Or just flag accounts for manual review?

3. **Grace Periods**:
   - Should there be a grace period before reducing commission?
   - E.g., "Paused for 60 days, give 7-day warning before reducing"?

4. **Notification Preferences**:
   - Email notifications to users when rate changes?
   - Slack/Discord notifications to admin team?

5. **Pause Definition**:
   - If user pauses for 30 days, resumes for 1 day, pauses again for 35 days:
     - Count as 65 cumulative days? Or reset on resume?

6. **6-Month Rule Strictness**:
   - Exactly 6 months (183 days)? Or calendar-based (e.g., created in June → review in December)?

---

## Success Criteria

### Phase 1 Complete When:
- ✅ All database tables created
- ✅ Schema validated in production
- ✅ No breaking changes to existing system

### Phase 2 Complete When:
- ✅ Shopify webhooks configured and tested
- ✅ Pause/resume events logged correctly
- ✅ Calendar year tracking works

### Phase 3 Complete When:
- ✅ All business logic functions tested
- ✅ Edge cases handled
- ✅ Unit tests pass

### Phase 4 Complete When:
- ✅ Cron jobs running on schedule
- ✅ Jobs execute without errors
- ✅ Logging confirms proper execution

### Phase 5 Complete When:
- ✅ Admin can view flagged accounts
- ✅ Admin can take actions from dashboard
- ✅ Notifications appear correctly

### Phase 6 Complete When:
- ✅ All test scenarios pass
- ✅ Performance benchmarks met
- ✅ System ready for production

---

## Risk Mitigation

### Potential Issues:

1. **Over-Reduction Risk**: Accidentally reducing commission when shouldn't
   - **Mitigation**: Flag-only mode initially, require manual approval

2. **Performance Impact**: Counting referrals for thousands of users
   - **Mitigation**: Cache counts, use database functions, add indexes

3. **Webhook Failures**: Shopify webhook not delivered
   - **Mitigation**: Implement retry logic, daily sync job as backup

4. **Date Calculation Errors**: Time zones, DST, leap years
   - **Mitigation**: Use UTC timestamps, test edge cases thoroughly

5. **Admin Override Conflicts**: Automated system fighting admin decisions
   - **Mitigation**: Always check for override before applying changes

---

## Cost Estimation

### Development Time:
- Database changes: 4 hours
- Webhook handlers: 8 hours
- Business logic: 16 hours
- Scheduled jobs: 8 hours
- Admin dashboard: 12 hours
- Testing: 16 hours
- **Total**: ~64 hours (~1.5-2 weeks)

### Infrastructure Costs:
- Cron job service: $5-10/month
- Increased database usage: $5-10/month
- Email notifications: $0-5/month (depends on volume)

---

## Next Steps (Immediate)

1. **Shopify Subscription App Setup**:
   - Connect subscription app to Shopify backend
   - Configure webhook endpoints
   - Test subscription creation/pause/resume events

2. **Define "Active Referral"**:
   - Get clarity from business team
   - Document the definition
   - Update this file

3. **Choose Auto vs. Manual Mode**:
   - Decide if system auto-applies or just flags
   - Update implementation plan accordingly

4. **Create Development Timeline**:
   - Assign developers
   - Set sprint schedule
   - Plan QA testing

---

## Resources & References

### Code Files to Reference:
- `/lib/supabase/referral.ts` - Current commission calculation
- `/supabase-schema.sql` - Database schema
- `/app/api/webhooks/shopify/order/route.ts` - Existing webhook handler
- `/app/admin/affiliate/[id]/page.tsx` - Admin interface

### Documentation:
- `REFERRAL_SYSTEM_README.md` - System overview
- `SUPPORT_TEAM_GUIDE.md` - Support documentation
- `PRIVACY_PROTECTION_IMPLEMENTATION.md` - Privacy features

### External Resources:
- Shopify Subscription API docs
- Node-cron documentation
- Supabase scheduled functions

---

## Changelog

**2025-11-20**: Initial document created
- Outlined all missing features
- Created implementation plan
- Estimated timelines

---

**END OF DOCUMENT**

*This is a living document. Update as decisions are made and implementation progresses.*
