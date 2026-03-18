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
      if (!res.ok) throw new Error()
    } catch {
      setUpvotes(v => v - 1)
      setVoted(false)
      localStorage.removeItem(`voted:${item.id}`)
    }
  }

  function handleMakeOne() {
    window.dispatchEvent(new CustomEvent('shakeon:prefill', {
      detail: { left: item.left, right: item.right, center: item.center ?? '' }
    }))
  }

  const shareUrl = `/s?l=${encodeURIComponent(item.left)}&r=${encodeURIComponent(item.right)}&c=${encodeURIComponent(item.center ?? '')}`
  const pxFont = { fontFamily: 'var(--font-pixel)' }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2 transition-all duration-150 hover:border-black hover:shadow-[4px_4px_0_#111] hover:-translate-x-0.5 hover:-translate-y-0.5">
      <p className="text-[8px] leading-relaxed text-black" style={pxFont}>
        {item.left} 🤝 {item.right}
      </p>
      {item.center && (
        <p className="text-[7px] text-gray-400 italic leading-relaxed" style={pxFont}>
          &quot;{item.center}&quot;
        </p>
      )}
      <div className="flex items-center justify-between mt-1 gap-2 flex-wrap">
        <button
          onClick={handleUpvote}
          className={`border rounded-full px-3 py-1.5 text-[8px] leading-none transition-all hover:border-black hover:shadow-[2px_2px_0_#111] ${voted ? 'bg-[#FFD600] border-black' : 'bg-white border-gray-200 text-black'}`}
          style={pxFont}
        >
          ▲ {upvotes}
        </button>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleMakeOne}
            className="text-[7px] text-gray-400 hover:text-black transition-colors"
            style={pxFont}
          >
            remix ↺
          </button>
          <a href={shareUrl} className="text-[7px] text-gray-300 hover:text-black transition-colors" style={pxFont}>
            share ↗
          </a>
        </div>
      </div>
    </div>
  )
}
