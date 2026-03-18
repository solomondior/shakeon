import type { Handshake } from '@/lib/supabase'

const pxFont = { fontFamily: 'var(--font-pixel)' }

export default function GoldenCard({ item }: { item: Handshake }) {
  const date = item.inducted_at
    ? new Date(item.inducted_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <div className="golden-card group relative bg-[#FFFDE7] border-2 border-[#FFE033] rounded-xl p-5 flex flex-col gap-3 transition-all duration-150 hover:shadow-[4px_4px_0_#111] hover:-translate-x-0.5 hover:-translate-y-0.5">

      {/* Shimmer overlay */}
      <div className="shimmer absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100" />

      {/* Crown + inducted date */}
      <div className="flex items-center justify-between">
        <span className="text-base">👑</span>
        {date && (
          <span className="text-[6px] text-gray-400" style={pxFont}>
            inducted {date}
          </span>
        )}
      </div>

      {/* Content */}
      <p className="text-[9px] leading-relaxed text-black" style={pxFont}>
        {item.left} 🤝 {item.right}
      </p>

      {item.center && (
        <p className="text-[7px] text-gray-500 italic leading-relaxed" style={pxFont}>
          &quot;{item.center}&quot;
        </p>
      )}

      {/* Vote tally — display only */}
      <div className="mt-auto pt-2 border-t border-[#FFE033]/40">
        <span className="text-[6px] text-gray-400" style={pxFont}>▲ {item.upvotes} votes</span>
      </div>

      <style>{`
        .shimmer {
          background: linear-gradient(
            105deg,
            transparent 35%,
            rgba(255,224,51,0.25) 50%,
            transparent 65%
          );
          background-size: 200% 100%;
          animation: cardShimmer 1.8s ease infinite;
        }
        @keyframes cardShimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </div>
  )
}
