// Cookieless, aggregate-only campaign counter (client side + shared helpers).
//
// Counts per day + utm_source + utm_medium + utm_content for three events:
//   landing       - once per tab session per campaign (browser beacon, see captureCampaign)
//   game_start    - when a game starts, only for visitors who arrived with utm_source
//   game_complete - when the results screen is reached, same
// Nothing identifies a person: no cookies, no user or device IDs, no IP/user-agent
// stored. The only device storage is one sessionStorage entry holding the three
// sanitised campaign fields (cleared when the tab closes). Counted regardless of
// analytics consent.
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
// sessionStorage key (this tab only, gone when the tab closes). It holds ONLY the three
// sanitised campaign fields: no ID, no timestamp, no personal data. It makes a reload or
// back-navigation count as the same landing, and keeps game events attributed to the
// campaign the tab arrived with even if the URL later loses its utm_* parameters.
const KEY = 'sa_cc'
let captured = false
let campaign: Campaign | null = null

function send(event: CampaignEvent, c: Campaign) {
  const payload = JSON.stringify({ e: event, ...c })
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

// Call once as early as possible (components/Analytics.tsx). Remembers the campaign for
// this tab and counts ONE landing per tab session per campaign.
export function captureCampaign() {
  if (typeof window === 'undefined' || captured) return
  captured = true
  const fromUrl = readCampaign(new URLSearchParams(window.location.search))
  let stored: Campaign | null = null
  try {
    const raw = sessionStorage.getItem(KEY)
    if (raw) { const o = JSON.parse(raw); stored = normalizeCampaign(o?.s, o?.m, o?.c) }
  } catch { /* storage blocked: fall back to in-memory only */ }

  if (fromUrl) {
    campaign = fromUrl
    const same = !!stored && stored.s === fromUrl.s && stored.m === fromUrl.m && stored.c === fromUrl.c
    if (!same) {
      try { sessionStorage.setItem(KEY, JSON.stringify(fromUrl)) } catch { /* ignore */ }
      send('landing', fromUrl) // new campaign in this tab -> exactly one landing
    }
  } else {
    campaign = stored // later page loads in the tab keep the original campaign
  }
}

export function countCampaignEvent(event: Exclude<CampaignEvent, 'landing'>) {
  if (typeof window === 'undefined') return
  captureCampaign() // fallback if nothing captured yet
  if (!campaign) return
  send(event, campaign)
}
