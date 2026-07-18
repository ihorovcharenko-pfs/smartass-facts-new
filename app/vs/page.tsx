import type { Metadata } from 'next'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import VsPage from '@/components/VsPage'

export const metadata: Metadata = {
  title: 'VS Comparisons | SmartAss Facts',
  description: 'Head-to-head comparisons that settle the debate. Which one is true?',
  alternates: { canonical: 'https://smartassfacts.com/vs/' },
}

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://smartassfacts.com/' },
          { name: 'vs Comparisons' },
        ]}
      />
      <VsPage />
    </>
  )
}
