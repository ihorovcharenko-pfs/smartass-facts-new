// Where a game was launched from (home_tile, replay, beat, battle…). Kept in memory
// only, NOT in the URL: a `src=` query parameter was being picked up by GA4 as the
// session source ("home_tile / (not set)"). It is sent as the `source` event parameter
// on game_start only.
let launchSource: string | null = null

export const setLaunchSource = (s: string) => { launchSource = s }

export function getLaunchSource(): string {
  if (launchSource) return launchSource
  // Full page load straight into /game: from another page of this site (the static SEO
  // pages' Play buttons) or from outside / typed (direct).
  try {
    const r = document.referrer
    if (r && new URL(r).origin === window.location.origin) return 'static_page'
  } catch { /* ignore */ }
  return 'direct'
}
