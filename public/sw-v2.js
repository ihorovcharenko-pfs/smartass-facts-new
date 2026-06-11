// Smartass Facts — Service Worker
// Handles: (1) background push notifications
//          (2) stale-while-revalidate caching for critical API endpoints

// ── API cache ────────────────────────────────────────────────────────────────
const API_CACHE = 'saf-api-v1';

// URLs to cache with stale-while-revalidate strategy
const CACHED_API_URLS = [
  'https://api.smartassfacts.com/api/client/categories',
  'https://api.smartassfacts.com/api/client/groups',
];

// Claim all open tabs immediately so this SW intercepts their fetches on
// the very first load after installation (not just from the second visit on)
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// ── Stale-while-revalidate for API endpoints ─────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { url } = event.request;
  const isCachedUrl = CACHED_API_URLS.some(
    (u) => url === u || url.startsWith(u + '?')
  );
  if (isCachedUrl) {
    event.respondWith(staleWhileRevalidate(event.request));
  }
  // All other requests fall through to the network normally
});

async function staleWhileRevalidate(request) {
  const cache = await caches.open(API_CACHE);
  const cached = await cache.match(request);

  // Always refresh in background so the cache stays current
  const networkFetch = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null); // network failure — gracefully degrade

  // Return cached data instantly if available; wait for network otherwise
  return cached ?? networkFetch;
}

// ── Push notifications ────────────────────────────────────────────────────────
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "Smartass Facts", body: event.data.text() };
  }

  const { title = "🧠 Smartass Facts", body = "", icon = "/favicon.png", url = "/" } = payload;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge: "/favicon.png",
      data: { url },
      vibrate: [200, 100, 200],
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Focus an existing tab if one is open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            return client.focus();
          }
        }
        // Otherwise open a new tab
        if (clients.openWindow) return clients.openWindow(url);
      })
  );
});
