'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Nav from '@/components/Nav'
import Handshake from '@/components/Handshake'
import Marquee from '@/components/Marquee'
import { getRandomSeed } from '@/lib/seeds'
import { supabaseBrowser } from '@/lib/supabase'

function GeneratorContent() {
  const searchParams = useSearchParams()
  const [left, setLeft] = useState('')
  const [right, setRight] = useState('')
  const [center, setCenter] = useState('')
  const [rendered, setRendered] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    const l = searchParams.get('l') ?? ''
    const r = searchParams.get('r') ?? ''
    const c = searchParams.get('c') ?? ''
    if (l || r || c) {
      setLeft(l)
      setRight(r)
      setCenter(c)
      if (l && r) setRendered(true)
    }
  }, [searchParams])

  function handleGenerate() {
    if (!left.trim() || !right.trim()) return
    setRendered(true)
    setSubmitStatus('idle')
  }

  function handleRandom() {
    const seed = getRandomSeed()
    setLeft(seed.left)
    setRight(seed.right)
    setCenter(seed.center)
    setRendered(true)
    setSubmitStatus('idle')
  }

  async function handleDownload() {
    if (!rendered) return
    setDownloading(true)
    try {
      await document.fonts.ready
      const html2canvas = (await import('html2canvas')).default
      const el = document.getElementById('meme-canvas')
      if (!el) return
      const canvas = await html2canvas(el, { useCORS: true, scale: 2 })
      const link = document.createElement('a')
      link.download = 'shakeon-meme.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  async function handleSubmit() {
    if (!rendered || !left.trim() || !right.trim()) return
    setSubmitting(true)
    try {
      const { error } = await supabaseBrowser
        .from('handshakes')
        .insert({ left: left.trim(), right: right.trim(), center: center.trim() || null })
      setSubmitStatus(error ? 'error' : 'success')
    } catch {
      setSubmitStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/s?l=${encodeURIComponent(left)}&r=${encodeURIComponent(right)}&c=${encodeURIComponent(center)}`
    : `/s?l=${encodeURIComponent(left)}&r=${encodeURIComponent(right)}&c=${encodeURIComponent(center)}`

  const btnBase = 'px-5 py-3 text-[9px] leading-none rounded-lg border transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-none'

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Nav />

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-12 text-center">
        <h1
          className="text-2xl sm:text-3xl leading-[1.6] mb-3 text-black"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          THE MEME<br />THAT UNITES
        </h1>
        <p
          className="text-[8px] text-gray-400 leading-relaxed mb-10"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          two sides. one handshake. build the truth.
        </p>

        <Handshake left={left} right={right} center={center} />

        {/* Inputs */}
        <div className="mt-7 space-y-2.5">
          <div className="flex gap-2.5">
            <input
              value={left}
              onChange={e => setLeft(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGenerate()}
              placeholder="left hand..."
              className="flex-1 border border-gray-200 rounded-lg px-3.5 py-3 text-[9px] leading-none
                         outline-none transition-all focus:border-black focus:shadow-[3px_3px_0_#111]
                         placeholder:text-gray-300 bg-white text-black"
              style={{ fontFamily: 'var(--font-pixel)' }}
            />
            <input
              value={right}
              onChange={e => setRight(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGenerate()}
              placeholder="right hand..."
              className="flex-1 border border-gray-200 rounded-lg px-3.5 py-3 text-[9px] leading-none
                         outline-none transition-all focus:border-black focus:shadow-[3px_3px_0_#111]
                         placeholder:text-gray-300 bg-white text-black"
              style={{ fontFamily: 'var(--font-pixel)' }}
            />
          </div>
          <input
            value={center}
            onChange={e => setCenter(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            placeholder="what they secretly agree on... (optional)"
            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3.5 py-3 text-[8px] leading-none
                       outline-none text-center transition-all focus:border-black focus:shadow-[3px_3px_0_#111]
                       focus:bg-white placeholder:text-gray-300 text-black"
            style={{ fontFamily: 'var(--font-pixel)' }}
          />
        </div>

        {/* Buttons */}
        <div className="mt-4 flex flex-wrap gap-2.5 justify-center">
          <button
            onClick={handleGenerate}
            className={`${btnBase} bg-[#FFD600] border-black shadow-[3px_3px_0_#111]`}
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            generate
          </button>
          <button
            onClick={handleRandom}
            className={`${btnBase} bg-white border-gray-200 hover:border-black`}
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            random
          </button>
          <button
            onClick={handleDownload}
            disabled={!rendered || downloading}
            className={`${btnBase} bg-white border-gray-200 hover:border-black`}
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            {downloading ? 'saving...' : 'download'}
          </button>
        </div>

        {/* Submit banner */}
        {rendered && (
          <div
            className="mt-5 flex items-center justify-between gap-4 bg-gray-50 border border-gray-100
                        rounded-xl px-4 py-3.5 transition-all hover:border-black hover:shadow-[3px_3px_0_#111]"
          >
            <span
              className="text-[8px] text-gray-500 leading-relaxed text-left"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              {submitStatus === 'success' ? '✓ added to the wall!' :
               submitStatus === 'error'   ? '✗ something went wrong' :
               'like this one? add it to the wall'}
            </span>
            <div className="flex gap-2 shrink-0">
              {submitStatus !== 'success' && (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-black text-white border border-black rounded-md px-3 py-2 text-[8px] leading-none
                             transition-opacity hover:opacity-80 disabled:opacity-50"
                  style={{ fontFamily: 'var(--font-pixel)' }}
                >
                  {submitting ? '...' : 'submit →'}
                </button>
              )}
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black border border-gray-200 rounded-md px-3 py-2 text-[8px] leading-none
                           transition-all hover:border-black"
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                share ↗
              </a>
            </div>
          </div>
        )}
      </div>

      <Marquee />
    </main>
  )
}

export default function GeneratorPage() {
  return (
    <Suspense>
      <GeneratorContent />
    </Suspense>
  )
}
