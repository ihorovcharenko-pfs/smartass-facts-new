'use client'

import { useState, useEffect } from 'react'
import { fetchMonthlyLeaderboard, fetchMyRank, type LeaderboardPlayer, type MyRankResponse } from '../services/clientService'
import { useAuth } from '../context/AuthContext'
import '../styles/Leaderboard.scss'

const RANK_BADGES: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function formatMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split('-')
  return `${MONTH_NAMES[parseInt(month, 10) - 1]} ${year}`
}

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) return <span className="lb-badge">{RANK_BADGES[rank]}</span>
  return <span className="lb-rank">#{rank}</span>
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="lb-row lb-row--skeleton">
          <div className="lb-skeleton lb-skeleton--rank" />
          <div className="lb-skeleton lb-skeleton--name" />
          <div className="lb-skeleton lb-skeleton--score" />
          <div className="lb-skeleton lb-skeleton--score" />
        </div>
      ))}
    </>
  )
}

function LeaderboardPage() {
  const { user, openAuthModal } = useAuth()
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([])
  const [yearMonth, setYearMonth] = useState('')
  const [myRank, setMyRank] = useState<MyRankResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [lb, rank] = await Promise.all([
          fetchMonthlyLeaderboard(),
          fetchMyRank(),
        ])
        setPlayers(lb.players)
        setYearMonth(lb.yearMonth)
        setMyRank(rank)
      } catch {
        setError('Could not load leaderboard. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="lb-page">
      <div className="lb-page__inner">

        {/* Header */}
        <div className="lb-header">
          <h1 className="lb-title">
            🏆 Smartass of the Month
          </h1>
          <p className="lb-subtitle">
            {yearMonth
              ? `Top players for ${formatMonth(yearMonth)} — ranked by total Daily Challenge score`
              : 'Monthly Daily Challenge rankings'}
          </p>
        </div>

        {/* My rank strip — shown when logged in */}
        {user && myRank && (
          <div className="lb-my-rank">
            {myRank.rank ? (
              <>
                <span className="lb-my-rank__label">Your rank this month</span>
                <span className="lb-my-rank__rank">
                  {myRank.rank <= 3 ? RANK_BADGES[myRank.rank] : `#${myRank.rank}`}
                </span>
                <span className="lb-my-rank__score">
                  {myRank.totalScore} pts · {myRank.gamesPlayed} games played
                </span>
                <span className="lb-my-rank__total">out of {myRank.totalPlayers} players</span>
              </>
            ) : (
              <span className="lb-my-rank__label">
                Play today's Daily Challenge to appear on the leaderboard!
              </span>
            )}
          </div>
        )}

        {/* Sign-in nudge for guests */}
        {!user && (
          <div className="lb-signin-nudge">
            <span>🔒 Sign in to track your rank and compete for Smartass of the Month</span>
            <button className="lb-signin-btn" onClick={() => openAuthModal('register')}>
              Create free account
            </button>
          </div>
        )}

        {/* Table */}
        <div className="lb-table">
          <div className="lb-table__head">
            <span>Rank</span>
            <span>Player</span>
            <span>Best score</span>
            <span>Total pts</span>
          </div>

          {error && <p className="lb-error">{error}</p>}

          {loading ? (
            <SkeletonRows />
          ) : players.length === 0 ? (
            <div className="lb-empty">
              <p>No one has played the Daily Challenge this month yet.</p>
              <p>Be the first — and claim the #1 spot!</p>
            </div>
          ) : (
            players.map(p => {
              const isMe = user?.id === p.userId
              return (
                <div
                  key={p.userId}
                  className={`lb-row ${p.rank <= 3 ? `lb-row--top${p.rank}` : ''} ${isMe ? 'lb-row--me' : ''}`}
                >
                  <div className="lb-row__rank">
                    <RankBadge rank={p.rank} />
                    {p.badge && p.badge !== p.rank && (
                      <span className="lb-row__prev-badge" title={`Won #${p.badge} last month`}>
                        {RANK_BADGES[p.badge]}
                      </span>
                    )}
                  </div>
                  <div className="lb-row__name">
                    {p.username}
                    {isMe && <span className="lb-row__you">you</span>}
                  </div>
                  <div className="lb-row__best">{p.bestDailyScore}/10</div>
                  <div className="lb-row__total">{p.totalScore} pts</div>
                </div>
              )
            })
          )}
        </div>

        {/* How scoring works */}
        <div className="lb-explainer">
          <h3>How it works</h3>
          <ul>
            <li>Complete the <strong>Daily Challenge</strong> each day while signed in</li>
            <li>Your score (0–10) is added to your monthly total</li>
            <li>Top 3 at month-end earn a permanent <strong>🥇🥈🥉 badge</strong> on their profile</li>
            <li>Leaderboard resets on the 1st of every month</li>
          </ul>
        </div>

      </div>
    </div>
  )
}

export default LeaderboardPage
