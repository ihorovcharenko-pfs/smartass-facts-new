import type { Metadata } from 'next'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import FactsPage from '@/components/FactsPage'

export const metadata: Metadata = {
  title: 'All Facts — Browse Fact-or-Fake Trivia | SmartAss Facts',
  description: 'Browse our full library of surprising facts by category. Can you tell fact from fake?',
  alternates: { canonical: 'https://smartassfacts.com/facts/' },
}

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://smartassfacts.com/' },
          { name: 'All Facts' },
        ]}
      />
      <FactsPage />
    </>
  )
}
