// GA4 page_view control + campaign attribution for the consent flow.
//
// Rules (Google consent mode, all analytics denied until the visitor accepts):
//  - NOTHING is sent to GA4 before the visitor accepts: no page_view, no cookieless
//    pings, no GTM event tags. Enforced with GA's documented kill switch
//    window['ga-disable-<ID>'] (see setGaEnabled), because the GTM container has its
//    own Google tag + GA4 event tags that would otherwise ping while consent is denied.
//  - GA's automatic page_view is turned off (gtag config send_page_view:false); the
//    site sends page_view itself.
//  - On Accept, the FIRST GA4 hit is one page_view for the stored landing URL (utm_*
//    included) with the original referrer, so it carries _ss/_fv and starts the
//    session with the campaign data.
// The banner wording and the default consent state are not touched.
import { getConsent } from './consent'

const LANDING_KEY = 'sa_landing'
const SENT_KEY = 'sa_landing_sent'
const GA_ID = 'G-MS3N10PT93'

type Landing = { url: string; referrer: string; title: string }

// Hard on/off switch for every GA4 hit from this page (gtag.js and the GTM-hosted tags).
export function setGaEnabled(enabled: boolean) {
  if (typeof window === 'undefined') return
  ;(window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = !enabled
}

// Call once on page load. Stores the first landing of the tab session only, and only
// when consent is not already granted. A reload never overwrites it.
export function captureLanding() {
  if (typeof window === 'undefined') return
  try {
    if (getConsent() === 'granted') return
    if (sessionStorage.getItem(SENT_KEY) || sessionStorage.getItem(LANDING_KEY)) return
    const landing: Landing = { url: location.href, referrer: document.referrer, title: document.title }
    sessionStorage.setItem(LANDING_KEY, JSON.stringify(landing))
  } catch {
    /* private mode / storage blocked: attribution is best-effort */
  }
}

function consumeLanding(): Landing | null {
  try {
    const raw = sessionStorage.getItem(LANDING_KEY)
    if (!raw) return null
    sessionStorage.removeItem(LANDING_KEY)
    sessionStorage.setItem(SENT_KEY, '1')
    return JSON.parse(raw) as Landing
  } catch {
    return null
  }
}

function pushPageView(l: Landing) {
  const params = {
    page_location: l.url,
    page_referrer: l.referrer || undefined,
    page_title: l.title || undefined,
    send_to: GA_ID,
  }
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[analytics] page_view', params)
    return
  }
  try {
    const w = window as unknown as { dataLayer?: unknown[] }
    w.dataLayer = w.dataLayer || []
    // gtag.js only understands `arguments` objects, not plain arrays.
    // eslint-disable-next-line prefer-rest-params
    ;(function gtag(..._a: unknown[]) { w.dataLayer!.push(arguments) })('event', 'page_view', params)
  } catch {
    /* analytics must never break the site */
  }
}

// Consent is granted: enable GA and settle the stored landing.
//  send=true  -> GA was already loaded while consent was denied (and silenced), so send
//                the landing page_view ourselves; it is the FIRST GA4 hit (_ss/_fv).
//  send=false -> GA is loading now with consent already granted (returning visitor, or
//                Accept before GA loaded). The container's Google tag sends the
//                page_view itself, so sending another would duplicate it; just
//                clear the stored landing so it can't fire later.
// Must run after the consent 'update' has been queued (setConsent / bootstrap do).
export function flushLanding(send: boolean) {
  if (typeof window === 'undefined') return
  if (getConsent() !== 'granted') return
  setGaEnabled(true)
  const landing = consumeLanding()
  if (send) pushPageView(landing ?? { url: location.href, referrer: document.referrer, title: document.title })
}
