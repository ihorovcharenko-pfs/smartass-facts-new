// /facts/[category]/[slug] — server-rendered single fact page (the long-tail SEO
// pages). Fetches the fact AND decrypts its answer on the server, so the full
// statement + verdict are in the initial HTML.
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import FactDetailPage from '@/components/FactDetailPage'
import { getFactByIdServer } from '@/services/serverData'
import { decryptAnswer } from '@/utils/decryption'
import { getDisplayName } from '@/utils/categoryNames'

type Params = { params: Promise<{ category: string; slug: string }> }

const parseId = (slug: string) => parseInt(slug.split('-')[0], 10)

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category, slug } = await params
  const id = parseId(slug)
  if (isNaN(id)) return { title: 'Fact not found | SmartAss Facts' }
  const data = await getFactByIdServer(id)
  if (!data) return { title: 'Fact not found | SmartAss Facts' }
  return {
    title: `${data.fact.saFact} | SmartAss Facts`,
    description: data.fact.explanation?.slice(0, 155) || undefined,
    alternates: { canonical: `https://smartassfacts.com/facts/${category}/${slug}/` },
  }
}

export default async function Page({ params }: Params) {
  const { category, slug } = await params
  const id = parseId(slug)
  if (isNaN(id)) notFound()
  // getFactByIdServer here hits the same cached/memoized fetch as generateMetadata.
  const data = await getFactByIdServer(id)

  if (!data) notFound()

  let initialIsReal: boolean | null = null
  try {
    initialIsReal = await decryptAnswer(data.fact.answer)
  } catch {
    initialIsReal = null
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'All Facts', url: 'https://smartassfacts.com/facts/' },
          { name: getDisplayName(category), url: `https://smartassfacts.com/facts/${category}/` },
          { name: data.fact.saFact },
        ]}
      />
      <FactDetailPage
        categorySlug={category}
        factSlug={slug}
        initialFact={data.fact}
        initialRelated={data.related}
        initialIsReal={initialIsReal}
      />
    </>
  )
}
