'use client'

// "How it works" explainer on the home page: a 30-second SILENT walkthrough (on-screen text only).
//   • Phones (≤768px): plays inline under the headline (the category tiles were already below the
//     first screen there), muted, only while visible.
//   • Laptops/desktops: a "Watch how it works" button opens it in a pop-up, so the category tiles
//     stay exactly where they are.
// Speed: the phone poster is an 11 KB WebP; no video bytes are fetched until the page has finished
// loading and the player is visible / opened. Reduced-motion and data-saver users never get autoplay (poster + play button instead).
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { track } from '../utils/analytics'
import '../styles/HowItWorksVideo.scss'

const POSTER = '/media/howitworks_poster.jpg' // 1600×900 — pop-up only (downloaded on click)
const POSTER_SMALL = '/media/howitworks_poster_800.webp' // 11 KB — phones, inline
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
const SRC_720 = '/media/howitworks_720p.mp4'
const SRC_1080 = '/media/howitworks_1080p.mp4'
const SUMMARY = 'Silent 30-second walkthrough: pick a category, choose Fake or Fact, see the answer, challenge a friend'

type NetInfo = { saveData?: boolean; effectiveType?: string }
const netInfo = (): NetInfo | undefined => (navigator as unknown as { connection?: NetInfo }).connection
const slowNetwork = () => { const n = netInfo(); return !!n && (!!n.saveData || /(^|-)[23]g$/.test(n.effectiveType ?? '')) }
/** 720p normally; 1080p only when the player is big on a sharp screen and the network is fast. */
const pickSource = (width: number) => (width * (window.devicePixelRatio || 1) > 1300 && !slowNetwork() ? SRC_1080 : SRC_720)

const STEPS = [
  { t: 'Pick a category', d: 'Pick whatever matches your mood.' },
  { t: 'Fake or fact?', d: 'Read it, trust your gut, choose Fake or Fact.' },
  { t: 'Right or wrong?', d: 'See the truth and the story behind it, instantly.' },
  { t: 'Challenge a friend', d: 'Party Mode: same facts, same time limit.' },
]

function Steps() {
  return (
    <details className="hiw-video__steps">
      <summary>Prefer to read? The 4 steps</summary>
      <ol>{STEPS.map(s => (<li key={s.t}><strong>{s.t}.</strong> {s.d}</li>))}</ol>
    </details>
  )
}

// ── Pop-up player (laptops) ─────────────────────────────────────────────────────
function VideoModal({ onClose }: { onClose: () => void }) {
  const closeBtn = useRef<HTMLButtonElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeBtn.current?.focus()
    const v = video.current
    if (v) {
      v.src = pickSource(frame.current?.clientWidth ?? 800)
      v.play().then(() => track('video_play', { video: 'how_it_works', placement: 'home_modal', method: 'click' })).catch(() => { /* controls let them press play */ })
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab') return
      const f = [closeBtn.current, video.current].filter(Boolean) as HTMLElement[]
      const i = f.indexOf(document.activeElement as HTMLElement)
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus() }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow; v?.pause(); prevFocus?.focus?.() }
  }, [onClose])

  return createPortal(
    <div className="hiw-modal" onClick={onClose}>
      <div className="hiw-modal__dialog" role="dialog" aria-modal="true" aria-label="How SmartAss Facts works" onClick={e => e.stopPropagation()}>
        <button ref={closeBtn} type="button" className="hiw-modal__close" onClick={onClose} aria-label="Close video"><span aria-hidden="true">✕</span></button>
        <div ref={frame} className="hiw-modal__frame">
          <video ref={video} controls muted playsInline preload="none" poster={POSTER} aria-label={SUMMARY} />
        </div>
        <Steps />
      </div>
    </div>,
    document.body,
  )
}

export default function HowItWorksVideo() {
  const box = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const cta = useRef<HTMLButtonElement>(null)
  const [inline, setInline] = useState(false) // phones: play in the page
  const [open, setOpen] = useState(false) // laptops: pop-up
  const [playing, setPlaying] = useState(false)
  const [live, setLive] = useState(false) // first frame showing → fade the poster out
  const userPaused = useRef(false)
  const tracked = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const sync = () => setInline(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const start = useCallback(async (byUser: boolean) => {
    const v = video.current
    if (!v) return
    if (!v.getAttribute('src')) v.src = pickSource(box.current?.clientWidth ?? 390)
    try {
      await v.play()
      if (byUser) userPaused.current = false
      if (!tracked.current) {
        tracked.current = true
        track('video_play', { video: 'how_it_works', placement: 'home_hero', method: byUser ? 'click' : 'auto' })
      }
    } catch { /* autoplay refused → poster + play button stay */ }
  }, [])

  // Phone autoplay (muted) while visible — armed only after the page has finished loading
  useEffect(() => {
    if (!inline || !box.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || netInfo()?.saveData) return
    let io: IntersectionObserver | undefined
    let timer: ReturnType<typeof setTimeout> | undefined
    const arm = () => {
      timer = setTimeout(() => {
        io = new IntersectionObserver(([e]) => {
          const v = video.current
          if (!v) return
          if (e.isIntersecting) { if (!userPaused.current) start(false) }
          else if (!v.paused) v.pause()
        }, { threshold: 0.4 })
        io.observe(box.current!)
      }, 1200)
    }
    if (document.readyState === 'complete') arm()
    else window.addEventListener('load', arm, { once: true })
    return () => { window.removeEventListener('load', arm); clearTimeout(timer); io?.disconnect() }
  }, [inline, start])

  const toggle = () => {
    const v = video.current
    if (!v) return
    if (v.paused) start(true)
    else { userPaused.current = true; v.pause() }
  }

  return (
    <>
      {/* Laptops: compact button → pop-up (CSS hides it on phones) */}
      <button ref={cta} type="button" className="hiw-cta" onClick={() => setOpen(true)} aria-haspopup="dialog">
        <span className="hiw-cta__icon" aria-hidden="true">▶</span> Watch how it works <span className="hiw-cta__dur">· 30s</span>
      </button>
      {open && <VideoModal onClose={() => setOpen(false)} />}

      {/* Phones: inline player (CSS hides it on laptops; the lazy poster is then never downloaded) */}
      <section className="hiw-video" aria-label="How SmartAss Facts works">
        <div ref={box} className={`hiw-video__frame${live ? ' is-live' : ''}`}>
          {/* Phones get the small WebP; wider screens match no <source>, fall back to a blank pixel and download nothing */}
          <picture>
            <source media="(max-width: 768px)" srcSet={POSTER_SMALL} type="image/webp" />
            <img className="hiw-video__poster" src={BLANK} alt="How it works: 4 steps, zero sign-up" width={800} height={450} decoding="async" />
          </picture>
          <video ref={video} className="hiw-video__player" muted loop playsInline preload="none" aria-label={SUMMARY}
            onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onPlaying={() => setLive(true)} />
          <button type="button" className={`hiw-video__btn${playing ? ' is-small' : ''}`} onClick={toggle} aria-label={playing ? 'Pause the how-it-works video' : 'Play the how-it-works video'}>
            <span aria-hidden="true">{playing ? '❚❚' : '▶'}</span>
          </button>
        </div>
        <Steps />
      </section>
    </>
  )
}
