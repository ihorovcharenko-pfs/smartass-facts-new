// Server-side data fetching for SSR. Runs on the server (or at the edge on
// Vercel), so the category grid is baked into the initial HTML — no client API
// round-trip before first paint. Cached for 5 min (categories rarely change);
// Next revalidates in the background.
import {
  API_BASE_URL,
  type Group,
  type Category,
  type CategoryPageResponse,
  type FactDetail,
  type RelatedFact,
} from './clientService'

const REVALIDATE_SECONDS = 300

// The API rate-limits bursts (429). A rate-limited or failed response must NEVER
// be treated as "not found" — that served real 404s to crawlers and baked empty
// grids into the cache. So: retry with backoff on 429/5xx/network errors, return
// null only on a genuine 404, and otherwise throw so Next serves the last good
// cached page (or a 5xx that crawlers retry) instead of caching a wrong result.
async function apiFetch<T>(path: string): Promise<T | null> {
  let lastErr: unknown
  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt > 0) await new Promise(r => setTimeout(r, 500 * 2 ** (attempt - 1)))
    try {
      const res = await fetch(`${API_BASE_URL}${path}`, { next: { revalidate: REVALIDATE_SECONDS } })
      if (res.ok) return (await res.json()) as T
      if (res.status === 404) return null
      lastErr = new Error(`API ${res.status} for ${path}`)
    } catch (e) {
      lastErr = e
    }
  }
  throw lastErr
}

export async function getGroupsServer(): Promise<Group[]> {
  try {
    return (await apiFetch<Group[]>('/api/client/groups')) ?? []
  } catch {
    return [] // sidebar filters are non-essential
  }
}

export async function getCategoriesServer(): Promise<Category[]> {
  return (await apiFetch<Category[]>('/api/client/categories')) ?? []
}

// /facts/[category] — page 1 of a category's fact list, server-rendered for SEO.
export async function getFactsByCategoryServer(
  slug: string,
  page = 1,
): Promise<CategoryPageResponse | null> {
  return apiFetch<CategoryPageResponse>(
    `/api/client/facts/by-category/${encodeURIComponent(slug)}?page=${page}`,
  )
}

// /facts/[category]/[slug] — a single fact + related, server-rendered for SEO.
export async function getFactByIdServer(
  id: number,
): Promise<{ fact: FactDetail; related: RelatedFact[] } | null> {
  return apiFetch<{ fact: FactDetail; related: RelatedFact[] }>(`/api/client/fact/${id}`)
}
