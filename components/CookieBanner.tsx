'use client'

// Cookie consent banner. Shown to every visitor until they choose; the choice is
// stored in localStorage and drives Google consent mode (see utils/consent.ts and
// components/Analytics.tsx). "Cookie settings" in the footer reopens it.
import { useEffect, useState } from 'react'
import { getConsent, setConsent, OPEN_BANNER_EVENT } from '../utils/consent'
import '../styles/CookieBanner.scss'

export default function CookieBanner() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (getConsent() === null) setOpen(true)
    const reopen = () => setOpen(true)
    window.addEventListener(OPEN_BANNER_EVENT, reopen)
    return () => window.removeEventListener(OPEN_BANNER_EVENT, reopen)
  }, [])

  if (!open) return null
  const choose = (v: 'granted' | 'denied') => { setConsent(v); setOpen(false) }

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
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
