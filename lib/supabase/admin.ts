import { createClient } from '@supabase/supabase-js'

/**
 * Server-only Supabase client using the service role key.
 * Bypasses RLS — ONLY use in auth-gated server actions (requireAuth()).
 * The SUPABASE_SERVICE_KEY env var has no NEXT_PUBLIC_ prefix,
 * so Next.js never exposes it to the browser.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY

  if (!url || !serviceKey) {
    throw new Error('Missing SUPABASE_SERVICE_KEY — required for admin dashboard')
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
