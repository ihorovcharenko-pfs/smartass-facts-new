'use client'

import dynamic from 'next/dynamic'

const BattleRouteClient = dynamic(() => import('@/components/BattleRouteClient'), {
  ssr: false,
})

export default function BattleRoutePage() {
  return <BattleRouteClient />
}
