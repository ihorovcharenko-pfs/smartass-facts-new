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

export async function getGroupsServer(): Promise<Group[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/client/groups`, {
      next: { revalidate: REVALIDATE_SECONDS },
    })
    if (!res.ok) return []
    return (await res.json()) as Group[]
  } catch {
    return []
  }
}

export async function getCategoriesServer(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/client/categories`, {
      next: { revalidate: REVALIDATE_SECONDS },
    })
    if (!res.ok) return []
    return (await res.json()) as Category[]
  } catch {
    return []
  }
}

// /facts/[category] — page 1 of a category's fact list, server-rendered for SEO.
export async function getFactsByCategoryServer(
  slug: string,
  page = 1,
): Promise<CategoryPageResponse | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/client/facts/by-category/${encodeURIComponent(slug)}?page=${page}`,
      { next: { revalidate: REVALIDATE_SECONDS } },
    )
    if (!res.ok) return null
    return (await res.json()) as CategoryPageResponse
  } catch {
    return null
  }
}

// /facts/[category]/[slug] — a single fact + related, server-rendered for SEO.
export async function getFactByIdServer(
  id: number,
): Promise<{ fact: FactDetail; related: RelatedFact[] } | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/client/fact/${id}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    })
    if (!res.ok) return null
    return (await res.json()) as { fact: FactDetail; related: RelatedFact[] }
  } catch {
    return null
  }
}
