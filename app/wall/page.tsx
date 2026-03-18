import Nav from '@/components/Nav'
import WallClient from '@/components/WallClient'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import type { Handshake } from '@/lib/supabase'

const PAGE_SIZE = 12

export default async function WallPage() {
  const supabase = await createSupabaseServerClient()
  const since = new Date(Date.now() - 86400000).toISOString()
  const { data } = await supabase
    .from('handshakes')
    .select('*')
    .gte('created_at', since)
    .order('upvotes', { ascending: false })
    .range(0, PAGE_SIZE - 1)

  const initialItems = (data ?? []) as Handshake[]

  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1
          className="text-xl sm:text-2xl leading-[1.5] mb-8 text-black"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          the wall 🏆
        </h1>
        <WallClient
          initialItems={initialItems}
          initialHasMore={initialItems.length === PAGE_SIZE}
        />
      </div>
    </main>
  )
}
