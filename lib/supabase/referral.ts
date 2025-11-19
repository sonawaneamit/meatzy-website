import { createClient } from './client';

/**
 * Commission tiers (level → percentage)
 */
export const COMMISSION_TIERS = {
  1: 13.0,  // Direct referral
  2: 2.0,   // Second level
  3: 1.0,   // Third level
  4: 1.0,   // Fourth level
} as const;

/**
 * Get referrer user ID from referral code
 */
export async function getReferrerByCode(referralCode: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('users')
    .select('id, referral_code, full_name, email')
    .eq('referral_code', referralCode.toUpperCase())
    .single();

  if (error) {
    console.error('Error finding referrer:', error);
    return null;
  }

  return data;
}

/**
 * Create a new user with optional referrer
 */
export async function createUser(params: {
  email: string;
  fullName?: string;
  phone?: string;
  referralCode?: string;
  shopifyCustomerId?: string;
  hasPurchased?: boolean;
  authUserId?: string; // Optional auth user ID for signup
}) {
  const supabase = createClient();

  // Find referrer if code provided
  let referrerId = null;
  if (params.referralCode) {
    const referrer = await getReferrerByCode(params.referralCode);
    if (referrer) {
      referrerId = referrer.id;
    }
  }

  // Generate unique referral code
  const newReferralCode = await generateUniqueReferralCode();

  // Determine initial commission rate
  // 100% if they purchased, 50% if just signing up
  const commissionRate = params.hasPurchased ? 1.0 : 0.5;

  // Prepare user data
  const userData: any = {
    email: params.email,
    full_name: params.fullName,
    phone: params.phone,
    referral_code: newReferralCode,
    referrer_id: referrerId,
    shopify_customer_id: params.shopifyCustomerId,
    has_purchased: params.hasPurchased || false,
    commission_rate: commissionRate,
  };

  // If auth user ID is provided (from signup), use it as the user ID
  if (params.authUserId) {
    userData.id = params.authUserId;
  }

  const { data, error } = await supabase
    .from('users')
    .insert(userData)
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    throw error;
  }

  return data;
}

/**
 * Generate a unique 8-character referral code
 */
async function generateUniqueReferralCode(): Promise<string> {
  const supabase = createClient();

  for (let attempts = 0; attempts < 10; attempts++) {
    // Generate random 8-character code
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Check if it exists
    const { data } = await supabase
      .from('users')
      .select('id')
      .eq('referral_code', code)
      .single();

    if (!data) {
      return code;
    }
  }

  throw new Error('Failed to generate unique referral code');
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    return null;
  }

  return data;
}

/**
 * Get user by Shopify customer ID
 */
export async function getUserByShopifyId(shopifyCustomerId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('shopify_customer_id', shopifyCustomerId)
    .single();

  if (error) {
    return null;
  }

  return data;
}

/**
 * Calculate and create commissions for an order
 *
 * NEW LOGIC: Each affiliate earns from their entire downline (4 levels deep)
 * When someone makes a purchase, we find all their ancestors and pay each one
 * based on how deep the buyer is in THEIR network (not the buyer's depth)
 */
export async function calculateCommissions(params: {
  buyerUserId: string;
  orderId: string;
  orderTotal: number;
}) {
  const supabase = createClient();

  // Get ALL ancestors of the buyer (up to 4 levels up)
  // These are all the people who should earn commissions
  const { data: ancestors, error } = await supabase
    .from('user_tree')
    .select(`
      ancestor_id,
      level,
      users:ancestor_id (
        id,
        email,
        commission_rate,
        commission_override
      )
    `)
    .eq('user_id', params.buyerUserId)
    .lte('level', 4)
    .order('level', { ascending: true });

  if (error || !ancestors) {
    console.error('Error fetching ancestors:', error);
    return [];
  }

  console.log(`Found ${ancestors.length} ancestor(s) who will earn from this purchase`);

  const commissions = [];

  for (const ancestor of ancestors) {
    const user = ancestor.users as any;
    const tierLevel = ancestor.level; // How deep the buyer is in THIS ancestor's network

    // The tier level determines the commission percentage
    // Level 1 = buyer is directly referred by this ancestor = 13%
    // Level 2 = buyer is 2 levels down from this ancestor = 2%
    // Level 3 = buyer is 3 levels down from this ancestor = 1%
    // Level 4 = buyer is 4 levels down from this ancestor = 1%
    const basePercentage = COMMISSION_TIERS[tierLevel as keyof typeof COMMISSION_TIERS];

    // Get effective commission rate (override if set, else user's rate)
    const effectiveRate = user.commission_override || user.commission_rate;

    // Calculate commission amount
    const commissionAmount = (params.orderTotal * (basePercentage / 100)) * effectiveRate;

    console.log(`Paying ${user.email}: Tier ${tierLevel} = ${basePercentage}% × ${effectiveRate * 100}% rate = $${commissionAmount.toFixed(2)}`);

    // Create commission record
    const { data: commission, error: commissionError } = await supabase
      .from('commissions')
      .insert({
        user_id: ancestor.ancestor_id,
        order_id: params.orderId,
        referred_user_id: params.buyerUserId,
        tier_level: tierLevel,
        base_percentage: basePercentage,
        applied_rate: effectiveRate,
        order_total: params.orderTotal,
        commission_amount: commissionAmount,
        status: 'pending',
      })
      .select()
      .single();

    if (!commissionError && commission) {
      commissions.push(commission);

      // Update wallet pending balance
      await supabase.rpc('increment_pending_balance', {
        p_user_id: ancestor.ancestor_id,
        p_amount: commissionAmount,
      });
    } else {
      console.error(`Error creating commission for ${user.email}:`, commissionError);
    }
  }

  console.log(`Total commissions created: ${commissions.length}`);
  return commissions;
}

/**
 * Get user's referral tree (direct referrals)
 */
export async function getDirectReferrals(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_tree')
    .select(`
      user_id,
      users:user_id (
        id,
        email,
        full_name,
        created_at,
        has_purchased,
        subscriptions (
          status
        )
      )
    `)
    .eq('ancestor_id', userId)
    .eq('level', 1);

  if (error) {
    console.error('Error fetching direct referrals:', error);
    return [];
  }

  return data;
}

/**
 * Get user's full tree (all 4 levels)
 */
export async function getFullTree(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_tree')
    .select(`
      user_id,
      level,
      users:user_id (
        id,
        email,
        full_name,
        created_at
      )
    `)
    .eq('ancestor_id', userId)
    .order('level')
    .order('created_at');

  if (error) {
    console.error('Error fetching full tree:', error);
    return [];
  }

  return data;
}

/**
 * Get user's wallet balance
 */
export async function getWalletBalance(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('wallet')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching wallet:', error);
    return null;
  }

  return data;
}

/**
 * Get user's commission history
 */
export async function getCommissionHistory(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('commissions')
    .select(`
      *,
      referred_user:referred_user_id (
        email,
        full_name
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching commissions:', error);
    return [];
  }

  return data;
}
