'use client'
import { useState, useEffect } from 'react'
import type { Handshake } from '@/lib/supabase'

interface CardProps {
  item: Handshake
}

export default function Card({ item }: CardProps) {
  const [upvotes, setUpvotes] = useState(item.upvotes)
  const [voted, setVoted] = useState(false)

  useEffect(() => {
    setVoted(!!localStorage.getItem(`voted:${item.id}`))
  }, [item.id])

  async function handleUpvote() {
    if (voted) return
    setUpvotes(v => v + 1)
    setVoted(true)
    localStorage.setItem(`voted:${item.id}`, '1')
    try {
      const res = await fetch('/api/upvote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id }),
      })
      if (!res.ok) throw new Error('upvote failed')
    } catch {
      setUpvotes(v => v - 1)
      setVoted(false)
      localStorage.removeItem(`voted:${item.id}`)
    }
  }

  const shareUrl = `/s?l=${encodeURIComponent(item.left)}&r=${encodeURIComponent(item.right)}&c=${encodeURIComponent(item.center ?? '')}`

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2
                 transition-all duration-150 hover:border-black hover:shadow-[4px_4px_0_#111] hover:-translate-x-0.5 hover:-translate-y-0.5"
    >
      <p className="text-[8px] leading-relaxed text-black" style={{ fontFamily: 'var(--font-pixel)' }}>
        {item.left} 🤝 {item.right}
      </p>
      {item.center && (
        <p className="text-[7px] text-gray-400 italic leading-relaxed" style={{ fontFamily: 'var(--font-pixel)' }}>
          &quot;{item.center}&quot;
        </p>
      )}
      <div className="flex items-center justify-between mt-1">
        <button
          onClick={handleUpvote}
          className={`border rounded-full px-3 py-1.5 text-[8px] leading-none
                      transition-all hover:border-black hover:shadow-[2px_2px_0_#111]
                      ${voted ? 'bg-[#FFD600] border-black' : 'bg-white border-gray-200 text-black'}`}
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          ▲ {upvotes}
        </button>
        <a
          href={shareUrl}
          className="text-[7px] text-gray-300 hover:text-black transition-colors"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          share ↗
        </a>
      </div>
    </div>
  )
}
