// /beat/[code] — short challenge links from the share card. Never indexed.
import type { Metadata } from 'next'
import BeatRouteClient from '@/components/BeatRouteClient'

export const metadata: Metadata = {
  title: 'Beat my score | SmartAss Facts',
  robots: { index: false, follow: false },
}

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  return <BeatRouteClient code={code} />
}
