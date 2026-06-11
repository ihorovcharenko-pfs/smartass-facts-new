import type { Metadata } from 'next'
import TermsOfService from '@/components/TermsOfService'

export const metadata: Metadata = {
  title: 'Terms of Service | SmartAss Facts',
  alternates: { canonical: 'https://smartassfacts.com/terms/' },
}

export default function Page() {
  return <TermsOfService />
}
