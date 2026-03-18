import type { Handshake } from '@/lib/supabase'

interface DailyHandshakeProps {
  item: Handshake | null
}

const pxFont = 'font-[\'Press_Start_2P\']'

export default function DailyHandshake({ item }: DailyHandshakeProps) {
  if (!item) return null

  const shareUrl = `/s?l=${encodeURIComponent(item.left)}&r=${encodeURIComponent(item.right)}&c=${encodeURIComponent(item.center ?? '')}`

  return (
    <div className="mb-8 border-2 border-black rounded-xl p-5 relative bg-[#FFFDE7] shadow-[4px_4px_0_#111]">
      {/* Badge */}
      <div
        className="inline-flex items-center gap-1.5 bg-black text-white rounded-full px-3 py-1.5 text-[7px] leading-none mb-4"
        style={{ fontFamily: 'var(--font-pixel)' }}
      >
        🏆 handshake of the day
      </div>

      <p className="text-[10px] leading-relaxed text-black mb-2" style={{ fontFamily: 'var(--font-pixel)' }}>
        {item.left} 🤝 {item.right}
      </p>
      {item.center && (
        <p className="text-[8px] text-gray-600 italic leading-relaxed mb-4" style={{ fontFamily: 'var(--font-pixel)' }}>
          &quot;{item.center}&quot;
        </p>
      )}
      <div className="flex items-center gap-3">
        <span className="text-[7px] text-gray-500" style={{ fontFamily: 'var(--font-pixel)' }}>
          ▲ {item.upvotes} votes
        </span>
        <a
          href={shareUrl}
          className="text-[7px] text-gray-400 hover:text-black transition-colors"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          share ↗
        </a>
        <button
          onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('shakeon:prefill', {
            detail: { left: item.left, right: item.right, center: item.center ?? '' }
          }))}
          className="text-[7px] text-gray-400 hover:text-black transition-colors ml-auto"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          remix ↺
        </button>
      </div>
    </div>
  )
}
