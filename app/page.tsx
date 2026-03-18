import { createSupabaseServerClient } from '@/lib/supabase-server'
import type { Handshake } from '@/lib/supabase'
import HomePage from '@/components/HomePage'

const PAGE_SIZE = 12

export default async function Page() {
  try {
    const supabase = await createSupabaseServerClient()
    const since = new Date(Date.now() - 86400000).toISOString()

    const [itemsRes, countRes] = await Promise.all([
      supabase
        .from('handshakes')
        .select('*')
        .gte('created_at', since)
        .order('upvotes', { ascending: false })
        .range(0, PAGE_SIZE - 1),
      supabase
        .from('handshakes')
        .select('*', { count: 'exact', head: true }),
    ])

    const initialItems = (itemsRes.data ?? []) as Handshake[]

    return (
      <HomePage
        initialItems={initialItems}
        initialHasMore={initialItems.length === PAGE_SIZE}
        totalCount={countRes.count ?? 0}
      />
    )
  } catch {
    // Fallback for missing env vars during dev
    return <HomePage initialItems={[]} initialHasMore={false} totalCount={0} />
  }
}
