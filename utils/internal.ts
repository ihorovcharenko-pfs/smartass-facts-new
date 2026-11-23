// Internal-traffic flag for the site owner's own devices.
//   ?internal=1 on any page  -> localStorage sa_internal=1 (stays until cleared)
//   ?internal=0 on any page  -> flag removed
// While set: every GA4 hit carries traffic_type=internal (so a GA4 "Internal traffic"
// data filter can exclude it) and the campaign counter (/api/c) is skipped.
const KEY = 'sa_internal'

// Call once on page load, before any analytics. Applies ?internal=1/0, then reports state.
export function applyInternalFlag(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const v = new URLSearchParams(window.location.search).get('internal')
    if (v === '1') localStorage.setItem(KEY, '1')
    else if (v === '0') localStorage.removeItem(KEY)
  } catch {
    /* storage blocked: flag unavailable */
  }
  return isInternal()
}

export function isInternal(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}
