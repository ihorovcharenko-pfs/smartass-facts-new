'use client'

// Persistent chrome: header on every route, footer everywhere except the
// immersive game/battle/room routes (matching the old App.tsx), the global auth
// modal, the first-visit onboarding modal, and the ?login=true deep link.
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import AuthModal from './AuthModal'
import OnboardingModal from './OnboardingModal'
import { useAuth } from '../context/AuthContext'
import { getOnboardingData, setOnboardingData } from '../utils/localStorage'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/'
  const { openAuthModal } = useAuth()
  const [showOnboarding, setShowOnboarding] = useState(false)

  const isGameRoute =
    pathname === '/game' ||
    pathname.startsWith('/battle/') ||
    pathname.startsWith('/room')

  // First-visit onboarding (localStorage is browser-only → check after mount so
  // SSR and first client render agree).
  useEffect(() => {
    if (!getOnboardingData().completed) setShowOnboarding(true)
  }, [])

  // ?login=true deep link → open the auth modal, then strip the param.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('login') === 'true') {
      openAuthModal('login')
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [openAuthModal])

  const handleOnboardingComplete = (favouriteIds: number[]) => {
    setOnboardingData({ completed: true, favouriteCategoryIds: favouriteIds })
    setShowOnboarding(false)
  }

  return (
    <div className="app">
      <Header />
      {children}
      {!isGameRoute && <Footer />}
      {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}
      <AuthModal />
    </div>
  )
}
