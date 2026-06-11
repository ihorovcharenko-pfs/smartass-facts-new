import type { Metadata } from 'next'
import CookiePolicy from '@/components/CookiePolicy'

export const metadata: Metadata = {
  title: 'Cookie Policy | SmartAss Facts',
  alternates: { canonical: 'https://smartassfacts.com/cookies/' },
}

export default function Page() {
  return <CookiePolicy />
}
