import type { Metadata } from 'next'
import RandomFactsPage from '@/components/RandomFactsPage'

export const metadata: Metadata = {
  title: 'Random Facts Generator — Verified Facts | SmartAss Facts',
  description: 'Hit the button for a random surprising fact. Endlessly shareable.',
  alternates: { canonical: 'https://smartassfacts.com/random/' },
}

export default function Page() {
  return <RandomFactsPage />
}
