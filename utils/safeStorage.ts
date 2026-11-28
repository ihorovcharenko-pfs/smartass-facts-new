// localStorage / sessionStorage that never throw. Some in-app browsers and privacy
// modes block storage entirely (every access throws a SecurityError); the site must
// keep working there, just without remembering anything.
type Area = 'localStorage' | 'sessionStorage'

function make(area: Area) {
  const store = (): Storage | null => {
    try { return typeof window === 'undefined' ? null : window[area] } catch { return null }
  }
  return {
    get(key: string): string | null {
      try { return store()?.getItem(key) ?? null } catch { return null }
    },
    set(key: string, value: string): void {
      try { store()?.setItem(key, value) } catch { /* blocked or full: ignore */ }
    },
    remove(key: string): void {
      try { store()?.removeItem(key) } catch { /* blocked: ignore */ }
    },
  }
}

export const safeLocal = make('localStorage')
export const safeSession = make('sessionStorage')
