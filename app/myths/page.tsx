import type { Metadata } from 'next'
import MythsPage from '@/components/MythsPage'

export const metadata: Metadata = {
  title: 'Myths Debunked | SmartAss Facts',
  description: 'Common myths everyone believes — debunked. Separate fact from fiction.',
  alternates: { canonical: 'https://smartassfacts.com/myths/' },
}

export default function Page() {
  return <MythsPage />
}
