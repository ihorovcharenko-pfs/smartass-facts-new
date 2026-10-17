// Cookie consent state, shared by the React app and the static SEO pages (same
// localStorage key, same event names). Google consent mode: analytics storage is
// DENIED by default for everyone until the visitor chooses; ads are always denied.
export const CONSENT_KEY = 'sa_consent'
export type Consent = 'granted' | 'denied'

export function getConsent(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    return null
  }
}

export function setConsent(value: Consent) {
  try { localStorage.setItem(CONSENT_KEY, value) } catch { /* private mode */ }
  const w = window as unknown as { dataLayer?: unknown[] }
  w.dataLayer = w.dataLayer || []
  ;(function gtag(..._a: unknown[]) { w.dataLayer!.push(arguments) })('consent', 'update', {
    analytics_storage: value,
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
  window.dispatchEvent(new CustomEvent('sa-consent', { detail: value }))
}

export const OPEN_BANNER_EVENT = 'sa-open-cookie-banner'
