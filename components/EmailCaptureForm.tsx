'use client'

import { useState } from 'react'
import { subscribeEmail } from '../services/clientService'
import '../styles/EmailCapture.scss'

interface EmailCaptureFormProps {
  context?: 'first-game' | 'daily'
}

function EmailCaptureForm({ context = 'first-game' }: EmailCaptureFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    const result = await subscribeEmail(email.trim())
    if (result.success) {
      setStatus('success')
    } else {
      setStatus('error')
      setErrorMsg(result.error || 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className="email-capture email-capture--success">
        <span className="email-capture__check">✅</span>
        <span>You're in! We'll remind you tomorrow.</span>
      </div>
    )
  }

  return (
    <div className="email-capture">
      <p className="email-capture__label">
        {context === 'daily'
          ? '📬 Get tomorrow\'s Daily Challenge in your inbox'
          : '🔥 Start a streak — get a daily reminder'}
      </p>
      <form className="email-capture__form" onSubmit={handleSubmit}>
        <input
          type="email"
          className="email-capture__input"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={status === 'loading'}
          required
        />
        <button
          type="submit"
          className="email-capture__button"
          disabled={status === 'loading' || !email.trim()}
        >
          {status === 'loading' ? '…' : 'Remind me'}
        </button>
      </form>
      {status === 'error' && (
        <p className="email-capture__error">{errorMsg}</p>
      )}
    </div>
  )
}

export default EmailCaptureForm
