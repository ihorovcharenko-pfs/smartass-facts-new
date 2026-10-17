// GA4 custom events. Pushes onto the same dataLayer the GTM/GA4 bootstrap in
// components/Analytics.tsx uses, so events fired before that (deferred) script
// loads are queued and sent once it does. Production-only, like Analytics.tsx.
//
// Event catalogue (params: category, mode = single | daily | battle | party):
//   game_start, game_complete (score,total,percentage), game_replay,
//   challenge_created, share_click, party_room_created,
//   party_game_start (players), party_game_complete (players,score)
// Explicit send_to: with the GTM-hosted Google tag, plain gtag('event') calls are
// not forwarded; routing to the measurement ID is.
const GA_ID = 'G-MS3N10PT93'

export type GameMode = 'single' | 'daily' | 'battle' | 'party'

type EventParams = Record<string, string | number | boolean | undefined>

export function track(event: string, params: EventParams = {}) {
  if (typeof window === 'undefined') return
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[analytics]', event, params)
    return
  }
  try {
    const w = window as unknown as { dataLayer?: unknown[] }
    w.dataLayer = w.dataLayer || []
    // gtag.js only understands `arguments` objects, not plain arrays.
    // eslint-disable-next-line prefer-rest-params
    ;(function gtag(..._a: unknown[]) { w.dataLayer!.push(arguments) })('event', event, { ...params, send_to: GA_ID })
  } catch {
    /* analytics must never break the game */
  }
}
