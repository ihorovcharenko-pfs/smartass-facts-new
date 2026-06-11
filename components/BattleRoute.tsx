'use client'

import { useState, useEffect, useCallback } from 'react'
import GamePage from './GamePage'
import BattleResultsScreen from './BattleResultsScreen'
import { fetchBattle, type BattleSession } from '../services/clientService'
import { GAME_PATH, buildGameSearch } from './GameRoute'
import '../styles/Battle.scss'

type BattleStatus = 'loading' | 'error' | 'intro' | 'playing' | 'results'

interface BattleRouteProps {
  battleId: string
  navigate: (pathname: string, search?: string, replace?: boolean) => void
}

function BattleRoute({ battleId, navigate }: BattleRouteProps) {
  const [status, setStatus] = useState<BattleStatus>('loading')
  const [battle, setBattle] = useState<BattleSession | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [myScore, setMyScore] = useState<number>(0)

  useEffect(() => {
    fetchBattle(battleId)
      .then(data => {
        setBattle(data)
        setStatus('intro')
      })
      .catch(err => {
        setErrorMsg(err.message || 'Battle not found')
        setStatus('error')
      })
  }, [battleId])

  const handleStart = useCallback(() => setStatus('playing'), [])

  const handleGameComplete = useCallback((correctCount: number) => {
    setMyScore(correctCount)
    setStatus('results')
  }, [])

  const handlePlayAgain = useCallback(() => {
    if (!battle) return
    navigate(GAME_PATH, buildGameSearch(battle.category))
  }, [battle, navigate])

  const handleGoHome = useCallback(() => navigate('/'), [navigate])

  // ── Loading ────────────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="battle-intro">
        <div className="battle-intro__icon">⚔️</div>
        <h1 className="battle-intro__title">Loading challenge…</h1>
      </div>
    )
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (status === 'error' || !battle) {
    return (
      <div className="battle-intro">
        <div className="battle-intro__icon">😕</div>
        <h1 className="battle-intro__title">Challenge not found</h1>
        <p className="battle-intro__error">
          {errorMsg || 'This battle link may have expired or is invalid.'}
        </p>
        <button className="battle-intro__home-btn" onClick={handleGoHome}>
          ← Back to home
        </button>
      </div>
    )
  }

  // ── Intro card ─────────────────────────────────────────────────────────────
  if (status === 'intro') {
    return (
      <div className="battle-intro">
        <div className="battle-intro__icon">⚔️</div>
        <h1 className="battle-intro__title">You've been challenged!</h1>
        <p className="battle-intro__sub">
          Beat their score on the same {battle.totalFacts} questions.
        </p>

        <div className="battle-intro__card">
          <p className="battle-intro__category">{battle.category}</p>
          <p className="battle-intro__score">
            {battle.challengerScore}
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#aaa' }}>
              /{battle.totalFacts}
            </span>
          </p>
          <p className="battle-intro__score-label">their score — can you top it?</p>
        </div>

        <button className="battle-intro__start-btn" onClick={handleStart}>
          Accept challenge →
        </button>
      </div>
    )
  }

  // ── Playing ────────────────────────────────────────────────────────────────
  if (status === 'playing') {
    return (
      <GamePage
        facts={battle.facts}
        category={battle.category}
        onBack={handleGoHome}
        onContinue={handleGoHome}
        onPlayAgain={handlePlayAgain}
        onGameComplete={handleGameComplete}
      />
    )
  }

  // ── Results ────────────────────────────────────────────────────────────────
  return (
    <BattleResultsScreen
      category={battle.category}
      challengerScore={battle.challengerScore}
      myScore={myScore}
      totalFacts={battle.totalFacts}
      battleId={battle.id}
      onPlayAgain={handlePlayAgain}
      onGoHome={handleGoHome}
    />
  )
}

export default BattleRoute
