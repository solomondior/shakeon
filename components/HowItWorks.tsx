'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

const pxFont = { fontFamily: 'var(--font-pixel)' }

function sleep(ms: number) {
  return new Promise<void>(res => setTimeout(res, ms))
}

async function typeText(
  text: string,
  setter: (s: string) => void,
  cancelled: () => boolean,
  charDelay = 85,
) {
  for (let i = 1; i <= text.length; i++) {
    if (cancelled()) return
    setter(text.slice(0, i))
    await sleep(charDelay)
  }
}

export default function HowItWorks() {
  const [active, setActive]         = useState(0)   // which step card is lit (1-3)
  const [leftText, setLeftText]     = useState('')
  const [rightText, setRightText]   = useState('')
  const [emojiIn, setEmojiIn]       = useState(false)
  const [btnsIn, setBtnsIn]         = useState(false)
  const [copied, setCopied]         = useState(false)
  const [cursorClick, setCursorClick] = useState(false)
  const [allDone, setAllDone]       = useState(false)
  const [cardsIn, setCardsIn]       = useState(false)

  const cancelRef = useRef(false)
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)

  const reset = useCallback(() => {
    setActive(0); setLeftText(''); setRightText('')
    setEmojiIn(false); setBtnsIn(false); setCopied(false)
    setCursorClick(false); setAllDone(false); setCardsIn(false)
  }, [])

  const run = useCallback(async () => {
    cancelRef.current = false
    const c = () => cancelRef.current

    reset()
    await sleep(300)
    if (c()) return
    setCardsIn(true)
    await sleep(1000)

    // Step 1
    if (c()) return
    setActive(1)
    await sleep(500)
    await typeText('cats', setLeftText, c)
    await sleep(150)
    await typeText('dogs', setRightText, c)
    await sleep(500)

    // Step 2
    if (c()) return
    setActive(2)
    await sleep(400)
    setEmojiIn(true)
    await sleep(1400)

    // Step 3
    if (c()) return
    setActive(3)
    await sleep(400)
    setBtnsIn(true)
    await sleep(700)
    setCursorClick(true)
    await sleep(280)
    setCursorClick(false)
    setCopied(true)
    await sleep(900)

    // All done
    if (c()) return
    setAllDone(true)
    await sleep(2000)

    // Loop
    if (!c()) {
      timerRef.current = setTimeout(() => run(), 300)
    }
  }, [reset])

  useEffect(() => {
    timerRef.current = setTimeout(() => run(), 600)
    return () => {
      cancelRef.current = true
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [run])

  const stepStyle = (n: number) => ({
    ...pxFont,
    border: `2px solid ${active === n || allDone ? '#FFD600' : '#e5e7eb'}`,
    boxShadow: active === n || allDone ? '3px 3px 0 #111' : 'none',
    transform: cardsIn
      ? `translateY(0) ${active === n ? 'scale(1.02)' : 'scale(1)'}`
      : 'translateY(18px)',
    opacity: cardsIn ? 1 : 0,
    transition: `transform 0.45s cubic-bezier(.34,1.56,.64,1) ${(n - 1) * 0.12}s,
                 opacity 0.4s ease ${(n - 1) * 0.12}s,
                 border-color 0.3s, box-shadow 0.3s`,
    background: '#fff',
    borderRadius: 12,
    padding: '20px 18px',
    flex: '1 1 0',
    minWidth: 180,
    position: 'relative' as const,
    overflow: 'hidden' as const,
  })

  return (
    <section className="max-w-2xl mx-auto w-full px-4 py-12">
      <h2
        className="text-[10px] text-center mb-8 text-black"
        style={pxFont}
      >
        HOW IT WORKS
      </h2>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const, alignItems: 'flex-start' }}>

        {/* ── Step 1 ── */}
        <div style={stepStyle(1)}>
          <StepNum n="01" lit={active >= 1 || allDone} />
          <p style={{ ...pxFont, fontSize: 8, color: '#111', marginBottom: 12, marginTop: 4 }}>
            type two sides
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            <FakeInput value={leftText} placeholder="left..." active={active === 1} />
            <FakeInput value={rightText} placeholder="right..." active={active === 1 && leftText.length >= 4} />
          </div>
        </div>

        {/* ── Step 2 ── */}
        <div style={stepStyle(2)}>
          <StepNum n="02" lit={active >= 2 || allDone} />
          <p style={{ ...pxFont, fontSize: 8, color: '#111', marginBottom: 12, marginTop: 4 }}>
            the handshake happens
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 6, fontSize: 9, color: '#111',
            ...pxFont,
          }}>
            <span>cats</span>
            <span style={{
              fontSize: 28,
              display: 'inline-block',
              transform: emojiIn ? 'scale(1)' : 'scale(0)',
              transition: 'transform 0.4s cubic-bezier(.34,1.56,.64,1)',
            }}>
              🤝
            </span>
            <span>dogs</span>
          </div>
          {emojiIn && (
            <div style={{
              marginTop: 10,
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: '6px 10px',
              fontSize: 7,
              color: '#555',
              textAlign: 'center' as const,
              animation: 'fadeUp 0.35s ease forwards',
              ...pxFont,
            }}>
              &quot;being tired&quot;
            </div>
          )}
        </div>

        {/* ── Step 3 ── */}
        <div style={stepStyle(3)}>
          <StepNum n="03" lit={active >= 3 || allDone} />
          <p style={{ ...pxFont, fontSize: 8, color: '#111', marginBottom: 12, marginTop: 4 }}>
            share it
          </p>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
            <ShareBtn
              label={copied ? '✓ copied!' : 'copy link'}
              visible={btnsIn}
              delay={0}
              active={copied}
              clicking={cursorClick}
            />
            <ShareBtn
              label="tweet ↗"
              visible={btnsIn}
              delay={0.1}
              active={false}
              clicking={false}
            />
          </div>
          {/* Cursor */}
          {btnsIn && (
            <span style={{
              position: 'absolute',
              bottom: cursorClick ? 38 : 42,
              left: cursorClick ? 54 : 58,
              fontSize: 14,
              pointerEvents: 'none',
              transform: cursorClick ? 'scale(0.85)' : 'scale(1)',
              transition: 'all 0.18s ease',
              animation: 'fadeUp 0.3s ease forwards',
            }}>
              🖱️
            </span>
          )}
        </div>

      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}

function StepNum({ n, lit }: { n: string; lit: boolean }) {
  return (
    <div style={{
      display: 'inline-block',
      background: lit ? '#FFD600' : '#f3f4f6',
      border: `1.5px solid ${lit ? '#111' : '#e5e7eb'}`,
      borderRadius: 6,
      padding: '3px 7px',
      fontSize: 7,
      fontFamily: 'var(--font-pixel)',
      marginBottom: 6,
      transition: 'background 0.3s, border-color 0.3s',
    }}>
      {n}
    </div>
  )
}

function FakeInput({ value, placeholder, active }: { value: string; placeholder: string; active: boolean }) {
  return (
    <div style={{
      flex: 1,
      border: `1.5px solid ${active && value ? '#111' : '#e5e7eb'}`,
      borderRadius: 6,
      padding: '5px 7px',
      fontSize: 7,
      fontFamily: 'var(--font-pixel)',
      color: value ? '#111' : '#ccc',
      minHeight: 24,
      background: '#fff',
      transition: 'border-color 0.2s',
      position: 'relative' as const,
    }}>
      {value || placeholder}
      {active && value.length > 0 && (
        <span style={{
          display: 'inline-block',
          width: 1.5,
          height: '0.9em',
          background: '#111',
          marginLeft: 1,
          animation: 'blink 0.7s step-end infinite',
          verticalAlign: 'middle',
        }} />
      )}
      <style>{`@keyframes blink { 50% { opacity: 0 } }`}</style>
    </div>
  )
}

function ShareBtn({ label, visible, delay, active, clicking }: {
  label: string; visible: boolean; delay: number; active: boolean; clicking: boolean
}) {
  return (
    <div style={{
      border: `1.5px solid ${active ? '#111' : '#e5e7eb'}`,
      borderRadius: 6,
      padding: '5px 10px',
      fontSize: 7,
      fontFamily: 'var(--font-pixel)',
      background: active ? '#FFD600' : '#fff',
      color: '#111',
      textAlign: 'center' as const,
      transform: visible
        ? clicking ? 'scale(0.93)' : 'translateX(0)'
        : 'translateX(18px)',
      opacity: visible ? 1 : 0,
      transition: `transform 0.35s cubic-bezier(.34,1.56,.64,1) ${delay}s,
                   opacity 0.3s ease ${delay}s,
                   background 0.25s, border-color 0.25s`,
      boxShadow: active ? '2px 2px 0 #111' : 'none',
    }}>
      {label}
    </div>
  )
}
