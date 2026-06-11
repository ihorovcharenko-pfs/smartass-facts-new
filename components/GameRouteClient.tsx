'use client'

// Bridges the existing GameRoute (which expects a `navigate` prop) to the Next
// router via useApp(). Rendered client-only (see app/game/page.tsx).
import { useApp } from '../context/AppContext'
import GameRoute from './GameRoute'

export default function GameRouteClient() {
  const { navigate } = useApp()
  return <GameRoute navigate={navigate} />
}
