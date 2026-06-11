'use client'

import { useState } from 'react'
import '../styles/Game.scss'

interface GameProps {
    totalSteps?: number
    initialStep?: number
    onBack?: () => void
}

function Game({ totalSteps = 10, initialStep = 1, onBack }: GameProps) {
    const [currentStep, setCurrentStep] = useState(initialStep)

    const progress = (currentStep / totalSteps) * 100

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        } else if (onBack) {
            onBack()
        }
    }

    return (
        <div className="game">
            <div className="game__header">
                <button
                    className="game__back-button"
                    onClick={handleBack}
                    aria-label="Back"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M10 12L6 8L10 4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                <div className="game__progress-container">
                    <div className="game__progress-bar">
                        <div
                            className="game__progress-fill"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="game__step-counter">
                    {currentStep}/{totalSteps}
                </div>
            </div>
        </div>
    )
}

export default Game
