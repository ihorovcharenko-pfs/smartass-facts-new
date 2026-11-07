'use client'

// Gameplay (Comic Pop): question screen → instant reveal with the BS-o-meter → summary.
import { track, type GameMode } from '../utils/analytics'
import { useState, useEffect, useRef } from 'react'
import ResultsDialog from './ResultsDialog'
import SmartassPassModal from './SmartassPassModal'
import Button from './comic/Button'
import Card from './comic/Card'
import Meter from './comic/Meter'
import CategorySticker from './comic/CategorySticker'
import MascotBubble from './comic/MascotBubble'
import { type Fact, playStreak, fetchStreak, logInteractions, submitGameResult, createBattle } from '../services/clientService'
import { decryptAnswer } from '../utils/decryption'
import { bestStreak } from '../utils/tiers'
import { addSkipIds, incrementPoolId, getSessionToken, getSoundEnabled, setSoundEnabled } from '../utils/localStorage'
import { playCorrect, playWrong, warmAudio } from '../utils/sounds'
import '../styles/comic.scss'

export interface BeatInfo { code: string; name: string | null; score: number; total: number }

interface GamePageProps {
  facts: Fact[]
  category: string
  /** Where the game was launched from (home_tile, header_play_now, replay, beat…) — analytics only */
  source?: string
  /** Opened from a /beat/CODE link: shows the "Beat X's 8/10" banner and the verdict at the end */
  beat?: BeatInfo | null
  onBack?: () => void
  onContinue?: () => void
  onPlayAgain?: (category: string) => void
  /** When provided, called instead of showing the summary — caller owns the results screen */
  onGameComplete?: (correctCount: number) => void
}

interface AnswerResult {
  factId: number
  isCorrect: boolean
}

function GamePage({ facts, category, source = 'direct', beat = null, onBack, onContinue, onPlayAgain, onGameComplete }: GamePageProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = facts.length || 10
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null)
  const [factIsReal, setFactIsReal] = useState<boolean | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState<AnswerResult[]>([])
  const [showResultsDialog, setShowResultsDialog] = useState(false)
  const [soundEnabled, setSoundEnabledState] = useState(() => getSoundEnabled())

  const isDaily = category === 'Game of the day'
  const gameMode: GameMode = onGameComplete ? 'battle' : beat ? 'beat' : isDaily ? 'daily' : 'single'
  const completedTrackedRef = useRef(false)

  // Input lock: ~200ms after every answer / card change so a rapid double-tap can't
  // register on the next card (answer → Next, or Next → next card's answer).
  const INPUT_LOCK_MS = 200
  const lockUntilRef = useRef(0)
  const [inputLocked, setInputLocked] = useState(false)
  const lockInput = () => {
    lockUntilRef.current = Date.now() + INPUT_LOCK_MS
    setInputLocked(true)
    setTimeout(() => setInputLocked(false), INPUT_LOCK_MS)
  }

  useEffect(() => { if (soundEnabled) warmAudio() }, [soundEnabled])

  // Pre-decrypt every answer in the background so the first tap reveals instantly.
  useEffect(() => { facts.forEach(f => { decryptAnswer(f.answer) }) }, [facts])

  // One game_start per mounted game (Play again remounts via a new route push).
  useEffect(() => {
    track('game_start', { category_name: category, category, source, mode: gameMode })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Daily-challenge streak bookkeeping (unchanged behaviour)
  const [currentStreak, setCurrentStreak] = useState<number | undefined>(undefined)
  const [streakBroken, setStreakBroken] = useState(false)
  const [streakBeforeBreak, setStreakBeforeBreak] = useState(0)
  const [passAvailable, setPassAvailable] = useState(false)
  const [showPassModal, setShowPassModal] = useState(false)
  const streakPlayedRef = useRef(false)

  useEffect(() => {
    if (!isDaily) return
    fetchStreak(getSessionToken()).then(data => { if (data) setCurrentStreak(data.currentStreak) })
  }, [isDaily])

  const handleSoundToggle = () => {
    const next = !soundEnabled
    setSoundEnabledState(next)
    setSoundEnabled(next)
  }

  const currentFact = facts[currentStep - 1]
  const results = answers.map(a => a.isCorrect)
  const correctCount = results.filter(Boolean).length
  const wrongCount = results.length - correctCount
  // In-game run of correct answers (the "Streak N" chip)
  const runStreak = (() => { let n = 0; for (let i = results.length - 1; i >= 0 && results[i]; i--) n++; return n })()

  const handleBack = () => { onBack?.() }

  const handleAnswer = async (userChoice: boolean) => {
    if (isAnswered || Date.now() < lockUntilRef.current) return
    if (!currentFact) return
    lockInput()
    setUserAnswer(userChoice)
    setIsAnswered(true)

    try {
      const correctAnswer = await decryptAnswer(currentFact.answer)
      const correct = userChoice === correctAnswer
      track('answer', { correct, question_id: currentFact.id, category_name: category, category })
      setIsCorrect(correct)
      setFactIsReal(correctAnswer)
      setAnswers(prev => [...prev, { factId: currentFact.id, isCorrect: correct }])
      setShowResult(true)
      // Sound after the reveal is queued to render, never before it
      if (soundEnabled) setTimeout(() => (correct ? playCorrect() : playWrong()), 0)
    } catch (error) {
      console.error('Error checking answer:', error)
      setIsCorrect(false)
      setAnswers(prev => [...prev, { factId: currentFact.id, isCorrect: false }])
      setShowResult(true)
    }
  }

  const finishGame = () => {
    addSkipIds(category, facts.map(f => f.id))

    if (isDaily) {
      incrementPoolId()
      if (!streakPlayedRef.current) {
        streakPlayedRef.current = true
        const today = new Date().toISOString().split('T')[0]
        playStreak(getSessionToken(), today).then(data => {
          if (data) {
            setCurrentStreak(data.currentStreak)
            if (data.streakBroken && data.passAvailable) {
              setStreakBeforeBreak(currentStreak ?? 0)
              setStreakBroken(true)
              setPassAvailable(true)
            }
          }
        })
      }
    }

    // Personalised-feed signals (fire-and-forget)
    logInteractions(getSessionToken(), answers.map(a => ({ factId: a.factId, wasCorrect: a.isCorrect, category })))

    const finalScore = answers.filter(a => a.isCorrect).length
    if (!completedTrackedRef.current) {
      completedTrackedRef.current = true
      track('game_complete', {
        category_name: category, category, final_score: finalScore, score: finalScore,
        streak_count: bestStreak(results), total: totalSteps,
        percentage: Math.round((finalScore / totalSteps) * 100), mode: gameMode,
      })
      submitGameResult(category, finalScore, totalSteps, gameMode) // logged-in players → period leaderboards
    }

    if (onGameComplete) onGameComplete(finalScore)
    else setShowResultsDialog(true)
  }

  const handleNext = () => {
    if (Date.now() < lockUntilRef.current) return
    lockInput()
    if (currentStep < totalSteps) {
      setIsAnswered(false); setIsCorrect(false); setUserAnswer(null); setFactIsReal(null); setShowResult(false)
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    } else {
      finishGame()
    }
  }

  // "Challenge a friend": async link — the friend plays the SAME 10 facts and tries to beat this score
  const handleChallengeFriend = async (): Promise<string> => {
    const result = await createBattle(category, facts.map(f => f.id), correctCount)
    track('challenge_created', { category_name: category, category, mode: gameMode, final_score: correctCount })
    return `${window.location.origin}/battle/${result.id}`
  }

  const handleContinue = () => { setShowResultsDialog(false); onContinue?.() }

  const handlePlayAgainClick = () => {
    setShowResultsDialog(false)
    setCurrentStep(1); setIsAnswered(false); setIsCorrect(false); setUserAnswer(null); setFactIsReal(null); setShowResult(false)
    setAnswers([])
    completedTrackedRef.current = false
    track('game_replay', { category_name: category, mode: gameMode })
    track('rematch', { same_category: true, mode: gameMode })
    onPlayAgain?.(category)
  }

  // Pass modal after the summary if a daily streak broke
  useEffect(() => {
    if (showResultsDialog && streakBroken && passAvailable) {
      const timer = setTimeout(() => setShowPassModal(true), 800)
      return () => clearTimeout(timer)
    }
  }, [showResultsDialog, streakBroken, passAvailable])

  if (showResultsDialog) {
    return (
      <>
        <ResultsDialog
          category={category}
          correctCount={correctCount}
          wrongCount={wrongCount}
          totalCount={results.length}
          bestStreak={bestStreak(results)}
          isDaily={isDaily}
          beat={beat}
          mode={gameMode}
          onContinue={handleContinue}
          onPlayAgain={handlePlayAgainClick}
          onChallengeFriend={handleChallengeFriend}
        />
        {showPassModal && (
          <SmartassPassModal
            streakBeforeBreak={streakBeforeBreak}
            onSaved={n => { setCurrentStreak(n); setShowPassModal(false); setStreakBroken(false) }}
            onDismiss={() => { setShowPassModal(false); setStreakBroken(false) }}
          />
        )}
      </>
    )
  }

  if (!currentFact) return null

  const headline = isCorrect ? 'NAILED IT!' : 'BUSTED!'
  const said = userAnswer ? 'FACT' : 'FAKE'
  const truth = factIsReal ? 'a FACT' : 'FAKE'
  const subline = isCorrect
    ? `It’s ${truth}. +1 SmartAss point`
    : `You said ${said}. It’s ${factIsReal ? 'a FACT' : 'FAKE'}.`

  const chip = (
    <span className={`cp-chip${showResult ? (isCorrect ? ' cp-chip--lime' : ' cp-chip--dim') : ''}`} aria-live="polite">
      Streak {runStreak}
    </span>
  )

  return (
    <div className="cp-screen">
      <div className="cp-col cp-game">
        <div className="cp-topbar">
          <Button variant="yellow" size="round" aria-label="Back" onClick={handleBack}>←</Button>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {chip}
            <Button variant="white" size="round" aria-label={soundEnabled ? 'Mute sounds' : 'Turn sound on'} aria-pressed={soundEnabled} onClick={handleSoundToggle}>
              <span aria-hidden="true" style={{ fontSize: '1rem' }}>{soundEnabled ? '🔊' : '🔇'}</span>
            </Button>
          </div>
        </div>

        {beat && (
          <Card tone="lime" tilt="r" role="status" style={{ padding: '8px 14px', fontWeight: 900, fontSize: '0.9375rem', textAlign: 'center' }}>
            Beat {beat.name || 'your friend'}&apos;s {beat.score}/{beat.total} in {category}
          </Card>
        )}

        {!showResult ? (
          <>
            <div className="cp-cat-row">
              <CategorySticker category={category} />
              <div className="cp-cat-meta">
                <h1 className="cp-cat-name">{category}</h1>
                <div className="cp-cat-step">Fact {currentStep} of {totalSteps}</div>
                <div className="cp-progress" role="progressbar" aria-valuemin={0} aria-valuemax={totalSteps} aria-valuenow={currentStep - 1} aria-label="Game progress">
                  <div className="cp-progress__fill" style={{ width: `${((currentStep - 1) / totalSteps) * 100}%` }} />
                </div>
              </div>
            </div>

            <MascotBubble label="Real or rubbish?" text={currentFact.saFact} />

            <div className="cp-spacer" />

            <div className="cp-row" style={{ pointerEvents: inputLocked ? 'none' : undefined }}>
              <Button variant="white" size="huge" sub="nice try" onClick={() => handleAnswer(false)}>FAKE</Button>
              <Button variant="yellow" size="huge" sub="for real" onClick={() => handleAnswer(true)}>FACT</Button>
            </div>
          </>
        ) : (
          <>
            <Meter isFact={!!factIsReal} />
            <div>
              <h1 className={`cp-h1 ${isCorrect ? 'cp-h1--yellow' : 'cp-h1--orange'}`} role="status">{headline}</h1>
              <p className="cp-sub">{subline}</p>
            </div>

            <Card tilt="l" className="cp-reveal-card">
              {factIsReal ? (
                <>
                  <span className="cp-reveal-card__label">Meanwhile, in {category}</span>
                  <p className="cp-reveal-card__text">{currentFact.explanation?.trim() || 'Yep, that one’s real.'}</p>
                </>
              ) : (
                <>
                  <p className="cp-reveal-card__struck">{currentFact.saFact}</p>
                  <p className="cp-reveal-card__fake">It&apos;s not a real fact, it&apos;s just our fantasy. Now you know 🐒</p>
                </>
              )}
            </Card>

            <div className="cp-spacer" />

            <Button variant="yellow" block style={{ pointerEvents: inputLocked ? 'none' : undefined }} onClick={handleNext}>
              {currentStep === totalSteps ? 'SEE RESULTS' : 'NEXT FACT'}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default GamePage
