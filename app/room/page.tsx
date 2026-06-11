'use client'

import dynamic from 'next/dynamic'

const RoomPageClient = dynamic(() => import('@/components/RoomPageClient'), {
  ssr: false,
})

export default function RoomRoutePage() {
  return <RoomPageClient />
}
