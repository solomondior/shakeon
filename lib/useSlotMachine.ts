'use client'
import { useRef, useCallback } from 'react'

const WORDS = [
  'cats','dogs','devs','PMs','tabs','spaces','marvel','dc','react','vue',
  'coffee','tea','mondays','friday','bugs','features','dark mode','light mode',
  'git push','git blame','scrum','chaos','ios','android','elon','zuck',
  'introverts','extroverts','backend','frontend','gen z','millennials',
  'morning people','night owls','mac','windows','vim','vscode',
]

const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789!?*#@'

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)]
}

function scramble(len: number) {
  let s = ''
  const l = len || 5
  for (let i = 0; i < l; i++) s += CHARS[Math.floor(Math.random() * CHARS.length)]
  return s
}

let _audioCtx: AudioContext | null = null
function getAudioCtx() {
  if (!_audioCtx) _audioCtx = new AudioContext()
  return _audioCtx
}

function tick() {
  try {
    const ctx = getAudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 200 + Math.random() * 400
    gain.gain.setValueAtTime(0.04, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)
    osc.start()
    osc.stop(ctx.currentTime + 0.04)
  } catch { /* audio blocked */ }
}

interface SlotOptions {
  onUpdate: (field: 'left' | 'right' | 'center', value: string, spinning: boolean) => void
  onFlash:  (field: 'left' | 'right' | 'center') => void
}

export function useSlotMachine({ onUpdate, onFlash }: SlotOptions) {
  const rafRef    = useRef<number | null>(null)
  const cancelRef = useRef(false)

  const cancel = useCallback(() => {
    cancelRef.current = true
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
  }, [])

  const spin = useCallback((target: { left: string; right: string; center: string }) => {
    cancel()
    cancelRef.current = false

    const startTime = performance.now()
    const LEFT_SETTLE   = 600
    const RIGHT_SETTLE  = 900
    const CENTER_SETTLE = target.center ? 1150 : 900

    let lastTick   = 0
    let leftDone   = false
    let rightDone  = false
    let centerDone = !target.center  // skip if no center

    function frame(now: number) {
      if (cancelRef.current) return
      const elapsed = now - startTime

      // Settle fields exactly once
      if (!leftDone && elapsed >= LEFT_SETTLE) {
        leftDone = true
        onUpdate('left', target.left, false)
        onFlash('left')
      }
      if (!rightDone && elapsed >= RIGHT_SETTLE) {
        rightDone = true
        onUpdate('right', target.right, false)
        onFlash('right')
      }
      if (!centerDone && elapsed >= CENTER_SETTLE) {
        centerDone = true
        onUpdate('center', target.center, false)
        onFlash('center')
      }

      // Spin cycling text
      if (now - lastTick > 55) {
        lastTick = now
        if (!leftDone)   onUpdate('left',   scramble(target.left.length || 5),   true)
        if (!rightDone)  onUpdate('right',  scramble(target.right.length || 5),  true)
        if (!centerDone) onUpdate('center', scramble(target.center.length || 8), true)
        tick()
      }

      if (!leftDone || !rightDone || !centerDone) {
        rafRef.current = requestAnimationFrame(frame)
      }
    }

    rafRef.current = requestAnimationFrame(frame)
  }, [cancel, onUpdate, onFlash])

  return { spin, cancel }
}
