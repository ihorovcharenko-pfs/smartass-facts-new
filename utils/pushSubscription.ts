import { API_BASE_URL } from '../services/clientService'

const PUSH_DISMISSED_KEY = 'sa_push_dismissed'
const PUSH_SUBSCRIBED_KEY = 'sa_push_subscribed'

/** Has the user already subscribed or permanently dismissed the prompt? */
export function isPushSeen(): boolean {
  return (
    localStorage.getItem(PUSH_DISMISSED_KEY) === '1' ||
    localStorage.getItem(PUSH_SUBSCRIBED_KEY) === '1'
  )
}

export function markPushDismissed() {
  localStorage.setItem(PUSH_DISMISSED_KEY, '1')
}

export function markPushSubscribed() {
  localStorage.setItem(PUSH_SUBSCRIBED_KEY, '1')
}

/** True if the browser supports web push at all. */
export function isPushSupported(): boolean {
  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

/** Current browser notification permission. */
export function getPermission(): NotificationPermission {
  return Notification.permission
}

/** Convert a URL-safe base64 VAPID key to Uint8Array (required by pushManager.subscribe). */
function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const arr = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) arr[i] = rawData.charCodeAt(i)
  return arr.buffer as ArrayBuffer
}

/** Fetch the VAPID public key from the server. */
async function fetchVapidKey(): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/push/vapid-key`)
  if (!res.ok) throw new Error('Push not available')
  const data = await res.json()
  return data.key as string
}

/**
 * Register the service worker, request notification permission, create a push
 * subscription, and save it to the server.
 * Returns true on success.
 */
export async function subscribeToPush(): Promise<boolean> {
  if (!isPushSupported()) return false

  try {
    // 1. Register service worker
    const reg = await navigator.serviceWorker.register('/sw-v2.js')
    await navigator.serviceWorker.ready

    // 2. Request permission
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return false

    // 3. Get VAPID public key
    const vapidKey = await fetchVapidKey()

    // 4. Subscribe to push
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    })

    // 5. Save subscription to server
    const { endpoint, keys } = subscription.toJSON() as {
      endpoint: string
      keys: { p256dh: string; auth: string }
    }

    const res = await fetch(`${API_BASE_URL}/api/push/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint, keys }),
    })

    if (!res.ok) return false

    markPushSubscribed()
    return true
  } catch (err) {
    console.error('Push subscription failed:', err)
    return false
  }
}
