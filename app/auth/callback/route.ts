import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get('token_hash') || requestUrl.searchParams.get('token');
  const type = requestUrl.searchParams.get('type');
  const code = requestUrl.searchParams.get('code');
  const redirectTo = requestUrl.searchParams.get('redirect_to') || '/dashboard';

  console.log('[Auth Callback] Received params:', {
    has_token_hash: !!token_hash,
    type,
    has_code: !!code,
    redirectTo
  });

  const supabase = await createClient();

  // Handle PKCE flow (code-based) - most common for magic links
  if (code) {
    console.log('[Auth Callback] Exchanging code for session...');
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('[Auth Callback] Error exchanging code for session:', error);
      return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
    }

    console.log('[Auth Callback] ✓ Session created for user:', data.user?.email);
  }
  // Handle token-based flow (magic link with token_hash)
  else if (token_hash && type) {
    console.log('[Auth Callback] Verifying OTP token...');
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token_hash,
      type: type as any,
    });

    if (error) {
      console.error('[Auth Callback] Error verifying OTP:', error);
      return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
    }

    console.log('[Auth Callback] ✓ Session created for user:', data.user?.email);
  } else {
    console.error('[Auth Callback] No valid auth parameters found');
    return NextResponse.redirect(new URL('/login?error=no_auth_params', request.url));
  }

  console.log('[Auth Callback] Redirecting to:', redirectTo);

  // Redirect to the intended destination
  const response = NextResponse.redirect(new URL(redirectTo, request.url));

  return response;
}
