'use client'

// Join-by-link: /room/ABCD — same client component, reads the code from the URL.
import dynamic from 'next/dynamic'

const RoomPageClient = dynamic(() => import('@/components/RoomPageClient'), {
  ssr: false,
})

export default function RoomCodeRoutePage() {
  return <RoomPageClient />
}
