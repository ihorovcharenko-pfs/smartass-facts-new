'use client'

// Persistent chrome: header on every route, footer everywhere except the
// immersive game/battle/room routes (matching the old App.tsx), the global auth
// modal and the ?login=true deep link. (The first-visit welcome/topics modals were removed:
// the home-page video explains the game, and favourites are now a heart on each tile.)
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import AuthModal from './AuthModal'
import CookieBanner from './CookieBanner'
import { useAuth } from '../context/AuthContext'
import '../styles/comic.scss'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const rawPath = usePathname() || '/'
  // trailingSlash:true makes this '/game/' — normalise or the game/room checks never match
  const pathname = rawPath.length > 1 && rawPath.endsWith('/') ? rawPath.slice(0, -1) : rawPath
  const { openAuthModal } = useAuth()

  const isGameRoute =
    pathname === '/game' ||
    pathname.startsWith('/battle/') ||
    pathname.startsWith('/room')

  // ?login=true deep link → open the auth modal, then strip the param.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('login') === 'true') {
      openAuthModal('login')
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [openAuthModal])

  return (
    <div className="app">
      <Header />
      {children}
      {/* Immersive routes hide the footer on phones; /game and /room show it on desktop (≥700px) */}
      {!isGameRoute && <Footer />}
      {isGameRoute && (pathname === '/game' || pathname.startsWith('/room')) && (
        <div className="footer-desktop-only"><Footer /></div>
      )}
      <AuthModal />
      <CookieBanner />
    </div>
  )
}
