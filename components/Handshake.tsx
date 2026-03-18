'use client'
import type { Theme } from '@/lib/themes'
import { DEFAULT_THEME } from '@/lib/themes'

interface HandshakeProps {
  left: string
  right: string
  center?: string
  id?: string
  theme?: Theme
}

export default function Handshake({ left, right, center, id = 'meme-canvas', theme = DEFAULT_THEME }: HandshakeProps) {
  const pxFont = { fontFamily: 'var(--font-pixel)' }

  return (
    <div
      id={id}
      className="w-full max-w-[560px] mx-auto bg-white border rounded-xl p-7
                 grid grid-cols-[1fr_auto_1fr] items-center gap-x-3 gap-y-5
                 transition-all duration-150 hover:shadow-[4px_4px_0_#111] cursor-default"
      style={{ borderColor: theme.canvasBorder }}
    >
      <div className="text-right text-[11px] leading-relaxed text-black break-words" style={pxFont}>
        {left || <span className="text-gray-300">left hand</span>}
      </div>

      <div className="text-[80px] leading-none select-none text-center">{theme.emoji}</div>

      <div className="text-left text-[11px] leading-relaxed text-black break-words" style={pxFont}>
        {right || <span className="text-gray-300">right hand</span>}
      </div>

      {center && (
        <div className="col-span-3 flex justify-center">
          <span
            className="border rounded-full px-5 py-2 text-[9px] leading-relaxed text-center"
            style={{
              fontFamily: 'var(--font-pixel)',
              background: theme.pillBg,
              borderColor: theme.pillBorder,
              color: theme.pillText,
            }}
          >
            {center}
          </span>
        </div>
      )}
    </div>
  )
}
