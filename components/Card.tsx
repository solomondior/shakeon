'use client'
import { useState, useEffect } from 'react'
import type { Handshake } from '@/lib/supabase'

interface CardProps {
  item: Handshake
}

type Reaction = 'laugh' | 'skull' | 'shake'

const REACTIONS: { key: Reaction; emoji: string; field: keyof Handshake }[] = [
  { key: 'laugh', emoji: '😂', field: 'react_laugh' },
  { key: 'skull', emoji: '💀', field: 'react_skull' },
  { key: 'shake', emoji: '🤝', field: 'react_shake' },
]

export default function Card({ item }: CardProps) {
  const [upvotes, setUpvotes] = useState(item.upvotes)
  const [voted, setVoted] = useState(false)
  const [counts, setCounts] = useState({
    laugh: item.react_laugh ?? 0,
    skull: item.react_skull ?? 0,
    shake: item.react_shake ?? 0,
  })
  const [reacted, setReacted] = useState<Reaction | null>(null)

  useEffect(() => {
    setVoted(!!localStorage.getItem(`voted:${item.id}`))
    const stored = localStorage.getItem(`reacted:${item.id}`) as Reaction | null
    setReacted(stored)
  }, [item.id])

  async function handleUpvote() {
    const newVoted = !voted
    setUpvotes(v => v + (newVoted ? 1 : -1))
    setVoted(newVoted)
    if (newVoted) {
      localStorage.setItem(`voted:${item.id}`, '1')
    } else {
      localStorage.removeItem(`voted:${item.id}`)
    }
    try {
      const res = await fetch('/api/upvote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, decrement: !newVoted }),
      })
      if (!res.ok) throw new Error()
    } catch {
      // Revert on failure
      setUpvotes(v => v + (newVoted ? -1 : 1))
      setVoted(!newVoted)
      if (!newVoted) {
        localStorage.setItem(`voted:${item.id}`, '1')
      } else {
        localStorage.removeItem(`voted:${item.id}`)
      }
    }
  }

  async function handleReact(reaction: Reaction) {
    if (reacted) return
    setCounts(c => ({ ...c, [reaction]: c[reaction] + 1 }))
    setReacted(reaction)
    localStorage.setItem(`reacted:${item.id}`, reaction)
    try {
      const res = await fetch('/api/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, reaction }),
      })
      if (!res.ok) throw new Error()
    } catch {
      setCounts(c => ({ ...c, [reaction]: c[reaction] - 1 }))
      setReacted(null)
      localStorage.removeItem(`reacted:${item.id}`)
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
    <div className="flex flex-col">
      {/* Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2 transition-all duration-150 hover:border-black hover:shadow-[4px_4px_0_#111] hover:-translate-x-0.5 hover:-translate-y-0.5">
        <p className="text-[8px] leading-relaxed text-black" style={pxFont}>
          {item.left} 🤝 {item.right}
        </p>
        {item.center && (
          <p className="text-[7px] text-gray-400 italic leading-relaxed" style={pxFont}>
            &quot;{item.center}&quot;
          </p>
        )}

        {/* Upvote + actions row */}
        <div className="flex items-center justify-between mt-1 gap-2 flex-wrap">
          <button
            onClick={handleUpvote}
            className={`border rounded-full px-3 py-1.5 text-[8px] leading-none transition-all hover:border-black hover:shadow-[2px_2px_0_#111] ${voted ? 'bg-[#FFD600] border-black' : 'bg-white border-gray-200 text-black'}`}
            style={pxFont}
          >
            ▲ {upvotes}
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={handleMakeOne} className="text-[7px] text-gray-400 hover:text-black transition-colors" style={pxFont}>
              remix ↺
            </button>
            <a href={shareUrl} className="text-[7px] text-gray-300 hover:text-black transition-colors" style={pxFont}>
              share ↗
            </a>
          </div>
        </div>
      </div>

      {/* Reactions — overlap bottom edge of card like iMessage */}
      <div className="flex items-center gap-1.5 flex-wrap px-3 mt-0.8 relative z-10">
        {REACTIONS.map(({ key, emoji }) => {
          const active = reacted === key
          const count = counts[key]
          return (
            <button
              key={key}
              onClick={() => handleReact(key)}
              disabled={!!reacted}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] leading-none border shadow-sm transition-all
                ${active
                  ? 'bg-[#FFD600] border-black shadow-[1px_1px_0_#111]'
                  : 'bg-white border-gray-200 hover:border-black'}
                disabled:cursor-default`}
            >
              <span>{emoji}</span>
              {count > 0 && (
                <span className="text-[7px] text-black" style={pxFont}>{count}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
