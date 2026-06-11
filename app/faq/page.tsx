import type { Metadata } from 'next'
import HowItWorks from '@/components/HowItWorks'

// /faq renders the How It Works page (its FAQ section lives at the bottom),
// matching the old SPA router behaviour.
export const metadata: Metadata = {
  title: 'FAQ | SmartAss Facts',
  description: 'Frequently asked questions about SmartAss Facts.',
  alternates: { canonical: 'https://smartassfacts.com/how-it-works/' },
}

export default function Page() {
  return <HowItWorks />
}
