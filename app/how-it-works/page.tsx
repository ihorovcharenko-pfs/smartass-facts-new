import type { Metadata } from 'next'
import HowItWorks from '@/components/HowItWorks'

export const metadata: Metadata = {
  title: 'How It Works | SmartAss Facts',
  description: 'How to play SmartAss Facts, plus answers to common questions.',
  alternates: { canonical: 'https://smartassfacts.com/how-it-works/' },
}

export default function Page() {
  return <HowItWorks />
}
