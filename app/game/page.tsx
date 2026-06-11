'use client'

// The game is fully interactive and reads browser APIs at render, so it's
// loaded client-only (no SSR). No SEO value here — it's behind a category click.
import dynamic from 'next/dynamic'

const GameRouteClient = dynamic(() => import('@/components/GameRouteClient'), {
  ssr: false,
})

export default function GameRoutePage() {
  return <GameRouteClient />
}
