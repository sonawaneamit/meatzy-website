# Privacy Protection Implementation

## Overview

This document describes the privacy protection measures implemented to protect affiliate personal information in the referral system.

## Security Measures

### 1. Role-Based Information Display

**Regular Affiliates:**
- See limited information about people in their referral tree
- Names displayed as: First Name + Last Initial (e.g., "Jason S.")
- Email addresses are completely hidden
- Cannot contact or harass their downline

**Super Admins (Meatzy Team):**
- See full information for all affiliates
- Full names displayed
- Email addresses visible
- Can manage all affiliate accounts

### 2. Implementation Files

#### `/lib/privacy-utils.ts`
Core privacy utility functions:
- `formatPrivateName()` - Converts full name to "FirstName L." format
- `getDisplayName()` - Returns appropriate display name based on user role
- `getDisplayEmail()` - Controls email visibility based on admin status

#### `/app/dashboard/page.tsx`
Regular affiliate dashboard with privacy protection:
- Line 36: Added `isAdmin` state
- Line 71: Checks user's admin status from database
- Line 456: Uses `getDisplayName()` to format referral names
- Lines 466-470: Shows email only if viewer is admin

#### `/app/admin/affiliate/[id]/page.tsx`
Admin view shows full information (no changes needed):
- Lines 101-110: Already checks for admin access before displaying data
- Shows full names and emails for all affiliates in tree
- Shows complete commission history with full details

### 3. How It Works

```typescript
// Regular Affiliate viewing their referrals
getDisplayName("Jason Sonja", "jason@test.com", false)
// Returns: "Jason S."

// Admin viewing the same user
getDisplayName("Jason Sonja", "jason@test.com", true)
// Returns: "Jason Sonja"
```

### 4. Database Field Used

The system checks the `is_admin` boolean field in the `users` table to determine if a user should see full information.

**Admin Users:**
- `is_admin = true` in database
- Can access `/admin` routes
- See all personal information

**Regular Affiliates:**
- `is_admin = false` or null
- Can only access `/dashboard`
- See masked information for their referrals

### 5. Protection Points

✅ **Referral Tree Display** - Names masked in user dashboard
✅ **Direct Referrals List** - Names masked, emails hidden
✅ **Commission History** - Only shows tier levels, not full names
✅ **Admin Dashboard** - Full access with proper authentication
✅ **Individual Affiliate View** - Admin-only access with complete details

### 6. Testing

Run the test script to verify privacy functions:

```bash
node test-privacy.js
```

Expected outputs:
- "Jason Sonja" → "Jason S." (for regular users)
- "Jason Sonja" → "Jason Sonja" (for admins)
- Emails hidden for regular users
- Emails visible for admins

### 7. Benefits

1. **Prevents Harassment** - Affiliates cannot directly contact their downline
2. **Reduces Abuse** - No way to spam or pressure referrals
3. **Maintains Privacy** - Personal information stays protected
4. **Professional Management** - Admin team has full oversight
5. **Compliance** - Respects user privacy preferences

### 8. Admin Preview Mode

**NEW FEATURE:** Admins can now toggle between full admin view and user preview mode.

In the admin affiliate detail page (`/admin/affiliate/[id]`), there's a toggle button in the top-right corner:

- **Default (Admin View):** Shows all information (full names, emails, phone numbers)
- **Preview User View:** Shows what a regular affiliate would see (masked names, hidden emails)

This helps admins:
- Verify privacy protection is working correctly
- Understand what affiliates see in their dashboard
- Test the system without needing a separate test account

When preview mode is active:
- Banner appears at top: "User Preview Mode Active"
- Names change to "FirstName L." format
- Emails are completely hidden
- Phone numbers are hidden
- "Referred by" names are also masked

Toggle button states:
- Gray button = Admin view (click to preview user view)
- Red button = User preview active (click to return to admin view)

### 9. Future Enhancements

Potential additions:
- Add privacy settings for individual users
- Allow users to opt-in to sharing more information
- Implement secure messaging system between upline/downline
- Add audit logs for admin access to sensitive data

## Summary

The privacy protection system ensures that regular affiliates can track their referral network's performance without exposing personal contact information. Only authorized Meatzy team members with admin privileges can access full user details for support and management purposes.
