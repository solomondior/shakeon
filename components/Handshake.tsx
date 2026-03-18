'use client'

interface HandshakeProps {
  left: string
  right: string
  center?: string
  id?: string
}

export default function Handshake({ left, right, center, id = 'meme-canvas' }: HandshakeProps) {
  return (
    <div
      id={id}
      className="w-full max-w-[560px] mx-auto bg-white border border-gray-200 rounded-xl p-7
                 grid grid-cols-[1fr_auto_1fr] items-center gap-x-3 gap-y-5
                 transition-all duration-150 hover:border-black hover:shadow-[4px_4px_0_#111] cursor-default"
    >
      {/* Left label */}
      <div className="text-right text-[11px] leading-relaxed text-black break-words" style={{ fontFamily: 'var(--font-pixel)' }}>
        {left || <span className="text-gray-300">left hand</span>}
      </div>

      {/* Emoji */}
      <div className="text-[80px] leading-none select-none text-center">🤝</div>

      {/* Right label */}
      <div className="text-left text-[11px] leading-relaxed text-black break-words" style={{ fontFamily: 'var(--font-pixel)' }}>
        {right || <span className="text-gray-300">right hand</span>}
      </div>

      {/* Center label — full width, hidden when empty */}
      {center && (
        <div className="col-span-3 flex justify-center">
          <span
            className="bg-[#FFD600] border border-black rounded-full px-5 py-2 text-[9px] text-black leading-relaxed text-center"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            {center}
          </span>
        </div>
      )}
    </div>
  )
}
