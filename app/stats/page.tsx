import { createSupabaseServerClient } from '@/lib/supabase-server'
import type { Handshake } from '@/lib/supabase'
import Nav from '@/components/Nav'
import Link from 'next/link'

const STOP_WORDS = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','can','its','it','this','that','these','those','they','their','them','we','our','you','your','i','my','me','he','she','him','her','his','who','what','when','where','how','all','each','every','both','few','more','most','other','some','such','no','not','only','same','so','than','too','very','just','about','up','out','as'])

function getTopWords(rows: Handshake[]): Array<{ word: string; count: number }> {
  const freq: Record<string, number> = {}
  for (const row of rows) {
    const text = [row.left, row.right, row.center ?? ''].join(' ').toLowerCase()
    const words = text.match(/\b[a-z]{3,}\b/g) ?? []
    for (const w of words) {
      if (!STOP_WORDS.has(w)) freq[w] = (freq[w] ?? 0) + 1
    }
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => ({ word, count }))
}

export default async function StatsPage() {
  const pxFont = { fontFamily: 'var(--font-pixel)' }

  try {
    const supabase = await createSupabaseServerClient()

    const [countRes, topRes, longestRes, allRes] = await Promise.all([
      supabase.from('handshakes').select('*', { count: 'exact', head: true }),
      supabase.from('handshakes').select('*').order('upvotes', { ascending: false }).limit(1),
      supabase.from('handshakes').select('*').not('center', 'is', null).order('center', { ascending: false }).limit(100),
      supabase.from('handshakes').select('left, right, center').limit(500),
    ])

    const total = countRes.count ?? 0
    const topItem = (topRes.data?.[0] ?? null) as Handshake | null
    const longestItem = (longestRes.data ?? [])
      .sort((a, b) => (b.center?.length ?? 0) - (a.center?.length ?? 0))[0] as Handshake | null
    const topWords = getTopWords((allRes.data ?? []) as Handshake[])

    const stats = [
      { label: 'total handshakes', value: total.toLocaleString(), emoji: '🤝' },
      { label: 'total upvotes given', value: '–', emoji: '▲' },
    ]

    return (
      <main className="min-h-screen bg-white">
        <Nav />
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-xl sm:text-2xl leading-[1.6] mb-2" style={pxFont}>
            the stats 📊
          </h1>
          <p className="text-[7px] text-gray-400 mb-10 leading-relaxed" style={pxFont}>
            silly numbers that mean everything
          </p>

          {/* Big number */}
          <div className="border border-gray-100 rounded-xl p-8 text-center mb-6 hover:border-black hover:shadow-[4px_4px_0_#111] transition-all">
            <div className="text-5xl sm:text-7xl mb-3">🤝</div>
            <div className="text-3xl sm:text-5xl leading-none mb-2 text-black" style={pxFont}>
              {total.toLocaleString()}
            </div>
            <div className="text-[8px] text-gray-400" style={pxFont}>handshakes made</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Most upvoted */}
            {topItem && (
              <div className="border border-gray-100 rounded-xl p-5 hover:border-black hover:shadow-[4px_4px_0_#111] transition-all">
                <div className="text-[7px] text-gray-400 mb-3" style={pxFont}>🏆 most upvoted</div>
                <p className="text-[9px] leading-relaxed text-black mb-1" style={pxFont}>
                  {topItem.left} 🤝 {topItem.right}
                </p>
                {topItem.center && (
                  <p className="text-[7px] text-gray-400 italic mb-2" style={pxFont}>
                    &quot;{topItem.center}&quot;
                  </p>
                )}
                <span className="text-[7px] text-gray-500" style={pxFont}>▲ {topItem.upvotes} votes</span>
              </div>
            )}

            {/* Longest center label */}
            {longestItem?.center && (
              <div className="border border-gray-100 rounded-xl p-5 hover:border-black hover:shadow-[4px_4px_0_#111] transition-all">
                <div className="text-[7px] text-gray-400 mb-3" style={pxFont}>📏 longest center label</div>
                <p className="text-[9px] leading-relaxed text-black mb-1" style={pxFont}>
                  {longestItem.left} 🤝 {longestItem.right}
                </p>
                <p className="text-[7px] text-gray-400 italic mb-2" style={pxFont}>
                  &quot;{longestItem.center}&quot;
                </p>
                <span className="text-[7px] text-gray-500" style={pxFont}>
                  {longestItem.center.length} characters
                </span>
              </div>
            )}
          </div>

          {/* Top words */}
          {topWords.length > 0 && (
            <div className="border border-gray-100 rounded-xl p-5 mb-6 hover:border-black hover:shadow-[4px_4px_0_#111] transition-all">
              <div className="text-[7px] text-gray-400 mb-4" style={pxFont}>🗣️ most used words</div>
              <div className="flex flex-wrap gap-2">
                {topWords.map(({ word, count }) => (
                  <div
                    key={word}
                    className="border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2"
                  >
                    <span className="text-[8px] text-black" style={pxFont}>{word}</span>
                    <span className="text-[6px] text-gray-400 bg-gray-50 rounded px-1.5 py-0.5" style={pxFont}>{count}×</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              href="/#generator"
              className="inline-block bg-[#FFD600] border border-black rounded-lg px-5 py-3 text-[9px] leading-none shadow-[3px_3px_0_#111] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#111] text-black"
              style={pxFont}
            >
              make one →
            </Link>
          </div>
        </div>
      </main>
    )
  } catch {
    return (
      <main className="min-h-screen bg-white">
        <Nav />
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <p className="text-[8px] text-gray-400" style={pxFont}>stats unavailable — check your supabase connection</p>
        </div>
      </main>
    )
  }
}
