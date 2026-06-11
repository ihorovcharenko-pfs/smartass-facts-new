'use client'

import { useState } from 'react'
import { useSmartassPass } from '../services/clientService'
import { getSessionToken } from '../utils/localStorage'
import '../styles/Streak.scss'

interface SmartassPassModalProps {
  streakBeforeBreak: number
  onSaved: (newStreak: number) => void
  onDismiss: () => void
}

function SmartassPassModal({ streakBeforeBreak, onSaved, onDismiss }: SmartassPassModalProps) {
  const [loading, setLoading] = useState(false)
  const [used, setUsed] = useState(false)

  const handleUsePass = async () => {
    setLoading(true)
    const token = getSessionToken()
    const result = await useSmartassPass(token)
    setLoading(false)
    if (result) {
      setUsed(true)
      setTimeout(() => onSaved(result.currentStreak), 1200)
    }
  }

  return (
    <div className="pass-overlay">
      <div className="pass-modal">
        {used ? (
          <div className="pass-modal__saved">
            <div className="pass-modal__flame">🔥</div>
            <h3 className="pass-modal__title">Streak saved!</h3>
            <p className="pass-modal__subtitle">Your {streakBeforeBreak}-day streak lives on.</p>
          </div>
        ) : (
          <>
            <div className="pass-modal__flame">💔</div>
            <h3 className="pass-modal__title">Streak at risk!</h3>
            <p className="pass-modal__subtitle">
              Your <strong>{streakBeforeBreak}-day streak</strong> is about to break.
              Use your Smartass Pass to save it?
            </p>
            <p className="pass-modal__note">You get one free pass per day.</p>
            <div className="pass-modal__buttons">
              <button
                className="pass-modal__btn pass-modal__btn--save"
                onClick={handleUsePass}
                disabled={loading}
              >
                {loading ? 'Saving…' : '🛡️ Use My Pass'}
              </button>
              <button
                className="pass-modal__btn pass-modal__btn--dismiss"
                onClick={onDismiss}
                disabled={loading}
              >
                Let it go
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SmartassPassModal
