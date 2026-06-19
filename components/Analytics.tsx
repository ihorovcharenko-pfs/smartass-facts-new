'use client'

// Third-party analytics, ported from the old index.html. Loads only in
// production so local dev traffic never reaches GA/GTM/Amplitude/Metricool.
//   - GTM (which loads GA4) + GA4 dataLayer bootstrap → next/script, afterInteractive
//   - Amplitude + Metricool → deferred until first interaction or 3s, to keep
//     them off the critical path (≈180 KB of JS)
import Script from 'next/script'
import { useEffect } from 'react'

const IS_PROD = process.env.NODE_ENV === 'production'

export default function Analytics() {
  useEffect(() => {
    if (!IS_PROD) return

    let loaded = false
    const loadThirdParty = () => {
      if (loaded) return
      loaded = true

      // Amplitude (with session replay sampled at 10%)
      const amp = document.createElement('script')
      amp.async = true
      amp.src = 'https://cdn.amplitude.com/script/c4cf7ea13a50469278d4a1b1b222a0d3.js'
      amp.onload = () => {
        const w = window as unknown as {
          amplitude?: { add: (p: unknown) => void; init: (k: string, o: unknown) => void }
          sessionReplay?: { plugin: (o: unknown) => unknown }
        }
        if (w.amplitude && w.sessionReplay) {
          w.amplitude.add(w.sessionReplay.plugin({ sampleRate: 0.1 }))
          w.amplitude.init('c4cf7ea13a50469278d4a1b1b222a0d3', {
            fetchRemoteConfig: true,
            autocapture: {
              attribution: true,
              fileDownloads: true,
              formInteractions: true,
              pageViews: true,
              sessions: true,
              elementInteractions: true,
              networkTracking: true,
              webVitals: true,
              frustrationInteractions: {
                thrashedCursor: true,
                errorClicks: true,
                deadClicks: true,
                rageClicks: true,
              },
            },
          })
        }
      }
      document.head.appendChild(amp)

      // Metricool
      const mc = document.createElement('script')
      mc.type = 'text/javascript'
      mc.src = 'https://tracker.metricool.com/resources/be.js'
      const start = () => {
        const w = window as unknown as { beTracker?: { t: (o: unknown) => void } }
        w.beTracker?.t({ hash: '36cfdddb80fbd4334383452901c6b62e' })
      }
      mc.onload = start
      document.getElementsByTagName('head')[0].appendChild(mc)
    }

    const events: Array<keyof DocumentEventMap> = ['click', 'touchstart', 'keydown', 'scroll']
    events.forEach(e => document.addEventListener(e, loadThirdParty, { once: true, passive: true }))
    const timer = setTimeout(loadThirdParty, 3000)

    return () => {
      clearTimeout(timer)
      events.forEach(e => document.removeEventListener(e, loadThirdParty))
    }
  }, [])

  if (!IS_PROD) return null

  return (
    <>
      {/* Google Tag Manager (loads GA4). lazyOnload: GTM's ~125KB runs after the
          page is idle, so it doesn't block the main thread (TBT) during the LCP
          window. Pageviews still fire, just a moment later. */}
      <Script id="gtm" strategy="lazyOnload">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-KBFTJDH2');`}
      </Script>
      {/* GA4 dataLayer bootstrap — the library itself comes from GTM above */}
      <Script id="ga4-bootstrap" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-MS3N10PT93');`}
      </Script>
    </>
  )
}
