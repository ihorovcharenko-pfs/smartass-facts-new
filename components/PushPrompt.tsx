'use client'

import { useState, useEffect } from 'react'
import {
  isPushSupported,
  isPushSeen,
  getPermission,
  subscribeToPush,
  markPushDismissed,
} from '../utils/pushSubscription'
import '../styles/PushPrompt.scss'

/**
 * A small card shown in the results dialog inviting the user to enable
 * daily push notifications. Hides itself once the user has subscribed or
 * dismissed, and never shows if notifications are already granted/denied.
 */
function PushPrompt() {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [isIos, setIsIos] = useState(false)

  useEffect(() => {
    if (!isPushSupported()) return
    if (isPushSeen()) return
    if (getPermission() === 'denied') return
    if (getPermission() === 'granted') {
      // Already granted — re-subscribe silently to ensure endpoint is fresh
      subscribeToPush()
      return
    }

    // Detect iOS (needs "Add to Home Screen" for push to work)
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    setIsIos(ios)
    setVisible(true)
  }, [])

  if (!visible) return null

  const handleAllow = async () => {
    setLoading(true)
    const ok = await subscribeToPush()
    setLoading(false)
    if (ok) {
      setDone(true)
      setTimeout(() => setVisible(false), 2500)
    } else {
      // Permission denied or error — dismiss silently
      markPushDismissed()
      setVisible(false)
    }
  }

  const handleDismiss = () => {
    markPushDismissed()
    setVisible(false)
  }

  return (
    <div className="push-prompt">
      <span className="push-prompt__icon">🔔</span>
      <div className="push-prompt__body">
        <p className="push-prompt__title">Daily Smartass Fact</p>
        <p className="push-prompt__sub">
          Get a teaser fact every evening. One question, sent straight to your device.
        </p>

        {isIos && (
          <p className="push-prompt__ios-note">
            On iPhone, tap the Share icon and "Add to Home Screen" first — then come back and tap Notify me.
          </p>
        )}

        {done ? (
          <p className="push-prompt__status">✓ You're in! See you tomorrow.</p>
        ) : (
          <div className="push-prompt__actions">
            <button
              className="push-prompt__btn push-prompt__btn--primary"
              onClick={handleAllow}
              disabled={loading}
            >
              {loading ? 'Enabling…' : 'Notify me'}
            </button>
            <button
              className="push-prompt__btn push-prompt__btn--ghost"
              onClick={handleDismiss}
            >
              Not now
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PushPrompt
