'use client'
import { useState, useEffect, useRef, Suspense, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Nav from '@/components/Nav'
import Handshake from '@/components/Handshake'
import Marquee from '@/components/Marquee'
import Card from '@/components/Card'
import TemplatePacks from '@/components/TemplatePacks'
import TrendingStrip from '@/components/TrendingStrip'
import DailyHandshake from '@/components/DailyHandshake'
import { getRandomSeed } from '@/lib/seeds'
import { getBrowserClient, type Handshake as HandshakeType } from '@/lib/supabase'
import { DEFAULT_THEME, type Theme } from '@/lib/themes'
import { useSlotMachine } from '@/lib/useSlotMachine'
import HowItWorks from '@/components/HowItWorks'

const PAGE_SIZE = 12
type Tab = 'today' | 'week' | 'alltime' | 'new'

function getTimeFilter(tab: Tab): string | null {
  if (tab === 'today') return new Date(Date.now() - 86400000).toISOString()
  if (tab === 'week')  return new Date(Date.now() - 7 * 86400000).toISOString()
  return null
}

interface HomePageProps {
  initialItems: HandshakeType[]
  initialHasMore: boolean
  totalCount: number
  dailyItem: HandshakeType | null
}

function HomePageContent({ initialItems, initialHasMore, totalCount: initialTotal, dailyItem }: HomePageProps) {
  const searchParams = useSearchParams()

  // Generator state
  const [left, setLeft]       = useState('')
  const [right, setRight]     = useState('')
  const [center, setCenter]   = useState('')
  const [rendered, setRendered]       = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [submitting, setSubmitting]   = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [copied, setCopied]   = useState(false)
  const [totalCount, setTotalCount]   = useState(initialTotal)
  const [theme, setTheme]       = useState<Theme>(DEFAULT_THEME)
  const [search, setSearch]     = useState('')
  const [copiedText, setCopiedText] = useState(false)
  const [spinning, setSpinning] = useState<{ left: boolean; right: boolean; center: boolean }>({ left: false, right: false, center: false })
  const [flash, setFlash]     = useState<{ left: boolean; right: boolean; center: boolean }>({ left: false, right: false, center: false })
  const [leverPressed, setLeverPressed] = useState(false)

  const { spin: runSlot, cancel: cancelSlot } = useSlotMachine({
    onUpdate: useCallback((field, value, isSpinning) => {
      if (field === 'left')   setLeft(value)
      if (field === 'right')  setRight(value)
      if (field === 'center') setCenter(value)
      setSpinning(s => ({ ...s, [field]: isSpinning }))
    }, []),
    onFlash: useCallback((field) => {
      setFlash(f => ({ ...f, [field]: true }))
      setTimeout(() => setFlash(f => ({ ...f, [field]: false })), 400)
    }, []),
  })

  // Wall state
  const [tab, setTab]         = useState<Tab>('today')
  const [items, setItems]     = useState<HandshakeType[]>(initialItems)
  const [wallLoading, setWallLoading] = useState(false)
  const [offset, setOffset]   = useState(PAGE_SIZE)
  const [hasMore, setHasMore] = useState(initialHasMore)

  const generatorRef = useRef<HTMLDivElement>(null)
  const leftInputRef = useRef<HTMLInputElement>(null)

  // Auto-fill from query params
  useEffect(() => {
    const l = searchParams.get('l') ?? ''
    const r = searchParams.get('r') ?? ''
    const c = searchParams.get('c') ?? ''
    if (l || r || c) {
      setLeft(l); setRight(r); setCenter(c)
      if (l && r) setRendered(true)
    }
  }, [searchParams])

  // Listen for "make one like this" events from cards
  useEffect(() => {
    function onPrefill(e: CustomEvent<{ left: string; right: string; center: string }>) {
      const { left: l, right: r, center: c } = e.detail
      setLeft(l); setRight(r); setCenter(c)
      setRendered(true)
      setSubmitStatus('idle')
      generatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => leftInputRef.current?.focus(), 600)
    }
    window.addEventListener('shakeon:prefill', onPrefill as EventListener)
    return () => window.removeEventListener('shakeon:prefill', onPrefill as EventListener)
  }, [])

  // Wall fetch
  const fetchItems = useCallback(async (currentTab: Tab, currentOffset: number, reset = false) => {
    setWallLoading(true)
    const since = getTimeFilter(currentTab)
    const isNew = currentTab === 'new'
    let query = getBrowserClient()
      .from('handshakes')
      .select('*')
      .order(isNew ? 'created_at' : 'upvotes', { ascending: false })
      .range(currentOffset, currentOffset + PAGE_SIZE - 1)
    if (since) query = query.gte('created_at', since)
    const { data } = await query
    const rows = (data ?? []) as HandshakeType[]
    setItems(prev => reset ? rows : [...prev, ...rows])
    setHasMore(rows.length === PAGE_SIZE)
    setWallLoading(false)
  }, [])

  function switchTab(newTab: Tab) {
    setTab(newTab)
    setOffset(PAGE_SIZE)
    fetchItems(newTab, 0, true)
  }

  function loadMore() {
    fetchItems(tab, offset)
    setOffset(o => o + PAGE_SIZE)
  }

  // Generator handlers
  function handleGenerate() {
    if (!left.trim() || !right.trim()) return
    setRendered(true)
    setSubmitStatus('idle')
  }

  function handleRandom() {
    const seed = getRandomSeed()
    setRendered(true)
    setSubmitStatus('idle')
    // Lever animation
    setLeverPressed(true)
    setTimeout(() => setLeverPressed(false), 200)
    // Start slot machine — cancels any existing spin automatically
    cancelSlot()
    runSlot(seed)
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

  async function handleCopy() {
    const url = `${window.location.origin}/s?l=${encodeURIComponent(left)}&r=${encodeURIComponent(right)}&c=${encodeURIComponent(center)}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleCopyAsText() {
    const text = center
      ? `${left} 🤝 ${right} — "${center}"`
      : `${left} 🤝 ${right}`
    await navigator.clipboard.writeText(text)
    setCopiedText(true)
    setTimeout(() => setCopiedText(false), 2000)
  }

  function handleTwitterShare() {
    const text = center
      ? `${left} 🤝 ${right} — "${center}"`
      : `${left} 🤝 ${right}`
    const url = `${window.location.origin}/s?l=${encodeURIComponent(left)}&r=${encodeURIComponent(right)}&c=${encodeURIComponent(center)}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
  }

  async function handleSubmit() {
    if (!rendered || !left.trim() || !right.trim()) return
    setSubmitting(true)
    try {
      const { data, error } = await getBrowserClient()
        .from('handshakes')
        .insert({ left: left.trim(), right: right.trim(), center: center.trim() || null })
        .select()
        .single()

      if (error) { setSubmitStatus('error'); return }

      setSubmitStatus('success')
      setTotalCount(c => c + 1)

      // Confetti 🎉
      const confetti = (await import('canvas-confetti')).default
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#FFD600', '#111', '#fff'] })

      // Prepend new card to wall if on today/new tab
      if (data && (tab === 'today' || tab === 'new')) {
        setItems(prev => [data as HandshakeType, ...prev])
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  const px = (s: string) => encodeURIComponent(s)
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/s?l=${px(left)}&r=${px(right)}&c=${px(center)}`
    : `/s?l=${px(left)}&r=${px(right)}&c=${px(center)}`

  const pxFont = { fontFamily: 'var(--font-pixel)' }
  const btnBase = 'px-4 py-3 text-[9px] leading-none rounded-lg border transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-none'

  const wallTabs: { key: Tab; label: string }[] = [
    { key: 'today',   label: 'today' },
    { key: 'week',    label: 'this week' },
    { key: 'alltime', label: 'all time' },
    { key: 'new',     label: 'new' },
  ]

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Nav />

      {/* ─── GENERATOR ─── */}
      <div id="generator" ref={generatorRef} className="max-w-2xl mx-auto w-full px-4 py-12 text-center">
        <h1 className="text-2xl sm:text-3xl leading-[1.6] mb-2 text-black" style={pxFont}>
          THE MEME<br />THAT UNITES
        </h1>
        {totalCount > 0 && (
          <p className="text-[7px] text-gray-400 mb-2 leading-relaxed" style={pxFont}>
            {totalCount.toLocaleString()} handshakes made
          </p>
        )}
        <p className="text-[8px] text-gray-400 leading-relaxed mb-10" style={pxFont}>
          two sides. one handshake. build the truth.
        </p>

        <Handshake left={left} right={right} center={center} theme={theme} />

        {/* Inputs */}
        <div className="mt-7 space-y-2.5">
          <div className="flex gap-2.5">
            <input
              ref={leftInputRef}
              value={left}
              onChange={e => { cancelSlot(); setLeft(e.target.value) }}
              onKeyDown={e => e.key === 'Enter' && handleGenerate()}
              placeholder="left hand..."
              readOnly={spinning.left}
              className="flex-1 border border-gray-200 rounded-lg px-3.5 py-3 text-[9px] leading-none outline-none transition-all focus:border-black focus:shadow-[3px_3px_0_#111] placeholder:text-gray-300 bg-white text-black"
              style={{
                ...pxFont,
                filter: spinning.left ? 'blur(1.5px)' : 'none',
                backgroundColor: flash.left ? '#FFE033' : '',
                transition: 'filter 0.05s, background-color 0.4s',
              }}
            />
            <input
              value={right}
              onChange={e => { cancelSlot(); setRight(e.target.value) }}
              onKeyDown={e => e.key === 'Enter' && handleGenerate()}
              placeholder="right hand..."
              readOnly={spinning.right}
              className="flex-1 border border-gray-200 rounded-lg px-3.5 py-3 text-[9px] leading-none outline-none transition-all focus:border-black focus:shadow-[3px_3px_0_#111] placeholder:text-gray-300 bg-white text-black"
              style={{
                ...pxFont,
                filter: spinning.right ? 'blur(1.5px)' : 'none',
                backgroundColor: flash.right ? '#FFE033' : '',
                transition: 'filter 0.05s, background-color 0.4s',
              }}
            />
          </div>
          <input
            value={center}
            onChange={e => { cancelSlot(); setCenter(e.target.value) }}
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            placeholder="what they secretly agree on... (optional)"
            readOnly={spinning.center}
            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3.5 py-3 text-[8px] leading-none outline-none text-center transition-all focus:border-black focus:shadow-[3px_3px_0_#111] focus:bg-white placeholder:text-gray-300 text-black"
            style={{
              ...pxFont,
              filter: spinning.center ? 'blur(1.5px)' : 'none',
              backgroundColor: flash.center ? '#FFE033' : '',
              transition: 'filter 0.05s, background-color 0.4s',
            }}
          />
        </div>

        {/* Buttons */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <button onClick={handleGenerate} className={`${btnBase} bg-[#FFD600] border-black shadow-[3px_3px_0_#111]`} style={pxFont}>generate</button>
          <button
            onClick={handleRandom}
            className={`${btnBase} bg-white border-gray-200 hover:border-black`}
            style={{
              ...pxFont,
              transform: leverPressed ? 'translateY(3px) translateX(1px)' : '',
              boxShadow: leverPressed ? 'none' : '',
              transition: 'transform 0.1s, box-shadow 0.1s',
            }}
          >
            🎰 random
          </button>
          <button onClick={handleDownload} disabled={!rendered || downloading} className={`${btnBase} bg-white border-gray-200 hover:border-black`} style={pxFont}>{downloading ? 'saving...' : 'download'}</button>
        </div>

        <TemplatePacks onSelect={seed => {
          setLeft(seed.left); setRight(seed.right); setCenter(seed.center)
          setRendered(true); setSubmitStatus('idle')
        }} />

        {/* Share + submit row */}
        {rendered && (
          <div className="mt-5 border border-gray-100 rounded-xl overflow-hidden transition-all hover:border-black hover:shadow-[3px_3px_0_#111]">
            {/* Share buttons */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100 flex-wrap">
              <span className="text-[7px] text-gray-400 mr-auto" style={pxFont}>share it</span>
              <button
                onClick={handleCopy}
                className="border border-gray-200 rounded-md px-3 py-2 text-[7px] leading-none bg-white transition-all hover:border-black hover:shadow-[2px_2px_0_#111]"
                style={pxFont}
              >
                {copied ? '✓ copied!' : 'copy link'}
              </button>
              <button
                onClick={handleCopyAsText}
                className="border border-gray-200 rounded-md px-3 py-2 text-[7px] leading-none bg-white transition-all hover:border-black hover:shadow-[2px_2px_0_#111]"
                style={pxFont}
              >
                {copiedText ? '✓ copied!' : 'copy as text'}
              </button>
              <button
                onClick={handleTwitterShare}
                className="border border-gray-200 rounded-md px-3 py-2 text-[7px] leading-none bg-white transition-all hover:border-black hover:shadow-[2px_2px_0_#111]"
                style={pxFont}
              >
                tweet ↗
              </button>
            </div>
            {/* Submit */}
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="text-[7px] text-gray-500 leading-relaxed" style={pxFont}>
                {submitStatus === 'success' ? '🎉 added to the wall!' :
                 submitStatus === 'error'   ? '✗ something went wrong' :
                 'add to the wall?'}
              </span>
              {submitStatus !== 'success' && (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-black text-white border border-black rounded-md px-3 py-2 text-[7px] leading-none transition-opacity hover:opacity-80 disabled:opacity-50 shrink-0"
                  style={pxFont}
                >
                  {submitting ? '...' : 'submit →'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ─── MARQUEE DIVIDER ─── */}
      <Marquee />

      {/* ─── HOW IT WORKS ─── */}
      <HowItWorks />

      {/* ─── WALL ─── */}
      <div id="wall" className="max-w-5xl mx-auto w-full px-4 py-12">
        <h2 className="text-xl sm:text-2xl leading-[1.5] mb-8 text-black" style={pxFont}>
          the wall 🏆
        </h2>

        <TrendingStrip />
        <DailyHandshake item={dailyItem} />

        {/* Search + Tabs row */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="inline-flex border border-black rounded overflow-hidden">
            {wallTabs.map((t, i) => (
              <button
                key={t.key}
                onClick={() => switchTab(t.key)}
                className={`px-4 py-2 text-[8px] leading-none transition-colors ${i < wallTabs.length - 1 ? 'border-r border-black' : ''} ${tab === t.key ? 'bg-black text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                style={pxFont}
              >
                {t.label}
              </button>
            ))}
          </div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="search handshakes..."
            className="border border-gray-200 rounded-lg px-3.5 py-2 text-[8px] leading-none outline-none transition-all focus:border-black focus:shadow-[3px_3px_0_#111] placeholder:text-gray-300 bg-white text-black"
            style={pxFont}
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-[7px] text-gray-400 hover:text-black transition-colors" style={pxFont}>
              clear ✕
            </button>
          )}
        </div>

        {/* Grid */}
        {(() => {
          const filtered = search.trim()
            ? items.filter(item =>
                [item.left, item.right, item.center ?? ''].some(s =>
                  s.toLowerCase().includes(search.toLowerCase())
                )
              )
            : items
          return wallLoading && items.length === 0 ? (
            <p className="text-[8px] text-gray-400" style={pxFont}>loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-[8px] text-gray-400" style={pxFont}>
              {search ? `no results for "${search}"` : 'no handshakes yet — be the first!'}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filtered.map(item => <Card key={item.id} item={item} />)}
              </div>
              {hasMore && !search && (
                <div className="mt-8 text-center">
                  <button
                    onClick={loadMore}
                    disabled={wallLoading}
                    className="bg-white border border-gray-200 rounded-lg px-6 py-3 text-[8px] transition-all hover:border-black hover:shadow-[3px_3px_0_#111] hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50"
                    style={pxFont}
                  >
                    {wallLoading ? 'loading...' : 'load more'}
                  </button>
                </div>
              )}
            </>
          )
        })()}
      </div>
    </main>
  )
}

export default function HomePage(props: HomePageProps & { dailyItem: HandshakeType | null }) {
  return (
    <Suspense>
      <HomePageContent {...props} />
    </Suspense>
  )
}
