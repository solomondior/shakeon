'use client'
import { useEffect, useState } from 'react'
import { getBrowserClient } from '@/lib/supabase'
import type { Handshake } from '@/lib/supabase'

const pxFont = { fontFamily: 'var(--font-pixel)' }

export default function HofBanner() {
  const [inductee, setInductee] = useState<Handshake | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const client = getBrowserClient()
    const channel = client
      .channel('hof-inductions')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'handshakes', filter: 'hall_of_fame=eq.true' },
        (payload) => {
          const row = payload.new as Handshake
          if (row.hall_of_fame && !payload.old.hall_of_fame) {
            setInductee(row)
            setVisible(true)
            setTimeout(() => setVisible(false), 6000)
          }
        }
      )
      .subscribe()

    return () => { client.removeChannel(channel) }
  }, [])

  if (!inductee) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-4 py-3 transition-all duration-500"
      style={{
        background: '#FFE033',
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        borderBottom: '2px solid #111',
      }}
    >
      <span className="text-[8px] text-black" style={pxFont}>
        👑 hall of fame induction — {inductee.left} 🤝 {inductee.right}
      </span>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 text-[8px] text-black/60 hover:text-black"
        style={pxFont}
      >
        ✕
      </button>
    </div>
  )
}
