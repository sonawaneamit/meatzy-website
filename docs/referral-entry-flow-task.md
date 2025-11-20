# Referral Entry Flow Implementation Task

## High Level Goal

Implement a simple but safe referral entry flow with:

1. **Unique SafeLinks** for each affiliate, so they can share `https://mydomain.com/go/[slug]`
2. **A referral cookie** that gets set when someone clicks a SafeLink
3. **A global announcement bar** (and optional popup) on the headless site that says something like:
   > "Natalia sent you $10 off your first box. It will apply automatically at checkout."
   
   ...and persists across the session.

We are not working on the thank you page or final commission calculation in this task.

---

## Very Important Constraints

- I already have Supabase set up with user/referral structures.
- **Do not redesign or break existing Supabase schema.**
- Only append what is necessary: add columns or new tables if really needed, but keep them minimal and compatible.
- Work with the existing Next.js architecture (app router vs pages router) rather than introducing a new structure.

---

## Step 1: Understand the Existing Setup

1. Clone or open https://github.com/sonawaneamit/meatzy-website

2. Identify:
   - Whether the project uses the **app router** (`app/`) or **pages router** (`pages/`)
   - Where Supabase is initialized and how the SDK is used (for example `lib/supabaseClient`, `utils/supabase`, hooks, etc.)
   - Which table(s) in Supabase represent:
     - Users / customers
     - Affiliates / referrers
     - Referral codes, if they already exist

3. Summarize the current Supabase schema relevant to affiliates in your own words before you change anything.

> ⚠️ **Do not change any file or schema yet—just understand and describe.**

---

## Step 2: Design the Minimal Supabase Additions

Design how to support SafeLinks using the existing structure.

### Goals

- Each affiliate gets a unique, human-readable slug used in URLs:
  ```
  https://mydomain.com/go/[slug]
  ```
- Two different affiliates must never share the same slug.
- We do not want plain first names like `/go/natalia` because there may be many Natalias.
- A good pattern for slugs is `<base>-<shortSuffix>`, for example:
  - `natalia-8c4f`
  - `jorge-19ab`

### Implementation

Use the existing affiliate table (whatever it is called in the repo), and:

1. If there is not already a suitable column:
   - Propose adding a `slug` or `safe_slug` text column to that table.

2. If you need it, you can also add a `public_display_name` or reuse an existing name field for the announcement bar text.

### Requirements

- The slug must be **unique**.
- The slug should be **stable** once assigned.
- Generating the slug should:
  - Use something derived from the affiliate, such as their first name / username / handle.
  - Append a short random string or id fragment to guarantee uniqueness.
  - Check for collisions in Supabase and regenerate if needed.

**Propose the exact column names and how to generate the slug, then implement it.**

If schema migrations are done through SQL in Supabase, write a migration snippet **only for the new column(s)**—no destructive changes.

---

## Step 3: Implement SafeLink Slug Generation

Once the data model is agreed, implement code that assigns a slug to each affiliate.

### Requirements

1. When a new affiliate is created (wherever that currently happens in the project), ensure a slug is generated and stored if it does not already exist.

2. Also create a **backfill script or utility** that:
   - Finds existing affiliate rows that have no slug.
   - Generates unique slugs for them.
   - Updates Supabase.

### Slug Generation Rules

- **Base part**: derived from a safe string (for example normalized first name or username, lowercased, spaces to hyphens).
- **Suffix**: 3–5 character random alphanumeric or a short hash from the affiliate id.
- **Final slug example**: `natalia-8c4f`
- Must ensure uniqueness by checking Supabase before finalizing.

Write this logic in TypeScript consistent with how the rest of the app talks to Supabase.

---

## Step 4: Create the SafeLink Route `/go/[slug]`

Implement a route that will be the public entry point for referrals.

### Behavior

1. **Route path**: `/go/[slug]`
   - If the project uses the **app router**, implement this in `app/go/[slug]/route.ts` and return a redirect.
   - If it uses the **pages router**, implement in `pages/go/[slug].tsx` or similar, using `getServerSideProps` to handle the redirect and cookies.

2. **On request**:
   - Extract `slug` from the URL.
   - Look up the affiliate in Supabase using this slug.
   - **If no affiliate is found**: Redirect to the homepage, for example `/`.
   - **If an affiliate is found**: Create or update a cookie that stores the referral.

3. **Cookie details**:
   - **Name**: something like `meatzy_ref`
   - **Content** can be:
     - Either a compact JSON string.
     - Or separate cookies for id and slug.
   - At minimum it should encode:
     - `affiliateId` (Supabase row id or UUID)
     - `slug`
   - Set a reasonable expiry, for example 7–30 days.
   - Use the cookie utilities that match the Next.js router in the project:
     - `cookies()` from `next/headers` in app router.
     - `res.setHeader('Set-Cookie', ...)` in pages router.

4. **After setting the cookie**:
   - Redirect the user to the main storefront landing page, for example `/` or `/build-your-box`.
   - Optionally, include a `ref` query param as a backup: `/?ref=[slug]`.

> Keep this page server-side only—no UI needed here.

---

## Step 5: Implement a ReferralContext on the Frontend

Create a React context to make referral data available to all pages and components, especially the announcement bar.

### Requirements

1. Add a new context provider, for example `ReferralProvider`:
   - On the server side (preferred), read the `meatzy_ref` cookie.
   - If present, use Supabase to fetch the affiliate's public information:
     - At minimum a public name or label to show in the announcement bar, for example `displayName` such as "Natalia".
   - Pass this as initial data into the client side via props or a serialized object.
   
   If server-side access to Supabase is complex in this project, you can:
   - Do a first pass using only the cookie data on the client.
   - Optionally fire a client-side Supabase fetch to hydrate the display name.

2. The `ReferralContext` value should include:
   - `hasReferral: boolean`
   - `affiliateId: string | null`
   - `affiliateSlug: string | null`
   - `referrerName: string | null` (for the announcement bar)

3. Wrap the root layout or top-level component (for example in `app/layout.tsx` or `_app.tsx`) with `ReferralProvider` so all pages can access it.

> Make sure this integrates cleanly with the existing providers (auth, theme, etc.) without breaking anything.

---

## Step 6: Build the Announcement Bar Component

Create a reusable announcement bar that appears at the top of the site whenever there is valid referral data.

### Requirements

1. **New component**, for example `components/ReferralBar.tsx`:
   - Uses `useReferral()` hook from the context.
   - If `hasReferral` is false, render nothing.
   - If `hasReferral` is true, render a slim bar, for example:
     > "🎁 {referrerName} sent you $10 off your first box. It will apply automatically at checkout."

2. Mount this bar in the main layout, above the main content, so it appears on all pages during the session.

3. **Optional popup behavior**:
   - Implement a simple, first-visit-only popup that uses `sessionStorage` to avoid annoying users:
     - Key, for example `meatzy_ref_popup_seen`.
     - If no key exists and there is referral data, show a one-time popup summarizing the offer.
     - On dismiss, set `sessionStorage` so it does not show again this session, while the announcement bar remains visible.

> Use whatever styling system the repo already uses (Tailwind, CSS modules, etc.). Do not introduce any new UI frameworks.

---

## Step 7: Thread Referral into Checkout (Light Touch)

We are not implementing discount code or thank you page behavior yet, but please prepare for it by:

1. Finding where the code builds the Shopify checkout URL or starts the checkout flow.

2. Ensure that when there is an active referral in `ReferralContext`, you:
   - Pass the affiliate identifier either as:
     - A **cart attribute**, for example `referral_affiliate_id`.
     - Or as part of the **checkout URL query parameters**, for example `?ref=[affiliateSlug]`.

> Keep this minimal—just enough so that later we can use Shopify webhooks to attribute orders to affiliates.
>
> ⚠️ **Do not implement the full discount logic now.**

---

## Step 8: Code Quality and Explanation

As you implement:

1. Keep TypeScript types consistent with the project configuration (strict mode, ESLint, etc.).
2. Reuse existing Supabase utilities for client and server access.
3. Avoid breaking existing auth and user flows.

---

## Final Deliverables

When you are done, point me to:

### Files and Code
- The new or modified files and key functions.
- Any Supabase SQL or migration snippets you created for the new columns.

### Testing Instructions

How to test the full flow locally:

1. Create or pick an affiliate.
2. Get their SafeLink.
3. Visit `/go/[slug]`.
4. Confirm the cookie is set.
5. Confirm the announcement bar shows the correct name and remains across pages.
6. Confirm checkout is now aware of the referral via attributes or query params.

---

> ⚠️ **Important**: Do not invent a completely new architecture. Work with what is in `meatzy-website` and extend it carefully.
