import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Custom login endpoint that handles temporary passwords
 *
 * Flow:
 * 1. Check if user exists in users table with matching email + temp password
 * 2. If yes, check if they have an auth account
 * 3. If no auth account, create one with the temp password
 * 4. Log them in
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Use service role client to check users table
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user exists with this email and temp password
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if the password matches the temporary password
    if (user.temporary_password && user.temporary_password === password) {
      // This is a temp password login - create auth account if it doesn't exist
      try {
        // Try to sign in first to see if auth account exists
        const anonClient = createClient(supabaseUrl, supabaseAnonKey);
        const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({
          email,
          password,
        });

        if (signInData.session) {
          // Auth account exists and password works!
          return NextResponse.json({
            success: true,
            session: signInData.session,
            requiresPasswordChange: user.requires_password_change,
          });
        }

        // Auth account doesn't exist or password is wrong - create it
        console.log('Creating auth account for webhook user:', email);

        // Delete the users record temporarily to avoid trigger conflict
        await supabaseAdmin.from('users').delete().eq('id', user.id);

        // Create auth account with temp password
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });

        if (authError) {
          console.error('Error creating auth account:', authError);
          // Restore the users record
          await supabaseAdmin.from('users').insert(user);
          throw authError;
        }

        console.log('Auth account created, updating users record...');

        // Update the auto-created users record with webhook data
        const { error: updateError } = await supabaseAdmin
          .from('users')
          .update({
            ...user,
            id: authData.user.id, // Keep the original data but update ID to match auth
          })
          .eq('id', authData.user.id);

        if (updateError) {
          console.error('Error updating users record:', updateError);
        }

        // Now sign them in
        const { data: finalSignIn, error: finalSignInError } = await anonClient.auth.signInWithPassword({
          email,
          password,
        });

        if (finalSignInError) {
          throw finalSignInError;
        }

        return NextResponse.json({
          success: true,
          session: finalSignIn.session,
          requiresPasswordChange: user.requires_password_change,
        });

      } catch (error: any) {
        console.error('Temp password login error:', error);
        return NextResponse.json(
          { error: 'Failed to log in. Please try again.' },
          { status: 500 }
        );
      }
    }

    // Not a temp password - try normal login
    const anonClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      session: signInData.session,
      requiresPasswordChange: false,
    });

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
