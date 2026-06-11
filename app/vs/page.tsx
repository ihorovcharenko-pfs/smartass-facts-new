import type { Metadata } from 'next'
import VsPage from '@/components/VsPage'

export const metadata: Metadata = {
  title: 'VS Comparisons | SmartAss Facts',
  description: 'Head-to-head comparisons that settle the debate. Which one is true?',
  alternates: { canonical: 'https://smartassfacts.com/vs/' },
}

export default function Page() {
  return <VsPage />
}
