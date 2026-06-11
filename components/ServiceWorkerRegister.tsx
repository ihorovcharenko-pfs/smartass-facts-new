'use client'

// Registers the service worker (API caching + web push). Production only —
// a caching SW would interfere with Next's dev HMR.
import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (!('serviceWorker' in navigator)) return
    navigator.serviceWorker.register('/sw-v2.js').catch(() => {
      // Graceful degradation — caching/push just won't be available.
    })
  }, [])

  return null
}
