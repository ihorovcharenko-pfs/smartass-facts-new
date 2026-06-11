import type { Metadata } from 'next'
import EducatorsPage from '@/components/EducatorsPage'

export const metadata: Metadata = {
  title: 'For Educators | SmartAss Facts',
  description: 'Use SmartAss Facts in the classroom — critical thinking through fact-or-fake trivia.',
  alternates: { canonical: 'https://smartassfacts.com/educators/' },
}

export default function Page() {
  return <EducatorsPage />
}
