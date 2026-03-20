'use client'
import { useEffect, useState } from 'react'

export default function Splash() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem('seen-splash')) return
    sessionStorage.setItem('seen-splash', '1')
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 1040)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white"
      style={{ animation: 'splashExit 0.3s ease-in 0.7s forwards' }}
    >
      <div style={{ textAlign: 'center', animation: 'splashEnter 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards' }}>

        <div style={{ fontSize: 48, lineHeight: 1, marginBottom: 10 }}>🤝</div>

        <div style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 13,
          letterSpacing: 2,
          color: '#111',
          marginBottom: 8,
        }}>
          HANDSHAKE
        </div>

        {/* Yellow bar slides in */}
        <div style={{ overflow: 'hidden', height: 3 }}>
          <div style={{
            height: 3,
            background: '#FFD600',
            animation: 'barSlide 0.3s ease-out 0.5s both',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes splashEnter {
          from { opacity: 0; transform: scale(0.72); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes barSlide {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        @keyframes splashExit {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(1.04); pointer-events: none; }
        }
      `}</style>
    </div>
  )
}
