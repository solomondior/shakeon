'use client'
import { useEffect } from 'react'
import type { Handshake } from '@/lib/supabase'

type Reaction = 'laugh' | 'skull' | 'shake'

const REACTIONS: { key: Reaction; emoji: string }[] = [
  { key: 'laugh', emoji: '😂' },
  { key: 'skull', emoji: '💀' },
  { key: 'shake', emoji: '🤝' },
]

interface CardModalProps {
  item: Handshake
  upvotes: number
  voted: boolean
  counts: { laugh: number; skull: number; shake: number }
  reacted: Reaction | null
  onUpvote: (e: React.MouseEvent) => void
  onReact: (e: React.MouseEvent, r: Reaction) => void
  onMakeOne: (e: React.MouseEvent) => void
  onClose: () => void
}

export default function CardModal({
  item, upvotes, voted, counts, reacted,
  onUpvote, onReact, onMakeOne, onClose,
}: CardModalProps) {
  const pxFont = { fontFamily: 'var(--font-pixel)' }
  const shareUrl = `/s?l=${encodeURIComponent(item.left)}&r=${encodeURIComponent(item.right)}&c=${encodeURIComponent(item.center ?? '')}`

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        className="bg-white border-2 border-black rounded-2xl w-full max-w-md shadow-[6px_6px_0_#111] flex flex-col"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'modalIn 0.2s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <span className="text-[7px] text-gray-400" style={pxFont}>shakeon</span>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors text-lg leading-none">✕</button>
        </div>

        {/* Meme */}
        <div className="px-6 py-8 text-center">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 gap-y-4">
            <p className="text-right text-[11px] leading-relaxed text-black break-words" style={pxFont}>
              {item.left}
            </p>
            <div className="text-[72px] leading-none select-none">🤝</div>
            <p className="text-left text-[11px] leading-relaxed text-black break-words" style={pxFont}>
              {item.right}
            </p>
          </div>
          {item.center && (
            <div className="mt-5 flex justify-center">
              <span className="border border-gray-200 rounded-full px-5 py-2 text-[9px] text-gray-600 leading-relaxed" style={pxFont}>
                {item.center}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex flex-col gap-3">
          {/* Upvote + reactions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onUpvote}
              className={`border rounded-full px-3 py-1.5 text-[8px] leading-none transition-all hover:border-black hover:shadow-[2px_2px_0_#111] ${voted ? 'bg-[#FFD600] border-black' : 'bg-white border-gray-200'}`}
              style={pxFont}
            >
              ▲ {upvotes}
            </button>
            {REACTIONS.map(({ key, emoji }) => {
              const active = reacted === key
              const count  = counts[key]
              return (
                <button
                  key={key}
                  onClick={e => onReact(e, key)}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] leading-none border transition-all
                    ${active ? 'bg-[#FFD600] border-black shadow-[1px_1px_0_#111]' : 'bg-white border-gray-200 hover:border-black'}`}
                >
                  <span>{emoji}</span>
                  {count > 0 && <span className="text-[7px] text-black" style={pxFont}>{count}</span>}
                </button>
              )
            })}
          </div>

          {/* Bottom row */}
          <div className="flex items-center gap-3 pt-1 border-t border-gray-100">
            <button
              onClick={e => { onMakeOne(e); onClose() }}
              className="text-[7px] text-gray-400 hover:text-black transition-colors"
              style={pxFont}
            >
              remix ↺
            </button>
            <a
              href={shareUrl}
              className="text-[7px] text-gray-400 hover:text-black transition-colors"
              style={pxFont}
            >
              share ↗
            </a>
            <span className="text-[6px] text-gray-300 ml-auto" style={pxFont}>
              {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
