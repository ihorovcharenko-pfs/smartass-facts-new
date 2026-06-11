'use client'

import { useState } from 'react'
import logo from '../assets/smartass-logo.png'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { LEADERBOARD_PATH, ROOM_PATH } from './paths'
import searchIcon from '../assets/search.svg'
import '../styles/Header.scss'

function Header() {
  const { pathname, searchText, onSearchChange, navigate } = useApp()
  const { user, logout, openAuthModal } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const isMainPage = pathname === '/'

  const navLinks = (
    <>
      <a href={LEADERBOARD_PATH} className="header__nav-link" onClick={e => { e.preventDefault(); navigate(LEADERBOARD_PATH); setMenuOpen(false) }}>Leaderboard</a>
      <a href={ROOM_PATH} className="header__nav-link" onClick={e => { e.preventDefault(); navigate(ROOM_PATH); setMenuOpen(false) }}>Party Mode</a>
      {user ? (
        <div className="header__user">
          <span className="header__username">👤 {user.username}</span>
          <button className="header__logout" onClick={() => { logout(); setMenuOpen(false) }}>Sign out</button>
        </div>
      ) : (
        <button className="header__signin" onClick={() => { openAuthModal('login'); setMenuOpen(false) }}>Sign in</button>
      )}
      {!isMainPage && (
        <button className="header__play-now" onClick={() => { navigate('/'); setMenuOpen(false) }}>▶ Play Now</button>
      )}
    </>
  )

  return (
    <header className="header">
      <div className="header__logo" role="button" tabIndex={0} onClick={() => navigate('/')} onKeyDown={e => e.key === 'Enter' && navigate('/')}>
        <img src={logo.src} alt="SmartAss Facts" width={34} height={34} />
        <span className="header__site-name">SmartAss Facts</span>
      </div>

      {isMainPage && (
        <div className="header__search">
          <img src={searchIcon.src} alt="Search" className="header__search-icon" />
          <input type="text" placeholder="Search categories or facts…" className="header__search-input" value={searchText} onChange={e => onSearchChange(e.target.value)} />
        </div>
      )}

      <nav className="header__nav">
        {navLinks}
      </nav>

      <button className="header__hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
        {menuOpen ? '✕' : '☰'}
      </button>

      {menuOpen && (
        <div className="header__mobile-menu">
          {navLinks}
        </div>
      )}
    </header>
  )
}

export default Header
