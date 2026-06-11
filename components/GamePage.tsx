'use client'

import { useState, useEffect, useRef } from 'react'
import GameHeader from './GameHeader'
import Footer from './Footer'
import ResultsDialog from './ResultsDialog'
import SmartassPassModal from './SmartassPassModal'
import { type Fact, playStreak, fetchStreak, createBattle, logInteractions } from '../services/clientService'
import checkWhiteIcon from '../assets/check_white.svg'
import xWhiteIcon from '../assets/x_white.svg'
import arrowRightWhiteIcon from '../assets/arrow_right_white.svg'
import { decryptAnswer } from '../utils/decryption'
import { addSkipIds, incrementPoolId, getSessionToken, getSoundEnabled, setSoundEnabled } from '../utils/localStorage'
import { playCorrect, playWrong } from '../utils/sounds'
import '../styles/Game.scss'

interface GamePageProps {
  facts: Fact[]
  category: string
  onBack?: () => void
  onContinue?: () => void
  onPlayAgain?: (category: string) => void
  /** When provided, called instead of showing ResultsDialog — caller owns the results screen */
  onGameComplete?: (correctCount: number) => void
}

interface AnswerResult {
  factId: number
  isCorrect: boolean
}

function GamePage({ facts, category, onBack, onContinue, onPlayAgain, onGameComplete }: GamePageProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = facts.length || 10
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null)
  const [factIsReal, setFactIsReal] = useState<boolean | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState<AnswerResult[]>([])
  const [showResultsDialog, setShowResultsDialog] = useState(false)
  // explanation always visible after answer — no "tell me more" step
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [resultDragOffset, setResultDragOffset] = useState(0)
  const [resultIsDragging, setResultIsDragging] = useState(false)
  const dragStartXRef = useRef(0)
  const isDraggingRef = useRef(false)
  const dragOffsetRef = useRef(0)
  const resultDragStartXRef = useRef(0)
  const resultDraggingRef = useRef(false)
  const resultDragOffsetRef = useRef(0)
  const swipeTargetRef = useRef<'question' | 'result' | null>(null)

  // Sound state
  const [soundEnabled, setSoundEnabledState] = useState(() => getSoundEnabled())

  // Streak state (only for Daily Challenge)
  const isDaily = category === 'Game of the day'
  const [currentStreak, setCurrentStreak] = useState<number | undefined>(undefined)
  const [streakBroken, setStreakBroken] = useState(false)
  const [streakBeforeBreak, setStreakBeforeBreak] = useState(0)
  const [passAvailable, setPassAvailable] = useState(false)
  const [showPassModal, setShowPassModal] = useState(false)
  const streakPlayedRef = useRef(false)

  // Load streak on mount for daily challenge
  useEffect(() => {
    if (!isDaily) return
    const token = getSessionToken()
    fetchStreak(token).then(data => {
      if (data) setCurrentStreak(data.currentStreak)
    })
  }, [isDaily])

  const handleSoundToggle = () => {
    const next = !soundEnabled
    setSoundEnabledState(next)
    setSoundEnabled(next)
  }

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 499px)')
    const update = () => setIsSmallScreen(mq.matches)
    update()
    mq.addEventListener('change', update)
    if (mq.matches) {
      document.body.classList.add('no-scroll');
    }
    return () => {
      mq.removeEventListener('change', update)
      if (mq.matches) {
        document.body.classList.remove('no-scroll');
      }
    }
  }, [])

  const SWIPE_THRESHOLD = 80

  const handleSwipeStart = (clientX: number) => {
    if (isAnswered) return
    swipeTargetRef.current = 'question'
    isDraggingRef.current = true
    setIsDragging(true)
    dragStartXRef.current = clientX
  }

  const MAX_DRAG = 120

  const handleSwipeMove = (clientX: number) => {
    if (isAnswered || !isDraggingRef.current) return
    const raw = clientX - dragStartXRef.current
    const offset = Math.max(-MAX_DRAG, Math.min(MAX_DRAG, raw))
    dragOffsetRef.current = offset
    setDragOffset(offset)
  }

  const handleSwipeEnd = () => {
    if (!isDraggingRef.current) return
    const offset = dragOffsetRef.current
    isDraggingRef.current = false
    setIsDragging(false)
    setDragOffset(0)
    swipeTargetRef.current = null
    if (isAnswered) return
    if (offset > SWIPE_THRESHOLD) {
      handleAnswer(false) // right = Fake
    } else if (offset < -SWIPE_THRESHOLD) {
      handleAnswer(true) // left = Fact
    }
  }

  const handleResultSwipeStart = (clientX: number) => {
    swipeTargetRef.current = 'result'
    resultDraggingRef.current = true
    setResultIsDragging(true)
    resultDragStartXRef.current = clientX
  }

  const handleResultSwipeMove = (clientX: number) => {
    if (!resultDraggingRef.current) return
    const raw = clientX - resultDragStartXRef.current
    const offset = Math.max(-MAX_DRAG, Math.min(MAX_DRAG, raw))
    resultDragOffsetRef.current = offset
    setResultDragOffset(offset)
  }

  const handleResultSwipeEnd = (touchEvent?: React.TouchEvent) => {
    if (!resultDraggingRef.current) return
    const offset = resultDragOffsetRef.current
    resultDraggingRef.current = false
    setResultIsDragging(false)
    setResultDragOffset(0)
    swipeTargetRef.current = null
    if (Math.abs(offset) > SWIPE_THRESHOLD) {
      touchEvent?.preventDefault?.()
      handleNext()
    }
  }

  useEffect(() => {
    if (!isSmallScreen) return
    const onMouseMove = (e: MouseEvent) => {
      if (swipeTargetRef.current === 'question') handleSwipeMove(e.clientX)
      else if (swipeTargetRef.current === 'result') handleResultSwipeMove(e.clientX)
    }
    const onMouseUp = () => {
      if (swipeTargetRef.current === 'question') handleSwipeEnd()
      else if (swipeTargetRef.current === 'result') handleResultSwipeEnd()
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [isSmallScreen])

  const handleBack = () => {
    onBack?.()
  }

  const handleAnswer = async (userChoice: boolean) => {
    if (isAnswered) return

    const currentFact = facts[currentStep - 1]
    if (!currentFact) return

    setUserAnswer(userChoice)
    setIsAnswered(true)

    try {
      const correctAnswer = await decryptAnswer(currentFact.answer)
      const correct = userChoice === correctAnswer
      setIsCorrect(correct)
      setFactIsReal(correctAnswer) // true = real fact, false = fake fact

      // Play sound
      if (soundEnabled) {
        if (correct) playCorrect()
        else playWrong()
      }

      setAnswers(prev => [...prev, { factId: currentFact.id, isCorrect: correct }])

      setTimeout(() => {
        setShowResult(true)
      }, 300)
    } catch (error) {
      console.error('Error checking answer:', error)
      setIsCorrect(false)
      setAnswers(prev => [...prev, { factId: currentFact.id, isCorrect: false }])
      setTimeout(() => {
        setShowResult(true)
      }, 300)
    }
  }

  const handleNext = () => {
    setCurrentStep((prev) => {
      if (prev < totalSteps) {
        setIsAnswered(false)
        setIsCorrect(false)
        setUserAnswer(null)
        setFactIsReal(null)
        setShowResult(false)
        return prev + 1
      } else {
        const factIds = facts.map(fact => fact.id)
        addSkipIds(category, factIds)

        if (isDaily) {
          incrementPoolId()
          // Update streak
          if (!streakPlayedRef.current) {
            streakPlayedRef.current = true
            const today = new Date().toISOString().split('T')[0]
            const token = getSessionToken()
            playStreak(token, today).then(data => {
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

        // Log interactions for personalised feed (fire-and-forget, non-critical)
        // answers already contains all answers by the time the user taps Finish
        logInteractions(
          getSessionToken(),
          answers.map(a => ({ factId: a.factId, wasCorrect: a.isCorrect, category }))
        )

        // In battle mode the caller owns the results screen
        if (onGameComplete) {
          const finalCorrect = answers.filter(a => a.isCorrect).length
          onGameComplete(finalCorrect)
        } else {
          setShowResultsDialog(true)
        }
        return prev
      }
    });
  }

  const handleContinue = () => {
    setShowResultsDialog(false)
    onContinue?.()
  }

  const handlePlayAgainClick = () => {
    setShowResultsDialog(false)
    setCurrentStep(1)
    setIsAnswered(false)
    setIsCorrect(false)
    setUserAnswer(null)
    setFactIsReal(null)
    setShowResult(false)
    setAnswers([])
    onPlayAgain?.(category)
  }

  // Create a battle session from the current game for the "Challenge a friend" flow
  const handleChallengeFriend = async (): Promise<string> => {
    const factIds = facts.map(f => f.id)
    const result = await createBattle(category, factIds, correctCount)
    return `${window.location.origin}/battle/${result.id}`
  }

  const handlePassSaved = (newStreak: number) => {
    setCurrentStreak(newStreak)
    setShowPassModal(false)
    setStreakBroken(false)
  }

  const handlePassDismiss = () => {
    setShowPassModal(false)
    setStreakBroken(false)
  }

  // Show pass modal after results dialog if streak broke
  useEffect(() => {
    if (showResultsDialog && streakBroken && passAvailable) {
      const timer = setTimeout(() => setShowPassModal(true), 800)
      return () => clearTimeout(timer)
    }
  }, [showResultsDialog, streakBroken, passAvailable])

  const getResultsMessage = (percentage: number): string => {
    if (percentage >= 90) return 'You guessed faster than Monet could finish a sunrise. Critics would still argue... but we say: masterpiece!'
    if (percentage >= 70) return 'You\'re on the right track! A few more rounds and you\'ll be a fact master.'
    if (percentage >= 50) return 'Not bad! Keep going and you\'ll improve with each round.'
    return 'Every expert was once a beginner. Keep playing to sharpen your fact-checking skills!'
  }

  const currentFact = facts[currentStep - 1]
  const correctCount = answers.filter(a => a.isCorrect).length
  const wrongCount = answers.filter(a => !a.isCorrect).length
  const totalAnswered = answers.length
  const percentage = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0

  if (showResultsDialog) {
    return (
      <>
        <ResultsDialog
          correctCount={correctCount}
          wrongCount={wrongCount}
          totalCount={totalAnswered}
          title={category}
          message={getResultsMessage(percentage)}
          isDaily={isDaily}
          onContinue={handleContinue}
          onPlayAgain={handlePlayAgainClick}
          onChallengeFriend={onGameComplete ? undefined : handleChallengeFriend}
        />
        {showPassModal && (
          <SmartassPassModal
            streakBeforeBreak={streakBeforeBreak}
            onSaved={handlePassSaved}
            onDismiss={handlePassDismiss}
          />
        )}
      </>
    )
  }

  return (
    <div className="game">
      <GameHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBack={handleBack}
        category={category}
        currentStreak={isDaily ? currentStreak : undefined}
        soundEnabled={soundEnabled}
        onSoundToggle={handleSoundToggle}
      />
      {currentFact && (
        <div className="game__content">
          {!showResult ? (
            <div
              className={`game__fact-card-wrapper ${isSmallScreen ? 'game__fact-card-wrapper--swipe' : ''}`}
              onTouchStart={e => isSmallScreen && handleSwipeStart(e.touches[0].clientX)}
              onTouchMove={e => {
                if (isSmallScreen && isDraggingRef.current && e.touches[0]) {
                  e.preventDefault()
                  handleSwipeMove(e.touches[0].clientX)
                }
              }}
              onTouchEnd={() => isSmallScreen && handleSwipeEnd()}
              onMouseDown={e => isSmallScreen && e.button === 0 && handleSwipeStart(e.clientX)}
            >
              {isSmallScreen && (
                <>
                  <div className={`game__swipe-hint game__swipe-hint--left ${dragOffset < -30 ? 'game__swipe-hint--visible' : ''}`}>Fact</div>
                  <div className={`game__swipe-hint game__swipe-hint--right ${dragOffset > 30 ? 'game__swipe-hint--visible' : ''}`}>Fake</div>
                </>
              )}
              <div
                className={`game__fact-card ${isAnswered ? 'game__fact-card--answered' : ''} ${isSmallScreen ? 'game__fact-card--swipe' : ''} ${isSmallScreen && isDragging ? 'game__fact-card--dragging' : ''}`}
                style={isSmallScreen ? { transform: `translateX(${dragOffset}px)` } : undefined}
              >
                <h2 className="game__fact-question">Is this fact true?</h2>
                <p className="game__fact-text">{currentFact.saFact}</p>
                <div className="game__fact-buttons">
                  <button
                    className={`game__fact-button game__fact-button--fact ${isAnswered && userAnswer === true ? 'game__fact-button--selected' : ''} ${isAnswered ? 'game__fact-button--disabled' : ''}`}
                    onClick={() => handleAnswer(true)}
                    disabled={isAnswered}
                  >
                    <span className="game__fact-button-text">Fact</span>
                    <img src={checkWhiteIcon.src} alt="Check" className="game__fact-button-icon" />
                  </button>
                  <button
                    className={`game__fact-button game__fact-button--fake ${isAnswered && userAnswer === false ? 'game__fact-button--selected' : ''} ${isAnswered ? 'game__fact-button--disabled' : ''}`}
                    onClick={() => handleAnswer(false)}
                    disabled={isAnswered}
                  >
                    <span className="game__fact-button-text">Fake</span>
                    <img src={xWhiteIcon.src} alt="X" className="game__fact-button-icon" />
                  </button>
                </div>
                {isSmallScreen && (
                  <p className="game__swipe-instruction">Swipe left for Fact, right for Fake</p>
                )}
              </div>
            </div>
          ) : (
            <div
              className={`game__fact-card-wrapper ${isSmallScreen ? 'game__fact-card-wrapper--swipe' : ''}`}
              onTouchStart={e => isSmallScreen && handleResultSwipeStart(e.touches[0].clientX)}
              onTouchMove={e => {
                if (isSmallScreen && resultDraggingRef.current && e.touches[0]) {
                  e.preventDefault()
                  handleResultSwipeMove(e.touches[0].clientX)
                }
              }}
              onTouchEnd={e => isSmallScreen && handleResultSwipeEnd(e)}
              onMouseDown={e => isSmallScreen && e.button === 0 && handleResultSwipeStart(e.clientX)}
            >
              <div
                className={`game__fact-card game__fact-card--${isCorrect ? 'success' : 'error'} ${isSmallScreen ? 'game__fact-card--swipe' : ''} ${isSmallScreen && resultIsDragging ? 'game__fact-card--dragging' : ''}`}
                style={isSmallScreen ? { transform: `translateX(${resultDragOffset}px)` } : undefined}
              >
                <h2 className="game__fact-question">
                  {isCorrect ? "That's Right!" : "Wrong!"}
                </h2>
                <p className="game__fact-explanation">
                  {factIsReal
                    ? (currentFact.explanation?.trim() || '')
                    : isCorrect
                      ? "Great job on spotting the fake!"
                      : "It's not a real fact, it's just our fantasy. Now you know 🐒"}
                </p>
                <div className="game__fact-buttons">
                  <button
                    className="game__fact-button game__fact-button--next"
                    onClick={handleNext}
                  >
                    <span className="game__fact-button-text">{currentStep === totalSteps ? 'Finish' : 'Next'}</span>
                    {currentStep !== totalSteps && (
                      <img src={arrowRightWhiteIcon.src} alt="Next" className="game__fact-button-icon" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {!isSmallScreen && (<Footer />)}

    </div>
  )
}

export default GamePage
