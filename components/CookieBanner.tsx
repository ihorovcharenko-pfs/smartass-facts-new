'use client'

// Cookie consent banner. Shown to every visitor until they choose; the choice is
// stored in localStorage and drives Google consent mode (see utils/consent.ts and
// components/Analytics.tsx). "Cookie settings" in the footer reopens it.
import { useEffect, useRef, useState } from 'react'
import { getConsent, setConsent, OPEN_BANNER_EVENT } from '../utils/consent'
import '../styles/CookieBanner.scss'

export default function CookieBanner() {
  const [open, setOpen] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (getConsent() === null) setOpen(true)
    const reopen = () => setOpen(true)
    window.addEventListener(OPEN_BANNER_EVENT, reopen)
    return () => window.removeEventListener(OPEN_BANNER_EVENT, reopen)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('has-cookie-banner', open)
    return () => document.body.classList.remove('has-cookie-banner')
  }, [open])

  // Publish the bar's height (--cookie-banner-h) so page layouts can reserve that space
  // and the game controls are never covered. Cleared as soon as the banner closes.
  useEffect(() => {
    const root = document.documentElement
    const el = barRef.current
    if (!open || !el) { root.style.removeProperty('--cookie-banner-h'); return }
    const publish = () => root.style.setProperty('--cookie-banner-h', `${Math.ceil(window.innerHeight - el.getBoundingClientRect().top)}px`)
    publish()
    const ro = new ResizeObserver(publish)
    ro.observe(el)
    window.addEventListener('resize', publish)
    return () => { ro.disconnect(); window.removeEventListener('resize', publish); root.style.removeProperty('--cookie-banner-h') }
  }, [open])

  if (!open) return null
  const choose = (v: 'granted' | 'denied') => { setConsent(v); setOpen(false) }

  return (
    <div ref={barRef} className="cookie-banner" role="dialog" aria-label="Cookie consent">
      <p className="cookie-banner__text">
        We use cookies to understand how the site is used and to improve it. Analytics only runs if you accept.{' '}
        <a href="/cookies/">Cookie Policy</a>
      </p>
      <div className="cookie-banner__buttons">
        <button className="cookie-banner__btn cookie-banner__btn--decline" onClick={() => choose('denied')}>Decline</button>
        <button className="cookie-banner__btn cookie-banner__btn--accept" onClick={() => choose('granted')}>Accept</button>
      </div>
    </div>
  )
}
