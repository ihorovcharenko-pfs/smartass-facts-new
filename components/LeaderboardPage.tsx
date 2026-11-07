'use client'

// "Hall of SmartAsses": Today / This week / All time, category filter, podium, list,
// and the signed-in player's own rank pinned at the bottom in lime.
import { useEffect, useState } from 'react'
import Button from './comic/Button'
import Card from './comic/Card'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import {
  fetchPeriodLeaderboard, fetchMyPosition, fetchCategories,
  type LeaderboardPeriod, type PeriodPlayer, type MyPosition,
} from '../services/clientService'
import { track } from '../utils/analytics'
import '../styles/comic.scss'

const TABS: Array<{ id: LeaderboardPeriod; label: string }> = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This week' },
  { id: 'all', label: 'All time' },
]

const initial = (name: string) => (name.trim()[0] || '?').toUpperCase()
const fmt = (n: number) => n.toLocaleString('en-US')

function LeaderboardPage() {
  const { navigate } = useApp()
  const { user, openAuthModal } = useAuth()
  const [period, setPeriod] = useState<LeaderboardPeriod>('week')
  const [category, setCategory] = useState<string>('')
  const [categories, setCategories] = useState<string[]>([])
  const [players, setPlayers] = useState<PeriodPlayer[]>([])
  const [me, setMe] = useState<MyPosition | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [reload, setReload] = useState(0)

  useEffect(() => {
    fetchCategories().then(cs => setCategories(cs.map(c => c.saCategory).filter(n => n.toLowerCase() !== 'game of the day').sort((a, b) => a.localeCompare(b)))).catch(() => {})
  }, [])

  useEffect(() => {
    let alive = true
    setLoading(true); setError(false)
    Promise.all([fetchPeriodLeaderboard(period, category || null), fetchMyPosition(period, category || null)])
      .then(([lb, mine]) => { if (!alive) return; setPlayers(lb.players); setMe(mine) })
      .catch(() => { if (alive) setError(true) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [period, category, user?.id, reload])

  const top = players.slice(0, 3)
  const rest = players.slice(3)
  const slot = (p: PeriodPlayer | undefined, place: 1 | 2 | 3) => {
    if (!p) return <div className="cp-podium__slot" aria-hidden="true" />
    const bg = place === 1 ? 'var(--cp-yellow)' : place === 2 ? '#fff' : 'var(--cp-orange)'
    const h = place === 1 ? 128 : place === 2 ? 100 : 86
    return (
      <div className="cp-podium__slot" style={{ order: place === 2 ? 0 : place === 1 ? 1 : 2 }}>
        <div className="cp-podium__avatar" style={{ background: bg, width: place === 1 ? 64 : 56, height: place === 1 ? 64 : 56 }}>{initial(p.username)}</div>
        <span className="cp-podium__name">{p.username}</span>
        <div className="cp-podium__block" style={{ background: bg, minHeight: h }}>
          <strong>{place}</strong>
          <span>{fmt(p.points)}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="cp-screen">
      <div className="cp-col">
        <div className="cp-topbar" style={{ justifyContent: 'flex-start' }}>
          <Button variant="yellow" size="round" aria-label="Back to home" onClick={() => navigate('/')}>←</Button>
          <h1 className="cp-cat-name" style={{ margin: 0 }}>Hall of SmartAsses</h1>
        </div>

        <div className="cp-tabs" role="tablist" aria-label="Time range">
          {TABS.map(t => (
            <button key={t.id} type="button" role="tab" aria-selected={period === t.id} onClick={() => setPeriod(t.id)}>{t.label}</button>
          ))}
        </div>

        <label>
          <span className="cp-label" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Category</span>
          <select className="cp-select" value={category} onChange={e => setCategory(e.target.value)} aria-label="Filter by category">
            <option value="">All categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        {error ? (
          <Card tone="navy" role="alert">
            <strong>Couldn&apos;t load the board.</strong>
            <p className="cp-muted" style={{ margin: '6px 0 12px' }}>Check your connection and try again.</p>
            <Button size="small" variant="yellow" onClick={() => setReload(n => n + 1)}>Try again</Button>
          </Card>
        ) : loading ? (
          <p className="cp-sub cp-muted" role="status">Loading the board…</p>
        ) : players.length === 0 ? (
          <Card tone="navy">
            <strong>Nobody here yet.</strong>
            <p className="cp-muted" style={{ margin: '6px 0 0' }}>Play a game while signed in and you&apos;ll claim the #1 spot.</p>
          </Card>
        ) : (
          <>
            <div className="cp-podium">{slot(top[1], 2)}{slot(top[0], 1)}{slot(top[2], 3)}</div>
            {rest.length > 0 && (
              <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {rest.map(p => (
                  <li key={p.userId} className={`cp-rank-row${user?.id === p.userId ? ' cp-rank-row--me' : ''}`}>
                    <span className="cp-rank-row__rank">{p.rank}</span>
                    <span className="cp-rank-row__avatar" aria-hidden="true">{initial(p.username)}</span>
                    <span className="cp-rank-row__name">{p.username}</span>
                    <span className="cp-rank-row__pts">{fmt(p.points)}</span>
                  </li>
                ))}
              </ol>
            )}
          </>
        )}

        <div className="cp-spacer" />

        {user ? (
          <div className="cp-rank-row cp-rank-row--me" aria-label="Your rank">
            <span className="cp-rank-row__rank" style={{ width: 'auto' }}>{me?.rank ? `#${me.rank}` : '–'}</span>
            <span className="cp-rank-row__avatar" aria-hidden="true">{initial(user.username)}</span>
            <span className="cp-rank-row__name">You{me?.rank ? '' : ' · play a game to get ranked'}</span>
            <span className="cp-rank-row__pts">{fmt(me?.points ?? 0)}</span>
          </div>
        ) : (
          <div className="cp-rank-row cp-rank-row--me">
            <span className="cp-rank-row__name">Sign in to see your rank</span>
            <Button size="small" variant="white" onClick={() => openAuthModal('login')}>Sign in</Button>
          </div>
        )}

        <Button variant="yellow" block onClick={() => { track('leaderboard_cta', { period }); navigate('/') }}>Climb the board: play now</Button>
      </div>
    </div>
  )
}

export default LeaderboardPage
