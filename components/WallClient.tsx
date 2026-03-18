'use client'
import { useState, useCallback } from 'react'
import Card from '@/components/Card'
import { supabaseBrowser, type Handshake } from '@/lib/supabase'

type Tab = 'today' | 'week' | 'alltime'
const PAGE_SIZE = 12

function getTimeFilter(tab: Tab): string | null {
  if (tab === 'today') return new Date(Date.now() - 86400000).toISOString()
  if (tab === 'week')  return new Date(Date.now() - 7 * 86400000).toISOString()
  return null
}

interface WallClientProps {
  initialItems: Handshake[]
  initialHasMore: boolean
}

export default function WallClient({ initialItems, initialHasMore }: WallClientProps) {
  const [tab, setTab] = useState<Tab>('today')
  const [items, setItems] = useState<Handshake[]>(initialItems)
  const [loading, setLoading] = useState(false)
  const [offset, setOffset] = useState(PAGE_SIZE)
  const [hasMore, setHasMore] = useState(initialHasMore)

  const fetchItems = useCallback(async (currentTab: Tab, currentOffset: number, reset = false) => {
    setLoading(true)
    const since = getTimeFilter(currentTab)
    let query = supabaseBrowser
      .from('handshakes')
      .select('*')
      .order('upvotes', { ascending: false })
      .range(currentOffset, currentOffset + PAGE_SIZE - 1)
    if (since) query = query.gte('created_at', since)
    const { data } = await query
    const rows = (data ?? []) as Handshake[]
    setItems(prev => reset ? rows : [...prev, ...rows])
    setHasMore(rows.length === PAGE_SIZE)
    setLoading(false)
  }, [])

  function switchTab(newTab: Tab) {
    setTab(newTab)
    setOffset(PAGE_SIZE)
    fetchItems(newTab, 0, true)
  }

  function loadMore() {
    fetchItems(tab, offset)
    setOffset(o => o + PAGE_SIZE)
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'today',   label: 'today' },
    { key: 'week',    label: 'this week' },
    { key: 'alltime', label: 'all time' },
  ]

  return (
    <>
      <div className="inline-flex border border-black rounded overflow-hidden mb-8">
        {tabs.map((t, i) => (
          <button
            key={t.key}
            onClick={() => switchTab(t.key)}
            className={`px-4 py-2 text-[8px] leading-none transition-colors
                        ${i < tabs.length - 1 ? 'border-r border-black' : ''}
                        ${tab === t.key ? 'bg-black text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && items.length === 0 ? (
        <p className="text-[8px] text-gray-400" style={{ fontFamily: 'var(--font-pixel)' }}>loading...</p>
      ) : items.length === 0 ? (
        <p className="text-[8px] text-gray-400" style={{ fontFamily: 'var(--font-pixel)' }}>no handshakes yet — be the first!</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map(item => <Card key={item.id} item={item} />)}
          </div>
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="bg-white border border-gray-200 rounded-lg px-6 py-3 text-[8px]
                           transition-all hover:border-black hover:shadow-[3px_3px_0_#111] hover:-translate-x-0.5
                           hover:-translate-y-0.5 disabled:opacity-50"
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                {loading ? 'loading...' : 'load more'}
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}
