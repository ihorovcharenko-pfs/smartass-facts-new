'use client'

import { useEffect, useState } from 'react'
import { submitDailyScore, fetchDailyRank, type DailyRankResponse } from '../services/clientService'
import { getSessionToken } from '../utils/localStorage'
import '../styles/LeaderboardBanner.scss'

interface LeaderboardBannerProps {
  score: number
  total: number
  poolDate: string
}

function LeaderboardBanner({ score, total, poolDate }: LeaderboardBannerProps) {
  const [rank, setRank] = useState<DailyRankResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      const token = getSessionToken()
      // Try submitting (upserts — safe to call even if already submitted)
      let result = await submitDailyScore(token, score, poolDate)
      // If submit fails (e.g. already played), fall back to rank fetch
      if (!result) {
        result = await fetchDailyRank(token, poolDate)
      }
      setRank(result)
      setLoading(false)
    }
    run()
  }, [score, poolDate])

  if (loading) {
    return (
      <div className="lb-banner lb-banner--loading">
        <div className="lb-banner__skeleton" />
      </div>
    )
  }

  if (!rank) return null

  const pct = Math.round(100 - rank.rankPercentile)
  const label = pct <= 10
    ? '🏆 Top 10%!'
    : pct <= 25
    ? '🎯 Top 25%'
    : pct <= 50
    ? '👏 Top half'
    : '💪 Keep going'

  return (
    <div className="lb-banner">
      <div className="lb-banner__score">
        You scored <strong>{score}/{total}</strong>
      </div>
      <div className="lb-banner__rank">
        {label} — top <strong>{pct}%</strong> of players today
        <span className="lb-banner__total"> (out of {rank.totalPlayers.toLocaleString()})</span>
      </div>
    </div>
  )
}

export default LeaderboardBanner
