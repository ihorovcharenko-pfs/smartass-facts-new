'use client'

import { useState, useEffect } from 'react'
import { fetchCategories, type Category } from '../services/clientService'
import CategoryChip from './CategoryChip'
import '../styles/Onboarding.scss'

interface OnboardingModalProps {
  onComplete: (favouriteIds: number[]) => void
}

function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(1)
  const [categories, setCategories] = useState<Category[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (step === 2) {
      setLoading(true)
      fetchCategories()
        .then(cats => {
          const filtered = cats.filter(
            cat =>
              cat.saCategory.toLowerCase() !== 'game of the day' &&
              cat.category.toLowerCase() !== 'game of the day'
          )
          setCategories(filtered)
        })
        .catch(() => setCategories([]))
        .finally(() => setLoading(false))
    }
  }, [step])

  const toggleCategory = (id: number) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        {step === 1 && (
          <div className="onboarding-step">
            <div className="onboarding-emoji">🧠</div>
            <h1 className="onboarding-title">
              Welcome to<br />Smartass Facts
            </h1>
            <p className="onboarding-subtitle">
              Can you tell Fact from Fake? 10 questions per round — swipe or tap to guess.
            </p>
            <div className="onboarding-how">
              <div className="onboarding-how__item">
                <span className="onboarding-how__icon onboarding-how__icon--fact">✓</span>
                <span>Tap <strong>Fact</strong> if you believe it</span>
              </div>
              <div className="onboarding-how__item">
                <span className="onboarding-how__icon onboarding-how__icon--fake">✕</span>
                <span>Tap <strong>Fake</strong> if it sounds made up</span>
              </div>
              <div className="onboarding-how__item">
                <span className="onboarding-how__icon onboarding-how__icon--streak">🔥</span>
                <span>Play the Daily Challenge to build a streak</span>
              </div>
            </div>
            <button className="onboarding-cta" onClick={() => setStep(2)}>
              Let's go →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-step">
            <h2 className="onboarding-title onboarding-title--sm">Pick your favourite topics</h2>
            <p className="onboarding-subtitle">
              They'll appear first in your menu. Pick as many as you like.
            </p>

            {loading ? (
              <div className="onboarding-loading">
                <span className="onboarding-loading__dot" />
                <span className="onboarding-loading__dot" />
                <span className="onboarding-loading__dot" />
              </div>
            ) : (
              <div className="onboarding-chips">
                {categories.map(cat => (
                  <CategoryChip
                    key={cat.id}
                    label={cat.saCategory}
                    selected={selected.includes(cat.id)}
                    onClick={() => toggleCategory(cat.id)}
                  />
                ))}
              </div>
            )}

            <div className="onboarding-footer">
              {selected.length > 0 && (
                <p className="onboarding-selected-count">
                  {selected.length} selected
                </p>
              )}
              <button
                className="onboarding-cta"
                onClick={() => onComplete(selected)}
              >
                {selected.length === 0 ? 'Skip & Start Playing' : 'Start Playing →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OnboardingModal
