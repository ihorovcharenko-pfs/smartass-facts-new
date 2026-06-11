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

  return <MainPageClient groups={groups} categories={categories} />
}
