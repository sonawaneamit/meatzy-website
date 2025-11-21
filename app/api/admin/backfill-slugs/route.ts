import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Admin API: Backfill missing slugs for all users
 * One-time migration endpoint
 * Uses service role to bypass RLS
 */
export async function POST(request: NextRequest) {
  try {
    // Create service role client for elevated permissions
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Verify user is authenticated and is admin
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
    }

    // Check if user is admin
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (userError || !userData?.is_admin) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    console.log('Starting slug backfill...');

    // Fetch all users without slugs
    const { data: usersWithoutSlugs, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('id, full_name, email, slug')
      .is('slug', null);

    if (fetchError) {
      console.error('Error fetching users:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch users', details: fetchError.message }, { status: 500 });
    }

    if (!usersWithoutSlugs || usersWithoutSlugs.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All users already have slugs',
        updated: 0
      });
    }

    console.log(`Found ${usersWithoutSlugs.length} users without slugs`);

    const results: { success: string[]; failed: string[] } = {
      success: [],
      failed: []
    };

    // Generate and update slugs for each user
    for (const userRecord of usersWithoutSlugs) {
      try {
        const nameForSlug = userRecord.full_name || userRecord.email?.split('@')[0] || 'user';
        const slug = await generateUniqueSlug(nameForSlug, userRecord.id, supabaseAdmin);

        const { error: updateError } = await supabaseAdmin
          .from('users')
          .update({ slug })
          .eq('id', userRecord.id);

        if (updateError) {
          console.error(`Failed to update slug for ${userRecord.email}:`, updateError);
          results.failed.push(userRecord.email);
        } else {
          console.log(`Generated slug for ${userRecord.email}: ${slug}`);
          results.success.push(`${userRecord.email} -> ${slug}`);
        }
      } catch (err) {
        console.error(`Error generating slug for ${userRecord.email}:`, err);
        results.failed.push(userRecord.email);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Backfill complete`,
      updated: results.success.length,
      failed: results.failed.length,
      details: results
    });

  } catch (error) {
    console.error('Error in backfill-slugs API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Generate a unique human-readable slug for SafeLinks
 * Format: {firstName}-{4chars}
 */
async function generateUniqueSlug(name: string, userId: string, supabase: any): Promise<string> {
  // Create base from first name
  const base = name
    .toLowerCase()
    .split(' ')[0]
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 15);

  const cleanBase = base || 'user';
  const suffix = userId.slice(0, 4);

  let slug = `${cleanBase}-${suffix}`;

  // Check for collision and regenerate if needed
  for (let attempts = 0; attempts < 10; attempts++) {
    const { data } = await supabase
      .from('users')
      .select('id')
      .eq('slug', slug)
      .single();

    if (!data) {
      return slug;
    }

    // On collision, add random chars
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    slug = `${cleanBase}-${randomSuffix}`;
  }

  throw new Error('Failed to generate unique slug');
}
