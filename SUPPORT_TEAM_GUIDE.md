# Support Team Guide - Meatzy Referral System

## Quick Reference: Finding Referral Codes in Shopify

### Where to Look in Shopify Orders

When a customer makes a purchase using a referral link, the referral code appears in **3 places**:

#### 1. Order Notes (Most Visible)
```
📍 Location: Order details page → Notes section (top right)

Example:
┌─────────────────────────┐
│ Notes                   │
├─────────────────────────┤
│ Referral Code: ABC12345 │
└─────────────────────────┘
```

#### 2. Line Item Attributes
```
📍 Location: Order details page → Products section → Click product → Custom attributes

Example:
Custom Meat Box - $189.00
  └─ Referral Code: ABC12345
```

#### 3. Order Timeline
```
📍 Location: Order details page → Timeline section (bottom)

Example:
Nov 19, 2025 at 3:45 PM
Order created
Attributes: Referral Code: ABC12345
```

---

## Common Support Scenarios

### Scenario 1: Customer Asks "Did my referral work?"

**Steps**:
1. Open their order in Shopify Admin
2. Check **Notes section** for "Referral Code: XXXXX"
3. If you see a code:
   - ✅ "Yes, your referral code ABC12345 was applied!"
   - Commission will be paid to the affiliate who referred you
4. If NO code:
   - ❌ "No referral code was found on this order"
   - They may have not used a referral link
   - Or cleared their browser before checkout

### Scenario 2: Affiliate Says "I didn't get credit for my referral"

**Steps**:
1. Ask for the **order number** or **customer email**
2. Open order in Shopify Admin
3. Check for referral code in notes
4. **If code matches theirs**:
   - Commission should be automatic
   - Check with tech team if not showing in dashboard
5. **If different code** or **no code**:
   - Customer may have used a different link
   - Or didn't use any referral link

### Scenario 3: Manual Commission Adjustment Needed

**When to escalate**:
- Referral code shows in Shopify but no commission in system
- Technical error prevented automatic processing
- Special case approved by management

**What to provide to tech team**:
- Order number: #1234
- Order total: $189.00
- Buyer email: customer@example.com
- Referral code: ABC12345
- Affiliate email: affiliate@example.com

---

## Referral Code Format

Referral codes are **8 characters**:
- All uppercase letters and numbers
- Example: `Z79MNV51`, `ABC12345`, `XYZ789AB`

**Red flags** (not valid referral codes):
- Less than 6 characters
- Contains special characters (!@#$%)
- All lowercase

---

## How Commissions Work

### Commission Structure

| Tier | Percentage | Who Gets It |
|------|-----------|-------------|
| 1 | 13% | Person who directly referred the buyer |
| 2 | 2% | Person who referred the Tier 1 affiliate |
| 3 | 1% | Person who referred the Tier 2 affiliate |
| 4 | 1% | Person who referred the Tier 3 affiliate |

### Example

```
Alice refers Bob → Bob refers Charlie → Charlie buys $100 box

Commissions paid:
- Bob earns: $13.00 (Tier 1 - direct referrer)
- Alice earns: $2.00 (Tier 2 - Bob's referrer)
```

### Commission Rates

**100% of commission**:
- Active subscribers (purchased + currently subscribed)

**50% of commission**:
- Signed up without purchase yet
- Paused subscription >60 days

---

## Checking Affiliate Information

### To Find Affiliate by Referral Code

**Option 1: Ask tech team to check database**
- Provide referral code
- They can find affiliate email and name

**Option 2: Look in internal spreadsheet** (if maintained)
- Referral codes should be logged

### Affiliate Dashboard Access

Affiliates can check their own stats at:
```
https://meatzy-website.vercel.app/dashboard
```

They will see:
- Pending balance
- Available balance
- Total earned
- Direct referrals list
- Commission history

---

## Troubleshooting

### "I used a referral link but don't see the code on my order"

**Possible causes**:
1. Cleared browser cookies before checkout
2. Used different browser/device for checkout
3. Clicked link but didn't complete purchase right away (code expired)

**Solution for next time**:
- Click referral link
- Complete purchase in same browser session
- Don't clear cookies before checkout

### "I'm an affiliate but didn't receive commission"

**Check**:
1. Does order show referral code in Shopify? (see above)
2. Has it been >24 hours since order? (usually processes within minutes)
3. Is buyer email verified?

**Escalate if**:
- Code is correct in Shopify
- Been >24 hours
- Still no commission in dashboard

### "Can I apply a referral code to an existing order?"

**Answer**: No, referral codes must be applied BEFORE checkout completes.

**Alternative**:
- Customer can place new order with referral link
- Cancel and refund first order (if just placed)
- Management may approve manual commission in special cases

---

## FAQ for Support Team

### Q: Can one order have multiple referral codes?
**A**: No, only one referral code per order (first one used wins)

### Q: Do referrals work on subscription renewals?
**A**: First order only. Renewals don't generate new commissions.

### Q: Can an affiliate refer themselves?
**A**: No, the system prevents self-referrals.

### Q: What if referral code is spelled wrong?
**A**: Codes are exact match only. Misspelled = not valid = no commission.

### Q: Can we manually add a referral code to an order?
**A**: No automated way. Would need tech team to manually create commission.

### Q: How long are referral codes valid?
**A**: Forever (unless affiliate account deactivated)

### Q: Do referral codes expire after clicking link?
**A**: Code saved in browser for 30 days or until cookies cleared.

---

## When to Contact Tech Team

**Immediate escalation**:
- Webhook not processing orders (no commissions being created)
- Database errors
- Shopify integration down
- Multiple affiliates reporting same issue

**Normal escalation** (within 24 hours):
- Individual commission not processed
- Dashboard not updating for one user
- Manual commission request approved by management
- Referral code showing in Shopify but not in system

**What to include**:
- Order number(s)
- Customer email(s)
- Affiliate email(s)
- Referral code(s)
- Screenshots if relevant
- Steps to reproduce (if technical issue)

---

## Quick Checks Script

When customer contacts you:

```
1. ✅ Get order number or email
2. ✅ Open order in Shopify Admin
3. ✅ Check Notes for "Referral Code: XXXXX"
4. ✅ If found → Confirm code to customer
5. ✅ If not found → Explain no referral detected
6. ✅ For commission issues → Escalate to tech team
```

---

## Useful Shopify Shortcuts

- **Find order by email**: Orders → Search → Enter email
- **Filter by date**: Orders → Filter → Date range
- **Export orders**: Orders → Export → CSV (can search for "Referral Code" in spreadsheet)
- **Order timeline**: Scroll to bottom of order detail page

---

## Commission Approval Process (Future)

Currently: **Auto-approved** (pending balance)

Future may include:
1. Pending → Review → Approved → Available
2. Manual approval by admin
3. Fraud checks
4. Minimum threshold ($50+) before approval

---

## Red Flags / Fraud Detection

Watch for:
- Same person creating multiple accounts with fake emails
- Affiliate referring only free/discounted orders
- Rapid succession of orders from same IP
- Chargebacks on referred orders
- Suspicious patterns in referral tree

**Report to management** if you notice unusual activity.

---

## Contact Information

**For tech support**:
- Email: [Your tech team email]
- Slack: #referral-system-support

**For commission disputes**:
- Email: [Commissions team email]
- Escalation: Management approval required

**For account issues**:
- Email: [Customer support email]

---

**Last Updated**: November 2025
**System Version**: 1.0 MVP
**Document Owner**: Support Team Lead

---

## Quick Checklist Printout

Print this for your desk:

```
┌─────────────────────────────────────────┐
│   REFERRAL CODE CHECK - QUICK GUIDE     │
├─────────────────────────────────────────┤
│                                         │
│ 1. Open order in Shopify               │
│                                         │
│ 2. Look in NOTES section                │
│    → "Referral Code: XXXXX"             │
│                                         │
│ 3. If found:                            │
│    ✅ Referral worked!                  │
│    ✅ Commission auto-processed         │
│                                         │
│ 4. If NOT found:                        │
│    ❌ No referral code used             │
│    ❌ No commission                     │
│                                         │
│ 5. For issues:                          │
│    → Escalate to tech team             │
│    → Include order # + code            │
│                                         │
└─────────────────────────────────────────┘
```

---

**Remember**: The system is automated! Most of the time, you'll just be confirming that referral codes are showing up correctly in Shopify orders. 😊
