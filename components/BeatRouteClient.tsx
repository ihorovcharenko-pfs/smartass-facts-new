'use client'

// Opens a /beat/CODE link: look the challenge up, remember it for this tab, fire
// challenge_link_opened, and drop the player straight into that category. The
// "Beat Gigi's 8/10 in Past Drama" banner is shown on the game screen itself.
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from './comic/Button'
import { fetchBeat } from '../services/clientService'
import { track } from '../utils/analytics'
import '../styles/comic.scss'

export default function BeatRouteClient({ code }: { code: string }) {
  const router = useRouter()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    fetchBeat(code).then(b => {
      if (!alive) return
      if (!b) { setFailed(true); return }
      try { sessionStorage.setItem('sa_beat', JSON.stringify({ code: b.code, name: b.name, score: b.score, total: b.total })) } catch { /* private mode */ }
      track('challenge_link_opened', { code: b.code, category_name: b.category, category: b.category })
      router.replace(`/game?cat=${encodeURIComponent(b.category)}&src=beat&beat=${b.code}`)
    })
    return () => { alive = false }
  }, [code, router])

  return (
    <div className="cp-screen">
      <div className="cp-col" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '60dvh' }}>
        {failed ? (
          <>
            <h1 className="cp-h1 cp-h1--orange">LINK EXPIRED</h1>
            <p className="cp-sub">We couldn&apos;t find that challenge. Pick any category and start your own.</p>
            <Button variant="yellow" onClick={() => router.push('/')}>Play now</Button>
          </>
        ) : (
          <>
            <h1 className="cp-h1 cp-h1--yellow">LOADING…</h1>
            <p className="cp-sub">Finding your challenge</p>
          </>
        )}
      </div>
    </div>
  )
}
