// Cookieless, aggregate-only campaign counter (client side + shared helpers).
//
// Counts per day + utm_source + utm_medium + utm_content for three events:
//   landing       - counted server-side in proxy.ts from the page request itself
//   game_start    - counted from the browser, only for visitors who arrived with utm_source
//   game_complete - same
// Nothing identifies a person: no cookies, no localStorage/sessionStorage, no user or
// device IDs, no IP/user-agent stored. The campaign values live only in this module's
// memory for the life of the page (lost on a full reload), and only the three
// sanitised fields + the event name are sent. Counted regardless of analytics consent.
export type CampaignEvent = 'landing' | 'game_start' | 'game_complete'
export type Campaign = { s: string; m: string; c: string }

const NONE = '(none)'

function clean(v: string | null | undefined): string {
  return (v ?? '').toLowerCase().replace(/[^a-z0-9_.-]/g, '').slice(0, 40)
}

// null when the visit isn't campaign-tagged (no utm_source): such visits aren't counted.
export function normalizeCampaign(source?: string | null, medium?: string | null, content?: string | null): Campaign | null {
  const s = clean(source)
  if (!s) return null
  return { s, m: clean(medium) || NONE, c: clean(content) || NONE }
}

export function readCampaign(params: URLSearchParams): Campaign | null {
  return normalizeCampaign(params.get('utm_source'), params.get('utm_medium'), params.get('utm_content'))
}

// ── browser only ─────────────────────────────────────────────────────────────
let captured = false
let campaign: Campaign | null = null

// Call once as early as possible (components/Analytics.tsx). Remembers the landing
// campaign in memory so it survives in-app navigation (/ -> /game).
export function captureCampaign() {
  if (typeof window === 'undefined' || captured) return
  captured = true
  campaign = readCampaign(new URLSearchParams(window.location.search))
}

export function countCampaignEvent(event: Exclude<CampaignEvent, 'landing'>) {
  if (typeof window === 'undefined') return
  captureCampaign() // fallback if nothing captured yet (e.g. direct landing on /game)
  if (!campaign) return
  const payload = JSON.stringify({ e: event, ...campaign })
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[campaign-count]', payload)
    return
  }
  try {
    const sent = navigator.sendBeacon?.('/api/c', new Blob([payload], { type: 'application/json' }))
    if (!sent) fetch('/api/c', { method: 'POST', body: payload, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {})
  } catch {
    /* counting must never break the game */
  }
}
