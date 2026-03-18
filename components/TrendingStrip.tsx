'use client'
import { useState, useEffect } from 'react'
import { getBrowserClient, type Handshake } from '@/lib/supabase'

export default function TrendingStrip() {
  const [items, setItems] = useState<Handshake[]>([])
  const [loading, setLoading] = useState(true)
  const pxFont = { fontFamily: 'var(--font-pixel)' }

  async function fetchTrending() {
    const since = new Date(Date.now() - 3600000).toISOString() // last hour
    const { data } = await getBrowserClient()
      .from('handshakes')
      .select('*')
      .gte('created_at', since)
      .order('upvotes', { ascending: false })
      .limit(5)
    setItems((data ?? []) as Handshake[])
    setLoading(false)
  }

  useEffect(() => {
    fetchTrending()
    const interval = setInterval(fetchTrending, 60000) // refresh every minute
    return () => clearInterval(interval)
  }, [])

  if (loading || items.length === 0) return null

  return (
    <div className="border border-gray-100 rounded-xl p-4 mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">🔥</span>
        <span className="text-[8px] text-gray-500" style={pxFont}>hot right now</span>
        <span className="text-[6px] text-gray-300 ml-auto" style={pxFont}>last hour</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => window.dispatchEvent(new CustomEvent('shakeon:prefill', {
              detail: { left: item.left, right: item.right, center: item.center ?? '' }
            }))}
            className="flex-shrink-0 border border-gray-100 rounded-lg px-3 py-2 hover:border-black hover:shadow-[2px_2px_0_#111] hover:-translate-y-0.5 transition-all bg-white text-left max-w-[180px]"
          >
            <p className="text-[7px] leading-relaxed text-black truncate" style={pxFont}>
              {item.left} 🤝 {item.right}
            </p>
            <p className="text-[6px] text-gray-400 mt-0.5" style={pxFont}>▲ {item.upvotes}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
