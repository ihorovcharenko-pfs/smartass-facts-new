'use client'

import backarrowIcon from '../assets/back_arrow.svg'
import '../styles/Game.scss'
import '../styles/Streak.scss'

interface GameHeaderProps {
  currentStep: number
  totalSteps: number
  category: string
  currentStreak?: number
  soundEnabled: boolean
  onSoundToggle: () => void
  onBack?: () => void
}

function GameHeader({ currentStep, totalSteps, onBack, category, currentStreak, soundEnabled, onSoundToggle }: GameHeaderProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="game__header">
      <button
        className="game__back-button"
        onClick={onBack}
        aria-label="Back"
      >
        <img
          src={backarrowIcon.src}
          alt="Back"
          className="game__back-icon"
        />
      </button>
      <div className="game__category-name">
        {category}
      </div>

      <div className="game__header-right">
        {currentStreak !== undefined && currentStreak > 0 && (
          <div className="streak-display" title={`${currentStreak}-day streak`}>
            🔥 {currentStreak}
          </div>
        )}
        <button
          className="game__sound-toggle"
          onClick={onSoundToggle}
          aria-label={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
          title={soundEnabled ? 'Mute' : 'Sound on'}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>

      <div className="game__progress-container">
        <div className="game__progress-bar">
          <div
            className="game__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="game__step-counter">
          {currentStep}/{totalSteps}
        </div>
      </div>

    </div>
  )
}

export default GameHeader
