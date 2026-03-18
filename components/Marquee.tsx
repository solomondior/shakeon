import { SEEDS } from '@/lib/seeds'

export default function Marquee() {
  const items = [...SEEDS, ...SEEDS]

  return (
    <div className="border-t border-gray-100 bg-gray-50 overflow-hidden py-3">
      <div
        className="inline-flex whitespace-nowrap"
        style={{ animation: 'marquee 40s linear infinite' }}
      >
        {items.map((seed, i) => (
          <span key={i} className="inline-block px-8 text-[8px] text-gray-500" style={{ fontFamily: 'var(--font-pixel)' }}>
            {seed.left} 🤝 {seed.right}
            {seed.center && (
              <span className="text-gray-400"> — &quot;{seed.center}&quot;</span>
            )}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
