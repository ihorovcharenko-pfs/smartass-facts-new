// Campaign attribution for visitors who accept cookies AFTER landing.
//
// With Google consent mode the landing page_view fires while analytics_storage is
// still denied (cookieless ping). When the visitor then clicks Accept, consent flips
// to granted but GA4 sends no new page_view for the landing URL, so the session's
// source/medium (utm_*) are lost. This remembers the landing URL for the tab and
// replays ONE page_view for it once consent is granted.
//
// Does not touch the banner wording or the default consent state.
import { getConsent } from './consent'

const LANDING_KEY = 'sa_landing'
const SENT_KEY = 'sa_landing_sent'
const GA_ID = 'G-MS3N10PT93'

type Landing = { url: string; referrer: string; title: string }

// Call once on page load. Stores the first landing of the tab session only, and only
// when consent is not already granted (otherwise GA's own landing page_view already
// carried consent and a replay would double-count). A reload never overwrites it.
export function captureLanding() {
  if (typeof window === 'undefined') return
  try {
    if (getConsent() === 'granted') return
    if (sessionStorage.getItem(SENT_KEY) || sessionStorage.getItem(LANDING_KEY)) return
    const landing: Landing = { url: location.href, referrer: document.referrer, title: document.title }
    sessionStorage.setItem(LANDING_KEY, JSON.stringify(landing))
  } catch {
    /* private mode / storage blocked: attribution replay is best-effort */
  }
}

// Take the stored landing out of storage and mark it handled, so it can be replayed
// at most once per tab session (survives reloads).
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

// Called when consent becomes granted. `send` is false when GA had not loaded yet at
// that moment: its normal page_view at load will already carry consent, so we only
// clear the stored landing to prevent a later duplicate.
export function flushLanding(send: boolean) {
  if (typeof window === 'undefined') return
  if (getConsent() !== 'granted') return
  const landing = consumeLanding()
  if (!landing || !send) return

  const params = {
    page_location: landing.url,
    page_referrer: landing.referrer || undefined,
    page_title: landing.title || undefined,
    send_to: GA_ID,
  }
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[analytics] page_view (landing replay)', params)
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
