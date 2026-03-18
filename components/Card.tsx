'use client'
import { useState, useEffect } from 'react'
import type { Handshake } from '@/lib/supabase'
import CardModal from '@/components/CardModal'
import { useAdmin } from '@/lib/useAdmin'

interface CardProps {
  item: Handshake
}

type Reaction = 'laugh' | 'skull' | 'shake'

const REACTIONS: { key: Reaction; emoji: string }[] = [
  { key: 'laugh', emoji: '😂' },
  { key: 'skull', emoji: '💀' },
  { key: 'shake', emoji: '🤝' },
]

export default function Card({ item }: CardProps) {
  const [upvotes, setUpvotes]   = useState(item.upvotes)
  const [voted, setVoted]       = useState(false)
  const [counts, setCounts]     = useState({
    laugh: item.react_laugh ?? 0,
    skull: item.react_skull ?? 0,
    shake: item.react_shake ?? 0,
  })
  const [reacted, setReacted]   = useState<Reaction | null>(null)
  const [modalOpen, setModalOpen]   = useState(false)
  const [deleted, setDeleted]       = useState(false)
  const { isAdmin, secret }         = useAdmin()

  useEffect(() => {
    setVoted(!!localStorage.getItem(`voted:${item.id}`))
    setReacted(localStorage.getItem(`reacted:${item.id}`) as Reaction | null)
  }, [item.id])

  async function handleUpvote(e: React.MouseEvent) {
    e.stopPropagation()
    const newVoted = !voted
    setUpvotes(v => v + (newVoted ? 1 : -1))
    setVoted(newVoted)
    newVoted
      ? localStorage.setItem(`voted:${item.id}`, '1')
      : localStorage.removeItem(`voted:${item.id}`)
    fetch('/api/upvote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, decrement: !newVoted }),
    }).catch(() => {})
  }

  async function handleReact(e: React.MouseEvent, reaction: Reaction) {
    e.stopPropagation()
    const isRevoking = reacted === reaction
    const wasReacted = reacted

    if (isRevoking) {
      setCounts(c => ({ ...c, [reaction]: c[reaction] - 1 }))
      setReacted(null)
      localStorage.removeItem(`reacted:${item.id}`)
    } else {
      if (wasReacted) {
        setCounts(c => ({ ...c, [wasReacted]: c[wasReacted] - 1 }))
      }
      setCounts(c => ({ ...c, [reaction]: c[reaction] + 1 }))
      setReacted(reaction)
      localStorage.setItem(`reacted:${item.id}`, reaction)
    }

    // Remove old reaction if switching
    if (wasReacted && !isRevoking) {
      fetch('/api/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, reaction: wasReacted, decrement: true }),
      }).catch(() => {})
    }
    fetch('/api/react', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, reaction, decrement: isRevoking }),
    }).catch(() => {})
  }

  function handleMakeOne(e: React.MouseEvent) {
    e.stopPropagation()
    window.dispatchEvent(new CustomEvent('shakeon:prefill', {
      detail: { left: item.left, right: item.right, center: item.center ?? '' }
    }))
  }

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    if (!confirm(`Delete "${item.left} 🤝 ${item.right}"?`)) return
    setDeleted(true)
    try {
      const res = await fetch('/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, secret }),
      })
      if (!res.ok) {
        setDeleted(false)
        alert('Delete failed — check ADMIN_SECRET is set in Vercel env vars.')
      }
    } catch {
      setDeleted(false)
    }
  }

  const pxFont = { fontFamily: 'var(--font-pixel)' }
  const shareUrl = `/s?l=${encodeURIComponent(item.left)}&r=${encodeURIComponent(item.right)}&c=${encodeURIComponent(item.center ?? '')}`

  if (deleted) return null

  return (
    <>
      <div className="flex flex-col">
        {/* Card */}
        <div
          onClick={() => setModalOpen(true)}
          className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2 transition-all duration-150 hover:border-black hover:shadow-[4px_4px_0_#111] hover:-translate-x-0.5 hover:-translate-y-0.5 cursor-pointer"
        >
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
              <a href={shareUrl} onClick={e => e.stopPropagation()} className="text-[7px] text-gray-300 hover:text-black transition-colors" style={pxFont}>
                share ↗
              </a>
              {isAdmin && (
                <button onClick={handleDelete} className="text-[7px] text-red-400 hover:text-red-600 transition-colors" style={pxFont}>
                  del ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reactions */}
        <div className="flex items-center gap-1.5 flex-wrap px-3 mt-1 relative z-10">
          {REACTIONS.map(({ key, emoji }) => {
            const active = reacted === key
            const count  = counts[key]
            return (
              <button
                key={key}
                onClick={e => handleReact(e, key)}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] leading-none border shadow-sm transition-all
                  ${active
                    ? 'bg-[#FFD600] border-black shadow-[1px_1px_0_#111]'
                    : 'bg-white border-gray-200 hover:border-black'}`}
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

      {modalOpen && (
        <CardModal
          item={item}
          upvotes={upvotes}
          voted={voted}
          counts={counts}
          reacted={reacted}
          onUpvote={handleUpvote}
          onReact={handleReact}
          onMakeOne={handleMakeOne}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}
