import { createSupabaseServerClient } from '@/lib/supabase-server'
import type { Handshake } from '@/lib/supabase'
import HomePage from '@/components/HomePage'

const PAGE_SIZE = 12

export default async function Page() {
  try {
    const supabase = await createSupabaseServerClient()
    const since24h = new Date(Date.now() - 86400000).toISOString()

    const [itemsRes, countRes, dailyRes] = await Promise.all([
      supabase
        .from('handshakes')
        .select('*')
        .gte('created_at', since24h)
        .order('upvotes', { ascending: false })
        .range(0, PAGE_SIZE - 1),
      supabase
        .from('handshakes')
        .select('*', { count: 'exact', head: true }),
      supabase
        .from('handshakes')
        .select('*')
        .order('upvotes', { ascending: false })
        .limit(1),
    ])

    const initialItems = (itemsRes.data ?? []) as Handshake[]
    const dailyItem = (dailyRes.data?.[0] ?? null) as Handshake | null

    return (
      <HomePage
        initialItems={initialItems}
        initialHasMore={initialItems.length === PAGE_SIZE}
        totalCount={countRes.count ?? 0}
        dailyItem={dailyItem}
      />
    )
  } catch {
    return <HomePage initialItems={[]} initialHasMore={false} totalCount={0} dailyItem={null} />
  }
}
