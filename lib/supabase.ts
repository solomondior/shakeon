import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export interface Handshake {
  id: string
  left: string
  right: string
  center: string | null
  upvotes: number
  react_laugh: number
  react_skull: number
  react_shake: number
  created_at: string
  hall_of_fame: boolean
  inducted_at: string | null
  era: string | null
}

let _client: SupabaseClient | null = null

// Lazy browser client — defers createClient until first use so build doesn't fail without env vars
export function getBrowserClient(): SupabaseClient {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _client
}

// Re-export as supabaseBrowser for convenience
export const supabaseBrowser = {
  from: (...args: Parameters<SupabaseClient['from']>) => getBrowserClient().from(...args),
}
