'use client'
import { useState } from 'react'
import { PACKS, type PackSeed } from '@/lib/packs'

interface TemplatePacksProps {
  onSelect: (seed: PackSeed) => void
}

export default function TemplatePacks({ onSelect }: TemplatePacksProps) {
  const [open, setOpen] = useState(false)
  const [activePack, setActivePack] = useState(PACKS[0].id)

  const pack = PACKS.find(p => p.id === activePack) ?? PACKS[0]
  const pxFont = { fontFamily: 'var(--font-pixel)' }

  return (
    <div className="mt-4 border border-gray-100 rounded-xl overflow-hidden transition-all hover:border-gray-200">
      {/* Toggle header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
        style={pxFont}
      >
        <span className="text-[8px] text-gray-500">browse template packs</span>
        <span className="text-[8px] text-gray-400">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="p-4 border-t border-gray-100">
          {/* Pack tabs */}
          <div className="flex gap-0 mb-4 border border-black rounded overflow-hidden inline-flex">
            {PACKS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActivePack(p.id)}
                className={`px-3 py-2 text-[7px] leading-none transition-colors whitespace-nowrap
                  ${i < PACKS.length - 1 ? 'border-r border-black' : ''}
                  ${activePack === p.id ? 'bg-black text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                style={pxFont}
              >
                {p.emoji} {p.name}
              </button>
            ))}
          </div>

          {/* Seeds grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
            {pack.seeds.map((seed, i) => (
              <button
                key={i}
                onClick={() => { onSelect(seed); setOpen(false) }}
                className="text-left border border-gray-100 rounded-lg px-3 py-2.5 hover:border-black hover:shadow-[2px_2px_0_#111] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all bg-white"
              >
                <p className="text-[7px] leading-relaxed text-black mb-1" style={pxFont}>
                  {seed.left} 🤝 {seed.right}
                </p>
                {seed.center && (
                  <p className="text-[6px] text-gray-400 italic" style={pxFont}>
                    &quot;{seed.center}&quot;
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
