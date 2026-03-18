'use client'
import { useEffect, useState } from 'react'

export default function Splash() {
  const [visible, setVisible] = useState(false)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem('seen-splash')) return
    sessionStorage.setItem('seen-splash', '1')
    setVisible(true)
    const fadeTimer = setTimeout(() => setFading(true), 1200)
    const hideTimer = setTimeout(() => setVisible(false), 1500)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-300 ${fading ? 'opacity-0' : 'opacity-100'}`}
    >
      <div
        className="font-pixel text-2xl text-black"
        style={{ animation: 'splashFadeIn 0.5s ease forwards' }}
      >
        shakeon 🤝
      </div>
      <style>{`
        @keyframes splashFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
