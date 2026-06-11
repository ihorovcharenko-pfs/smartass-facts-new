import type { MetadataRoute } from 'next'
import { CATEGORY_DISPLAY } from '@/utils/categoryNames'

const BASE = 'https://smartassfacts.com'

// Served at /sitemap.xml. Covers the main routes + every category listing.
// (Individual fact pages aren't enumerated here — they're linked from the
// category pages, which crawlers follow.)
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/facts',
    '/myths',
    '/vs',
    '/random',
    '/about',
    '/how-it-works',
    '/educators',
    '/leaderboard',
    '/privacy',
    '/terms',
    '/cookies',
  ]

  // De-dupe category slugs that map to the same branded name.
  const seen = new Set<string>()
  const categoryRoutes = Object.entries(CATEGORY_DISPLAY)
    .filter(([, name]) => (seen.has(name) ? false : (seen.add(name), true)))
    .map(([slug]) => `/facts/${slug}`)

  return [...staticRoutes, ...categoryRoutes].map(path => ({
    url: `${BASE}${path}`,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }))
}
