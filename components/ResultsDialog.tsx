'use client'

import finishMonkeyIcon from '../assets/finish_monkey.svg'
import Footer from './Footer'
import ShareCard from './ShareCard'
import EmailCaptureForm from './EmailCaptureForm'
import LeaderboardBanner from './LeaderboardBanner'
import PushPrompt from './PushPrompt'
import { incrementGamesPlayed } from '../utils/localStorage'
import { useEffect, useRef, useState } from 'react'
import '../styles/ResultsDialog.scss'
import '../styles/Battle.scss'

interface ResultsDialogProps {
  correctCount: number
  wrongCount: number
  totalCount: number
  title: string
  message: string
  isDaily?: boolean
  onContinue: () => void
  onPlayAgain: () => void
  /** When provided, a "Challenge a friend" button is shown. Returns the battle URL. */
  onChallengeFriend?: () => Promise<string>
}

function ResultsDialog({
  title,
  correctCount,
  wrongCount,
  totalCount,
  message,
  isDaily = false,
  onContinue,
  onPlayAgain,
  onChallengeFriend,
}: ResultsDialogProps) {
  const [challengeState, setChallengeState] = useState<'idle' | 'loading' | 'copied'>('idle')
  const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0
  const totalSegments = 25
  const filledSegments = Math.round((percentage / 100) * totalSegments)

  // Track games played — increment once per mount
  const gamesPlayedRef = useRef<number>(0)
  const incrementedRef = useRef(false)
  useEffect(() => {
    if (!incrementedRef.current) {
      incrementedRef.current = true
      gamesPlayedRef.current = incrementGamesPlayed()
    }
  }, [])

  const isFirstGame = gamesPlayedRef.current <= 1

  // Today's pool date for the leaderboard banner
  const poolDate = new Date().toISOString().split('T')[0]

  const segments = Array.from({ length: totalSegments }, (_, i) => ({
    index: i,
    isFilled: i < filledSegments,
  }))

  return (
    <div className="results-screen">
      <div className="results-screen__content">
        <div className="results-screen__icon">
          <img src={finishMonkeyIcon.src} alt="Finish" />
        </div>

        <h2 className="results-screen__title">{title}</h2>

        <p className="results-screen__message">{message}</p>

        <div className="results-screen__stats">
          <div className="results-screen__progress">
            <div className="results-screen__progress-ring">
              {segments.map((segment) => {
                const segmentAngle = 360 / totalSegments
                const gapAngle = segmentAngle * 0.3
                const angle = (segment.index * segmentAngle) + (gapAngle / 2)
                return (
                  <div
                    key={segment.index}
                    className={`results-screen__progress-segment ${segment.isFilled ? 'results-screen__progress-segment--filled' : 'results-screen__progress-segment--empty'
                      }`}
                    style={{
                      transform: `rotate(${angle}deg)`,
                    }}
                  />
                )
              })}
            </div>
            <div className="results-screen__percentage">{percentage}%</div>
          </div>

          <div className="results-screen__facts">
            <div className="results-screen__fact-item">
              <div className="results-screen__fact-dot results-screen__fact-dot--correct"></div>
              <span className="results-screen__fact-label">Correct facts</span>
              <span className="results-screen__fact-count">{correctCount}</span>
            </div>
            <div className="results-screen__fact-item">
              <div className="results-screen__fact-dot results-screen__fact-dot--wrong"></div>
              <span className="results-screen__fact-label">Wrong facts</span>
              <span className="results-screen__fact-count">{wrongCount}</span>
            </div>
          </div>
        </div>

        {/* Daily Challenge leaderboard rank */}
        {isDaily && (
          <LeaderboardBanner
            score={correctCount}
            total={totalCount}
            poolDate={poolDate}
          />
        )}

        {/* Share button — always shown */}
        <ShareCard
          score={correctCount}
          total={totalCount}
          category={title}
        />

        {/* Challenge a friend — shown when onChallengeFriend is provided */}
        {onChallengeFriend && (
          <button
            className={`challenge-btn ${challengeState === 'copied' ? 'challenge-btn--copied' : ''}`}
            disabled={challengeState === 'loading'}
            onClick={async () => {
              setChallengeState('loading')
              try {
                const url = await onChallengeFriend()
                const text = `I scored ${correctCount}/${totalCount} on "${title}" — can you beat me? ${url} 🧠`
                if (navigator.share) {
                  await navigator.share({ text })
                } else {
                  await navigator.clipboard.writeText(url)
                }
                setChallengeState('copied')
                setTimeout(() => setChallengeState('idle'), 3000)
              } catch {
                setChallengeState('idle')
              }
            }}
          >
            {challengeState === 'loading' && '⏳ Creating challenge…'}
            {challengeState === 'copied' && '✓ Link copied!'}
            {challengeState === 'idle' && '⚔️ Challenge a friend'}
          </button>
        )}

        {/* Push notifications prompt */}
        <PushPrompt />

        {/* Email capture — first game or daily challenge */}
        {(isFirstGame || isDaily) && (
          <EmailCaptureForm context={isDaily ? 'daily' : 'first-game'} />
        )}

        {/* Cross-promo CTA */}
        {!isDaily && (
          <p className="results-screen__cta">
            🎯 Try today's <button className="results-screen__cta-link" onClick={onContinue}>Daily Challenge</button>
          </p>
        )}
        {isDaily && (
          <p className="results-screen__cta">
            🗂️ <button className="results-screen__cta-link" onClick={onContinue}>Explore more categories</button>
          </p>
        )}

        <div className="results-screen__buttons">
          <button
            className="results-screen__button results-screen__button--primary"
            onClick={onContinue}
          >
            Continue
          </button>
          <button
            className="results-screen__button results-screen__button--secondary"
            onClick={onPlayAgain}
          >
            Play again
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ResultsDialog
