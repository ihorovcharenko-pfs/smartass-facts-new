// Landing page — a Server Component. It fetches the category data on the server
// and hands it to the client UI as props, so the full category grid ships in the
// initial HTML (fast LCP/FCP + crawlable for SEO) instead of being fetched after
// React boots, as it was in the old Vite SPA.
import type { Metadata } from 'next'
import MainPageClient from '../components/MainPageClient'
import { getGroupsServer, getCategoriesServer } from '../services/serverData'

export const metadata: Metadata = {
  title: 'SmartAss Facts — Fake or Fact Trivia Game',
  description: 'Can you tell fact from fiction? Pick a category and find out.',
  alternates: { canonical: 'https://smartassfacts.com/' },
}

export default async function HomePage() {
  const [groups, categories] = await Promise.all([
    getGroupsServer(),
    getCategoriesServer(),
  ])

  // Video structured data → eligible for video rich results
  const videoJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'How SmartAss Facts works: 4 steps, zero sign-up',
    description:
      'A 30-second walkthrough: pick a category, choose Fake or Fact, see the answer and the story behind it, then challenge a friend in Party Mode. Free, no sign-up.',
    thumbnailUrl: 'https://smartassfacts.com/media/howitworks_poster.jpg',
    contentUrl: 'https://smartassfacts.com/media/howitworks_1080p.mp4',
    uploadDate: '2026-11-09',
    duration: 'PT30S',
  }

  return (
    <>
      {/* Phones paint this poster early (small WebP); wider screens never fetch it */}
      <link rel="preload" as="image" href="/media/howitworks_poster_800.webp" type="image/webp" media="(max-width: 768px)" fetchPriority="high" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }} />
      <MainPageClient groups={groups} categories={categories} />
    </>
  )
}
