'use client'

// Summary (end of a solo game): score badge, verdict, stat chips, challenge / share / replay.
import { useEffect, useRef, useState } from 'react'
import Button from './comic/Button'
import CategorySticker from './comic/CategorySticker'
import ShareSheet from './comic/ShareSheet'
import EmailCaptureForm from './EmailCaptureForm'
import LeaderboardBanner from './LeaderboardBanner'
import PushPrompt from './PushPrompt'
import { useApp } from '../context/AppContext'
import { incrementGamesPlayed } from '../utils/localStorage'
import { tierFor } from '../utils/tiers'
import { track } from '../utils/analytics'
import type { BeatInfo } from './GamePage'
import '../styles/comic.scss'

interface ResultsDialogProps {
  category: string
  correctCount: number
  wrongCount: number
  totalCount: number
  bestStreak: number
  isDaily?: boolean
  beat?: BeatInfo | null
  mode?: string
  onContinue: () => void
  onPlayAgain: () => void
}

function ResultsDialog({ category, correctCount, wrongCount, totalCount, bestStreak, isDaily = false, beat = null, mode = 'single', onContinue, onPlayAgain }: ResultsDialogProps) {
  const { navigate } = useApp()
  const [shareOpen, setShareOpen] = useState(false)
  const tier = tierFor(correctCount, totalCount)

  // Count the finished game once per mount
  const gamesPlayedRef = useRef(0)
  const incrementedRef = useRef(false)
  useEffect(() => {
    if (!incrementedRef.current) {
      incrementedRef.current = true
      gamesPlayedRef.current = incrementGamesPlayed()
    }
  }, [])
  const isFirstGame = gamesPlayedRef.current <= 1
  const poolDate = new Date().toISOString().split('T')[0]

  const beatVerdict = beat
    ? correctCount > beat.score ? `You beat ${beat.name || 'your friend'}! ${correctCount} vs ${beat.score}.`
      : correctCount === beat.score ? `A tie with ${beat.name || 'your friend'}: ${correctCount} each.`
      : `${beat.name || 'Your friend'} wins this one: ${beat.score} vs ${correctCount}.`
    : null

  // "Challenge a friend 1-on-1" opens Party Mode with this category preselected
  const challenge = () => {
    track('challenge_click', { category_name: category, category, mode })
    navigate('/room', `cat=${encodeURIComponent(category)}`)
  }

  return (
    <div className="cp-screen">
      <div className="cp-col cp-summary">
        <div className="cp-topbar">
          <Button variant="yellow" size="round" aria-label="Close and pick another category" onClick={onContinue}>✕</Button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <CategorySticker category={category} small />
            <span className="cp-cat-name" style={{ margin: 0, fontSize: '1.25rem' }}>{category}</span>
          </div>
        </div>

        <div className="cp-badge" role="img" aria-label={`You scored ${correctCount} out of ${totalCount}`}>
          <strong>{correctCount}/{totalCount}</strong>
          <span>Facts spotted</span>
        </div>

        <div>
          <h1 className="cp-h1 cp-h1--white" style={{ fontSize: 'clamp(1.9rem, 9vw, 2.6rem)' }}>{tier.title}</h1>
          <p className="cp-sub cp-muted" style={{ marginTop: 6, fontWeight: 600 }}>{tier.subline}</p>
          {beatVerdict && <p className="cp-sub" style={{ marginTop: 8, color: 'var(--cp-lime)' }} role="status">{beatVerdict}</p>}
        </div>

        <div className="cp-row">
          <div className="cp-stat cp-stat--lime"><strong>{correctCount}</strong><span>Correct</span></div>
          <div className="cp-stat cp-stat--orange"><strong>{wrongCount}</strong><span>Fooled you</span></div>
          <div className="cp-stat cp-stat--white"><strong>{bestStreak}</strong><span>Best streak</span></div>
        </div>

        {isDaily && <LeaderboardBanner score={correctCount} total={totalCount} poolDate={poolDate} />}

        <div className="cp-spacer" />

        <Button variant="orange" block onClick={challenge}>👥&nbsp; Challenge a friend 1-on-1</Button>
        <div className="cp-row">
          <Button variant="white" onClick={() => setShareOpen(true)}>Share score</Button>
          <Button variant="yellow" onClick={onPlayAgain}>Play again</Button>
        </div>
        <button type="button" className="cp-link" onClick={onContinue}>Pick another category</button>

        <PushPrompt />
        {(isFirstGame || isDaily) && <EmailCaptureForm context={isDaily ? 'daily' : 'first-game'} />}
      </div>

      <ShareSheet open={shareOpen} onClose={() => setShareOpen(false)} category={category} score={correctCount} total={totalCount} mode={mode} />
    </div>
  )
}

export default ResultsDialog
