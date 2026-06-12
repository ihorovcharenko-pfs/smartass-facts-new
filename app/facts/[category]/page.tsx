// /facts/[category] — server-rendered category listing. Page 1 of the fact list
// is fetched on the server so search engines see the content directly.
import type { Metadata } from 'next'
import CategoryPage from '@/components/CategoryPage'
import { getFactsByCategoryServer } from '@/services/serverData'
import { getDisplayName } from '@/utils/categoryNames'

type Params = { params: Promise<{ category: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category } = await params
  const displayName = getDisplayName(category)
  const data = await getFactsByCategoryServer(category, 1)
  const thin = data === null || data.total < 5
  return {
    title: `${displayName} Facts | SmartAss Facts`,
    description: `Surprising ${displayName} facts — can you tell which are real and which are fake?`,
    alternates: { canonical: `https://smartassfacts.com/facts/${category}/` },
    ...(thin && { robots: { index: false, follow: true } }),
  }
}

export default async function Page({ params }: Params) {
  const { category } = await params
  const initialData = await getFactsByCategoryServer(category, 1)
  return <CategoryPage categorySlug={category} initialData={initialData} />
}
