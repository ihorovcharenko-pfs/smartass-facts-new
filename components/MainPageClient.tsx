'use client'

// Landing page UI. Unlike the old Vite MainPage (which fetched groups +
// categories in a useEffect after mount), this receives them as props from the
// server component (app/page.tsx). The grid is therefore present in the initial
// SSR HTML — the whole point of the migration. Search/filter interactivity runs
// client-side over the already-rendered list.
import { useState, useEffect } from 'react'
import Image from 'next/image'
import flagIcon from '../assets/flag.png'
import { getImageUrl, getUserToken, type Group, type Category } from '../services/clientService'
import { useApp } from '../context/AppContext'
import '../styles/MainPage.scss'

// ── Category image map (sa_category → public asset path) ─────────────────────
// All images converted to WebP (89% smaller than original PNGs)
const CATEGORY_IMAGES: Record<string, string> = {
  'Artificial Unintelligence':  '/category-images/Artificial Unintelligence.webp',
  'Astronaughty':               '/category-images/Astronaughty.webp',
  'Booked & Bewildered':        '/category-images/Booked & Bewildered.webp',
  'Bricks & Banter':            '/category-images/Bricks & Banter.webp',
  'Cognitive Dissonantics':     '/category-images/Cognitive Dissonantics.webp',
  'Crashed Joystick':           '/category-images/Crashed Joystick.webp',
  'Culture Shock Therapy':      '/category-images/Culture Shock Therapy.webp',
  'Democrazy in Action':        '/category-images/Democrazy in Action.webp',
  'Fame & Blame':               '/category-images/Fame & Blame.webp',
  'Fit Happens':                '/category-images/Fit Happens.webp',
  'Forking Controversies':      '/category-images/Forking Controversies.webp',
  'Form Meets Dysfunction':     '/category-images/Form Meets Dysfunctiond.webp',
  'Freud & Error':              '/category-images/Freud & Error.webp',
  'Fur Real?':                  '/category-images/Fur Real.webp',
  'Game of the day':            '/category-images/Game of the day3.webp',
  'Giggle Epiphany':            '/category-images/Giggle Epiphany.webp',
  'Grammar Crimes Division':    '/category-images/Grammar Crimes Division.webp',
  'Gray Matter, No Chatter':    '/category-images/Gray Matter, No Chatter.webp',
  'Green, Mean, and Unseen':    '/category-images/Green, Mean, and Unseen.webp',
  'Gym & Tonic':                '/category-images/Gym & Tonic.webp',
  'Holy Sh*t':                  '/category-images/Holy Sht2.webp',
  'Homo Sillyence':             '/category-images/Homo Sillyence.webp',
  'Horsepower & Sass':          '/category-images/Horsepower & Sass.webp',
  'In Debt We Trust':           '/category-images/In Debt We Trust.webp',
  'Jet Lag & Bragging Rights':  '/category-images/Jet Lag & Bragging Rights.webp',
  'Longitude? Attitude':        '/category-images/Longitude Attitude.webp',
  'Nerds Gone Wild':            '/category-images/Nerds Gone Wild.webp',
  'Offbeat Brilliance':         '/category-images/Offbeat Brilliance.webp',
  'Past Drama':                 '/category-images/Past Drama.webp',
  'Patent Pending Insanity':    '/category-images/Patent Pending Insanity.webp',
  'Peak Weirdness':             '/category-images/Peak Weirdness.webp',
  'Popcorn & Plot Holes':       '/category-images/Popcorn & Plot Holes.webp',
  'Quantum Snark':              '/category-images/Quantum Snark.webp',
  'Rude Numbers':               '/category-images/Rude Numbers.webp',
  'Vogue & Vexed':              '/category-images/Vogue & Vexed.webp',
}

function getCategoryImage(saCategory: string, apiImageUrl: string | null): string | null {
  return CATEGORY_IMAGES[saCategory] || (apiImageUrl ? getImageUrl(apiImageUrl) : null)
}

// ── Group emoji map (group name → emoji) ──────────────────────────────────────
const GROUP_EMOJIS: Record<string, string> = {
  'Toilet Trivia':         '🚽',
  'Dinner Party Flex':     '🍽️',
  'Date Night Icebreakers':'💕',
  'Brain Gym':             '🧠',
  'WTF?':                  '🤯',
}

interface MainPageClientProps {
  groups: Group[]
  categories: Category[]
}

function MainPageClient({ groups, categories }: MainPageClientProps) {
  const { searchText, selectedGroupId, onGroupSelect, onPlayClick, favouriteCategories, navigate } = useApp()

  // Auth state is read from localStorage, which only exists in the browser.
  // Start logged-out for SSR/first paint, then update after mount.
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  useEffect(() => {
    setIsLoggedIn(!!getUserToken())
  }, [])

  const filteredCategories = (() => {
    const searchLower = searchText.toLowerCase().trim()
    let filtered: Category[] = []

    if (searchText.trim() !== '') {
      filtered = categories.filter(cat =>
        cat.saCategory.toLowerCase().includes(searchLower) ||
        cat.category.toLowerCase().includes(searchLower)
      )
    } else if (selectedGroupId !== null) {
      filtered = categories.filter(cat => cat.groupId === selectedGroupId)
    } else {
      filtered = categories
    }

    const gameOfTheDay = filtered.find(cat =>
      cat.saCategory.toLowerCase() === 'game of the day' ||
      cat.category.toLowerCase() === 'game of the day'
    )
    const rest = filtered.filter(cat =>
      cat.saCategory.toLowerCase() !== 'game of the day' &&
      cat.category.toLowerCase() !== 'game of the day'
    ).sort((a, b) => a.saCategory.localeCompare(b.saCategory, 'en', { sensitivity: 'base' }))

    const hasFavourites = favouriteCategories.length > 0 && searchText.trim() === '' && selectedGroupId === null
    if (hasFavourites) {
      const favs = rest.filter(cat => favouriteCategories.includes(cat.id))
      const others = rest.filter(cat => !favouriteCategories.includes(cat.id))
      return gameOfTheDay ? [gameOfTheDay, ...favs, ...others] : [...favs, ...others]
    }

    return gameOfTheDay ? [gameOfTheDay, ...rest] : rest
  })()

  const showForYouCard = isLoggedIn && searchText.trim() === '' && selectedGroupId === null

  return (
    <div className="main-page">
      {/* Hero */}
      <div className="main-page__hero">
        <div className="main-page__hero-inner">
          <span className="main-page__hero-badge">🧠 Trivia Game</span>
          <h1 className="main-page__hero-heading">Smart Enough to<br /><span className="main-page__hero-accent">Spot the Fake?</span></h1>
          <p className="main-page__hero-sub">Can you tell fact from fiction? Pick a category and find out.</p>
        </div>
      </div>

      {/* Body: sidebar + grid */}
      <div className="main-page__body">
        <aside className="main-page__sidebar">
          {/* Explore submenu */}
          <div className="sidebar__section">
            <p className="sidebar__section-heading">Explore</p>
            <a href="/random/" className="sidebar__explore-link" onClick={e => { e.preventDefault(); navigate('/random') }}>
              <span className="sidebar__category-icon">🎲</span>
              <span className="sidebar__category-name">Random Facts</span>
            </a>
            <a href="/facts/myths/" className="sidebar__explore-link" onClick={e => { e.preventDefault(); navigate('/myths') }}>
              <span className="sidebar__category-icon">🦄</span>
              <span className="sidebar__category-name">Myths</span>
            </a>
            <a href="/facts/" className="sidebar__explore-link" onClick={e => { e.preventDefault(); navigate('/facts') }}>
              <span className="sidebar__category-icon">✅</span>
              <span className="sidebar__category-name">All Facts</span>
            </a>
            <a href="/facts/vs/" className="sidebar__explore-link" onClick={e => { e.preventDefault(); navigate('/vs') }}>
              <span className="sidebar__category-icon">⚖️</span>
              <span className="sidebar__category-name">vs Comparisons</span>
            </a>
          </div>

          {/* Category filters */}
          <div className="sidebar__section">
            <p className="sidebar__section-heading">Categories</p>
            <div className="sidebar__categories">
              <div
                className={`sidebar__category-item ${searchText.trim() !== '' || selectedGroupId === null ? 'sidebar__category-item--active' : ''}`}
                onClick={() => onGroupSelect(null)}
              >
                <span className="sidebar__category-icon">🍿</span>
                <span className="sidebar__category-name">All Categories</span>
              </div>
              {[...groups].sort((a, b) => a.name.localeCompare(b.name)).map(group => (
                <div
                  key={group.id}
                  className={`sidebar__category-item ${selectedGroupId === group.id ? 'sidebar__category-item--active' : ''}`}
                  onClick={() => onGroupSelect(group.id)}
                >
                  <span className="sidebar__category-icon">
                    {GROUP_EMOJIS[group.name] ?? (group.image ? (
                      <img src={group.image} alt={group.name} style={{ width: 22, height: 22, objectFit: 'contain', borderRadius: 4 }} />
                    ) : '📁')}
                  </span>
                  <span className="sidebar__category-name">{group.name}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="main-page__content">
          {filteredCategories.length === 0 ? (
            <div className="main-page__empty"><p>No categories found.</p></div>
          ) : (
            <div className="categories-grid">
              {showForYouCard && (
                <div className="category-card category-card--for-you" onClick={() => onPlayClick('For You')} style={{ cursor: 'pointer' }}>
                  <div className="category-card__image-wrapper">
                    <div className="category-card__for-you-bg">
                      <span className="category-card__for-you-emoji">🎯</span>
                    </div>
                    <div className="category-card__overlay">
                      <h3 className="category-card__title">For You</h3>
                      <button className="category-card__play-button" aria-label="Play For You" onClick={e => { e.stopPropagation(); onPlayClick('For You') }}>
                        ▶ Play
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {filteredCategories.map((category, index) => {
                const isGameOfTheDay = category.saCategory.toLowerCase() === 'game of the day' || category.category.toLowerCase() === 'game of the day'
                const isFavourite = favouriteCategories.includes(category.id)
                const imgSrc = getCategoryImage(category.saCategory, category.imageUrl)
                // The first card (Game of the day) is the LCP element on mobile.
                // next/image `priority` preloads it with high fetchpriority so it
                // loads early and consistently; the rest lazy-load. next/image also
                // serves smaller responsive AVIF/WebP (fixes "improve image delivery").
                const isLcpImage = index === 0
                return (
                  <div
                    key={category.id}
                    className={`category-card ${isGameOfTheDay ? 'category-card--game-of-day' : ''} ${isFavourite ? 'category-card--favourite' : ''}`}
                    onClick={() => onPlayClick(category.saCategory)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="category-card__image-wrapper">
                      {isGameOfTheDay && (
                        <div className="category-card__start-badge">
                          <img src={flagIcon.src} alt="Flag" className="category-card__flag-icon" />
                          <span className="category-card__start-text">Start here</span>
                        </div>
                      )}
                      {imgSrc ? (
                        <Image
                          src={imgSrc}
                          alt={category.saCategory}
                          fill
                          sizes="(max-width: 500px) 92vw, (max-width: 1100px) 46vw, 28vw"
                          className="category-card__image"
                          priority={isLcpImage}
                        />
                      ) : (
                        <div className="category-card__placeholder">
                          <span className="category-card__placeholder-icon">📝</span>
                        </div>
                      )}
                      <div className="category-card__overlay">
                        <h3 className="category-card__title">{category.saCategory}</h3>
                        <button className="category-card__play-button" aria-label="Play" onClick={e => { e.stopPropagation(); onPlayClick(category.saCategory) }}>
                          ▶ Play
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default MainPageClient
