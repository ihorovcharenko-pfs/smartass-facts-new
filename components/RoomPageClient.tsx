'use client'

// Bridges RoomPage to Next. Serves both /room (no code) and /room/[code]
// (join-by-link) — the optional :code param is read from the URL.
import { useParams } from 'next/navigation'
import { useApp } from '../context/AppContext'
import RoomPage from './RoomPage'

export default function RoomPageClient() {
  const params = useParams<{ code?: string }>()
  const { navigate } = useApp()
  const code = params?.code ? String(params.code).toUpperCase() : undefined
  return <RoomPage navigate={navigate} initialCode={code} />
}
