'use client'

// Bridges BattleRoute to Next: reads the :id route param and supplies navigate.
import { useParams } from 'next/navigation'
import { useApp } from '../context/AppContext'
import BattleRoute from './BattleRoute'

export default function BattleRouteClient() {
  const params = useParams<{ id: string }>()
  const { navigate } = useApp()
  return <BattleRoute battleId={String(params?.id ?? '')} navigate={navigate} />
}
