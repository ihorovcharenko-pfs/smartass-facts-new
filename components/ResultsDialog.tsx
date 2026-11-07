'use client'

// Summary (end of a solo game): score badge, verdict, stat chips, challenge / share / replay.
import { useEffect, useRef, useState } from 'react'
import Button from './comic/Button'
import CategorySticker from './comic/CategorySticker'
import ShareSheet from './comic/ShareSheet'
import EmailCaptureForm from './EmailCaptureForm'
import LeaderboardBanner from './LeaderboardBanner'
import PushPrompt from './PushPrompt'
import { useAuth } from '../context/AuthContext'
import { submitGameResult } from '../services/clientService'
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
  /** Async "Challenge a friend" link (same 10 facts). Returns the battle URL. */
  onChallengeFriend?: () => Promise<string>
}

function ResultsDialog({ category, correctCount, wrongCount, totalCount, bestStreak, isDaily = false, beat = null, mode = 'single', onContinue, onPlayAgain, onChallengeFriend }: ResultsDialogProps) {
  const { user, openAuthModal } = useAuth()
  const [shareOpen, setShareOpen] = useState(false)
  const [challengeState, setChallengeState] = useState<'idle' | 'loading' | 'copied'>('idle')
  const signedInAtMount = useRef(!!user)
  const savedRef = useRef(false)

  // Signed up / signed in right here on the summary → save THIS game to the leaderboard too
  useEffect(() => {
    if (user && !signedInAtMount.current && !savedRef.current) {
      savedRef.current = true
      submitGameResult(category, correctCount, totalCount, mode)
    }
  }, [user, category, correctCount, totalCount, mode])
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

  const challengeLink = async () => {
    if (!onChallengeFriend) return
    track('challenge_click', { category_name: category, category, mode })
    setChallengeState('loading')
    try {
      const url = await onChallengeFriend()
      const text = `I scored ${correctCount}/${totalCount} on "${category}". Can you beat me? ${url} 🧠`
      if (navigator.share) await navigator.share({ text })
      else await navigator.clipboard.writeText(url)
      setChallengeState('copied')
      setTimeout(() => setChallengeState('idle'), 3000)
    } catch {
      setChallengeState('idle')
    }
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

        {onChallengeFriend && (
          <Button variant="orange" block disabled={challengeState === 'loading'} onClick={challengeLink}>
            {challengeState === 'loading' ? '⏳ Creating challenge…' : challengeState === 'copied' ? '✓ Link copied!' : '⚔️ Challenge a friend'}
          </Button>
        )}
        <div className="cp-row">
          <Button variant="white" onClick={() => setShareOpen(true)}>Share score</Button>
          <Button variant="yellow" onClick={onPlayAgain}>Play again</Button>
        </div>
        <button type="button" className="cp-link" onClick={onContinue}>Pick another category</button>

        {!user && (
          <div className="cp-card cp-card--lime" role="region" aria-label="Join the leaderboard">
            <strong style={{ display: 'block', fontSize: '1.125rem', fontWeight: 900 }}>
              {isFirstGame ? 'Nice first game! Sign up now to join the leaderboard.' : 'Sign up to join the leaderboard.'}
            </strong>
            <p style={{ margin: '4px 0 12px', fontWeight: 600 }}>Free account. Your score from this game gets saved.</p>
            <Button variant="yellow" block onClick={() => { track('signup_prompt_click', { category_name: category, first_game: isFirstGame }); openAuthModal('register') }}>Sign up and join the board</Button>
          </div>
        )}

        <PushPrompt />
        {(isFirstGame || isDaily) && <EmailCaptureForm context={isDaily ? 'daily' : 'first-game'} />}
      </div>

      <ShareSheet open={shareOpen} onClose={() => setShareOpen(false)} category={category} score={correctCount} total={totalCount} mode={mode} />
    </div>
  )
}

export default ResultsDialog
