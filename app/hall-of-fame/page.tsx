import { createSupabaseServerClient } from '@/lib/supabase-server'
import type { Handshake } from '@/lib/supabase'
import GoldenCard from '@/components/GoldenCard'
import Nav from '@/components/Nav'
import Link from 'next/link'

const pxFont = { fontFamily: 'var(--font-pixel)' }

export default async function HallOfFamePage() {
  const supabase = await createSupabaseServerClient()

  const [hofRes, countRes] = await Promise.all([
    supabase
      .from('handshakes')
      .select('*')
      .eq('hall_of_fame', true)
      .order('inducted_at', { ascending: false }),
    supabase
      .from('handshakes')
      .select('*', { count: 'exact', head: true }),
  ])

  const entries = (hofRes.data ?? []) as Handshake[]
  const total   = countRes.count ?? 0

  // Group by era
  const eraMap = new Map<string, Handshake[]>()
  for (const e of entries) {
    const era = e.era ?? (e.inducted_at
      ? new Date(e.inducted_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : 'The Classics')
    if (!eraMap.has(era)) eraMap.set(era, [])
    eraMap.get(era)!.push(e)
  }

  const eras = Array.from(eraMap.entries())

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Nav />

      <main className="max-w-5xl mx-auto w-full px-4 py-16 flex-1">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="text-4xl mb-4">👑</div>
          <h1 className="text-xl sm:text-2xl mb-4 text-black" style={pxFont}>
            HALL OF FAME
          </h1>
          <p className="text-[8px] text-gray-400 mb-6" style={pxFont}>
            the handshakes that transcended the wall
          </p>
          {total > 0 && (
            <div className="inline-block border border-[#FFE033] rounded-lg px-5 py-3 bg-[#FFFDE7]">
              <span className="text-[8px] text-black" style={pxFont}>
                {entries.length} inducted
              </span>
              <span className="text-[8px] text-gray-400 mx-2" style={pxFont}>
                out of
              </span>
              <span className="text-[8px] text-gray-600" style={pxFont}>
                {total.toLocaleString()} submitted
              </span>
            </div>
          )}
        </div>

        {/* Empty state */}
        {entries.length === 0 && (
          <div className="text-center py-24">
            <p className="text-[8px] text-gray-400 mb-3" style={pxFont}>
              no inductees yet
            </p>
            <p className="text-[7px] text-gray-300 mb-6" style={pxFont}>
              a handshake needs 50 upvotes to be inducted
            </p>
            <Link
              href="/"
              className="inline-block border border-gray-200 rounded-lg px-4 py-2 text-[7px] text-gray-500 transition-all hover:border-black hover:shadow-[2px_2px_0_#111]"
              style={pxFont}
            >
              go make one →
            </Link>
          </div>
        )}

        {/* Eras */}
        {eras.map(([era, cards]) => (
          <section key={era} className="mb-14">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-[9px] text-black shrink-0" style={pxFont}>
                ✦ {era}
              </h2>
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[6px] text-gray-400 shrink-0" style={pxFont}>
                {cards.length} {cards.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map(item => <GoldenCard key={item.id} item={item} />)}
            </div>
          </section>
        ))}

      </main>

      <footer className="text-center py-6 border-t border-gray-100">
        <p className="text-[6px] text-gray-300" style={pxFont}>
          induction threshold: 50 upvotes
        </p>
      </footer>
    </div>
  )
}
