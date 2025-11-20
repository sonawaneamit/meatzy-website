import { createClient } from '@supabase/supabase-js';

/**
 * Service role client with full database permissions
 * Use ONLY for server-side operations that require elevated privileges
 * Never expose this client to the browser
 */
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}
