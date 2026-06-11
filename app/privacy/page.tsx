import type { Metadata } from 'next'
import PrivacyPolicy from '@/components/PrivacyPolicy'

export const metadata: Metadata = {
  title: 'Privacy Policy | SmartAss Facts',
  alternates: { canonical: 'https://smartassfacts.com/privacy/' },
}

export default function Page() {
  return <PrivacyPolicy />
}
