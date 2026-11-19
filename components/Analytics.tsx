'use client'

// All third-party analytics — GTM (which loads GA4), Amplitude, Metricool —
// production-only. The landing-page LCP is gated by *element render delay* (the
// main thread is busy hydrating + running scripts), NOT by network. So every
// analytics tag is loaded only AFTER the first interaction OR once the main
// thread goes idle (requestIdleCallback, i.e. past the critical render). This
// keeps ~300 KB of third-party JS off the LCP path. Pageviews still fire.
import { useEffect } from 'react'
import { getConsent } from '../utils/consent'
import { captureLanding, flushLanding, setGaEnabled } from '../utils/landing'
import { captureCampaign } from '../utils/campaign'

const IS_PROD = process.env.NODE_ENV === 'production'

export default function Analytics() {
  useEffect(() => {
    // Remember utm_* in memory so game events can be attributed after in-app navigation.
    captureCampaign()

    if (!IS_PROD) return

    // Remember the landing URL (with utm_*) so it can be re-sent once consent is granted.
    captureLanding()

    let loaded = false
    let trackersLoaded = false
    let loadTrackers: () => void = () => {}
    const loadThirdParty = () => {
      if (loaded) return
      loaded = true

      // GTM + GA4 dataLayer bootstrap (exact original inline script, just deferred)
      const gtm = document.createElement('script')
      gtm.text =
        "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}" +
        // Nothing goes to GA4 before the visitor accepts (kill switch flipped in utils/landing.ts)
        "window['ga-disable-G-MS3N10PT93']=true;" +
        // Consent mode: analytics DENIED until the visitor accepts (stored choice restored here)
        "gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});" +
        "try{if(localStorage.getItem('sa_consent')==='granted')gtag('consent','update',{analytics_storage:'granted'});}catch(e){}" +
        "gtag('js',new Date());gtag('config','G-MS3N10PT93',{send_page_view:false});" +
        "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-KBFTJDH2');"
      document.head.appendChild(gtm)
      // GA is loading with consent already granted (returning visitor, or Accept before
      // GA loaded): lift the kill switch; the container's Google tag sends the page_view.
      if (getConsent() === 'granted') flushLanding(false)

      const w = window as unknown as {
        amplitude?: { add: (p: unknown) => void; init: (k: string, o: unknown) => void }
        sessionReplay?: { plugin: (o: unknown) => unknown }
        beTracker?: { t: (o: unknown) => void }
      }

      // Amplitude + Metricool set cookies / record sessions → only with consent.
      loadTrackers = () => {
      if (trackersLoaded) return
      trackersLoaded = true
      // Amplitude (session replay sampled at 10%)
      const amp = document.createElement('script')
      amp.async = true
      amp.src = 'https://cdn.amplitude.com/script/c4cf7ea13a50469278d4a1b1b222a0d3.js'
      amp.onload = () => {
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
      mc.src = 'https://tracker.metricool.com/resources/be.js'
      mc.onload = () => w.beTracker?.t({ hash: '36cfdddb80fbd4334383452901c6b62e' })
      document.head.appendChild(mc)

      // Metricool tracking pixel (same hash; equivalent of the <img> snippet)
      new Image().src = 'https://tracker.metricool.com/c3po.jpg?hash=36cfdddb80fbd4334383452901c6b62e'
      }
      if (getConsent() === 'granted') loadTrackers()
    }

    const events: Array<keyof DocumentEventMap> = ['click', 'touchstart', 'keydown', 'scroll']
    events.forEach(e => document.addEventListener(e, loadThirdParty, { once: true, passive: true }))

    // Load once the main thread is idle (after hydration/LCP). Small initial
    // delay so we don't even schedule during the busy startup; hard cap via timeout.
    const ric = (
      window as unknown as {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      }
    ).requestIdleCallback
    const timer = setTimeout(() => {
      if (ric) ric(loadThirdParty, { timeout: 4000 })
      else loadThirdParty()
    }, 2500)

    // Accepting later (banner) starts the consent-gated trackers right away and sends
    // the landing page_view as the first GA4 hit.
    const onConsent = () => {
      const gaWasLoaded = loaded
      loadThirdParty()
      if (getConsent() === 'granted') {
        loadTrackers()
        if (gaWasLoaded) flushLanding(true)
      } else {
        setGaEnabled(false)
      }
    }
    window.addEventListener('sa-consent', onConsent)

    return () => {
      window.removeEventListener('sa-consent', onConsent)
      clearTimeout(timer)
      events.forEach(e => document.removeEventListener(e, loadThirdParty))
    }
  }, [])

  return null
}
