'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { googleSignIn } from '../services/clientService'
import '../styles/AuthModal.scss'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: object) => void
          prompt: () => void
        }
      }
    }
  }
}

const GOOGLE_CLIENT_ID = '156699458595-d0og7vverfbilmpo865gr34ch1av0rmr.apps.googleusercontent.com'

function AuthModal() {
  const { showAuthModal, authModalTab, closeAuthModal, login, register, setUserFromAuth } = useAuth()
  const [tab, setTab] = useState<'login' | 'register'>(authModalTab)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  // Login fields
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register fields
  const [regEmail, setRegEmail] = useState('')
  const [regUsername, setRegUsername] = useState('')
  const [regPassword, setRegPassword] = useState('')

  const handleGoogleCredential = useCallback(async (response: { credential: string }) => {
    setGoogleLoading(true)
    setError('')
    try {
      const data = await googleSignIn(response.credential)
      setUserFromAuth(data.user)
      closeAuthModal()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed')
    } finally {
      setGoogleLoading(false)
    }
  }, [closeAuthModal, setUserFromAuth])

  // Initialize Google Identity Services — load the script on-demand when modal opens
  useEffect(() => {
    if (!showAuthModal) return

    const init = () => {
      window.google?.accounts?.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
      })
    }

    if (window.google?.accounts?.id) {
      init()
      return
    }

    // Inject GSI script if not already present (it's no longer in index.html)
    let script = document.querySelector('script[src*="accounts.google.com/gsi/client"]') as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      document.head.appendChild(script)
    }
    script.addEventListener('load', init, { once: true })
  }, [showAuthModal, handleGoogleCredential])

  // Sync tab when parent opens with a specific tab
  useEffect(() => {
    if (showAuthModal) {
      setTab(authModalTab)
      setError('')
    }
  }, [showAuthModal, authModalTab])

  if (!showAuthModal) return null

  const handleGoogleButtonClick = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt()
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(loginEmail.trim(), loginPassword)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(regEmail.trim(), regUsername.trim(), regPassword)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const switchTab = (t: 'login' | 'register') => {
    setTab(t)
    setError('')
  }

  const isLoading = loading || googleLoading

  return (
    <div className="auth-overlay" onClick={closeAuthModal}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="auth-modal__close" onClick={closeAuthModal} aria-label="Close">✕</button>

        {/* Tabs */}
        <div className="auth-modal__tabs">
          <button
            className={`auth-modal__tab ${tab === 'login' ? 'auth-modal__tab--active' : ''}`}
            onClick={() => switchTab('login')}
          >
            Sign in
          </button>
          <button
            className={`auth-modal__tab ${tab === 'register' ? 'auth-modal__tab--active' : ''}`}
            onClick={() => switchTab('register')}
          >
            Create account
          </button>
        </div>

        {/* Google SSO button — shown on both tabs */}
        <div className="auth-modal__sso">
          <button
            className="auth-modal__google-btn"
            onClick={handleGoogleButtonClick}
            disabled={isLoading}
            type="button"
          >
            {googleLoading ? (
              <span>Signing in…</span>
            ) : (
              <>
                <svg className="auth-modal__google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>
        </div>

        <div className="auth-modal__divider">
          <span>or</span>
        </div>

        {/* Login form */}
        {tab === 'login' && (
          <form className="auth-modal__form" onSubmit={handleLogin}>
            <label className="auth-modal__label">
              Email
              <input
                className="auth-modal__input"
                type="email"
                placeholder="you@example.com"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label className="auth-modal__label">
              Password
              <input
                className="auth-modal__input"
                type="password"
                placeholder="••••••"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>

            {error && <p className="auth-modal__error">{error}</p>}

            <button className="auth-modal__submit" type="submit" disabled={isLoading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            <p className="auth-modal__switch">
              No account?{' '}
              <button type="button" className="auth-modal__switch-link" onClick={() => switchTab('register')}>
                Create one free
              </button>
            </p>
          </form>
        )}

        {/* Register form */}
        {tab === 'register' && (
          <form className="auth-modal__form" onSubmit={handleRegister}>
            <label className="auth-modal__label">
              Email
              <input
                className="auth-modal__input"
                type="email"
                placeholder="you@example.com"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label className="auth-modal__label">
              Username
              <input
                className="auth-modal__input"
                type="text"
                placeholder="smartass_42"
                value={regUsername}
                onChange={e => setRegUsername(e.target.value)}
                autoComplete="username"
                minLength={3}
                maxLength={20}
                required
              />
              <span className="auth-modal__hint">3–20 chars, letters / numbers / underscores</span>
            </label>

            <label className="auth-modal__label">
              Password
              <input
                className="auth-modal__input"
                type="password"
                placeholder="Min. 6 characters"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />
            </label>

            {error && <p className="auth-modal__error">{error}</p>}

            <button className="auth-modal__submit" type="submit" disabled={isLoading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>

            <p className="auth-modal__switch">
              Already have one?{' '}
              <button type="button" className="auth-modal__switch-link" onClick={() => switchTab('login')}>
                Sign in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

export default AuthModal
