import type { Metadata } from 'next'
import AboutUs from '@/components/AboutUs'

export const metadata: Metadata = {
  title: 'About Us | SmartAss Facts',
  description: 'The story behind SmartAss Facts — the fact-or-fake trivia game.',
  alternates: { canonical: 'https://smartassfacts.com/about/' },
}

export default function Page() {
  return <AboutUs />
}
