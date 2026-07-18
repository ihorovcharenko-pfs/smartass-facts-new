import type { Metadata } from 'next'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import RandomFactsPage from '@/components/RandomFactsPage'

export const metadata: Metadata = {
  title: 'Random Facts Generator — Verified Facts | SmartAss Facts',
  description: 'Hit the button for a random surprising fact. Endlessly shareable.',
  alternates: { canonical: 'https://smartassfacts.com/random/' },
}

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://smartassfacts.com/' },
          { name: 'Random Facts' },
        ]}
      />
      <RandomFactsPage />
    </>
  )
}
