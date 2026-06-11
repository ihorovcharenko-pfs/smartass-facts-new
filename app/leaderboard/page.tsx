import type { Metadata } from 'next'
import LeaderboardPage from '@/components/LeaderboardPage'

export const metadata: Metadata = {
  title: 'Leaderboard | SmartAss Facts',
  description: 'See the top SmartAss Facts players this month.',
  alternates: { canonical: 'https://smartassfacts.com/leaderboard/' },
}

export default function Page() {
  return <LeaderboardPage />
}
