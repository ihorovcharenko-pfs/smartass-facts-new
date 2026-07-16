'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { fetchFactsForClient, type Fact } from '../services/clientService'
import { CATEGORY_DISPLAY } from '../utils/categoryNames'
import '../styles/RandomFactsPage.scss'

// slug = key into CATEGORY_DISPLAY → the saCategory value the API filters on
const CATEGORIES = [
  { emoji: '🎨', name: 'Arts', slug: 'arts', count: 110 },
  { emoji: '🚗', name: 'Cars', slug: 'cars', count: 129 },
  { emoji: '🏗️', name: 'Construction', slug: 'construction', count: 117 },
  { emoji: '🌍', name: 'Countries', slug: 'countries', count: 45 },
  { emoji: '✏️', name: 'Design', slug: 'design', count: 111 },
  { emoji: '⭐', name: 'Famous People', slug: 'famous-people', count: 173 },
  { emoji: '👗', name: 'Fashion', slug: 'fashion', count: 153 },
  { emoji: '💰', name: 'Finance', slug: 'finance', count: 138 },
  { emoji: '🍕', name: 'Food', slug: 'food', count: 204 },
  { emoji: '🎮', name: 'Games', slug: 'games', count: 154 },
  { emoji: '🗺️', name: 'Geography', slug: 'geography', count: 189 },
  { emoji: '🏆', name: 'World Records', slug: 'guinness-world-records', count: 198 },
  { emoji: '💪', name: 'Health', slug: 'health', count: 146 },
  { emoji: '📜', name: 'History', slug: 'history', count: 193 },
  { emoji: '🧠', name: 'Human Brain', slug: 'human-brain', count: 87 },
  { emoji: '🧬', name: 'Humans', slug: 'humans', count: 60 },
  { emoji: '😂', name: 'Humour', slug: 'humour', count: 131 },
  { emoji: '💡', name: 'Inventions', slug: 'inventions', count: 172 },
  { emoji: '🗣️', name: 'Languages', slug: 'languages', count: 161 },
  { emoji: '📚', name: 'Literature', slug: 'literature', count: 146 },
  { emoji: '🔢', name: 'Mathematics', slug: 'mathematics', count: 155 },
  { emoji: '🎬', name: 'Movies', slug: 'movies', count: 163 },
  { emoji: '🎵', name: 'Music', slug: 'music', count: 186 },
  { emoji: '🌿', name: 'Nature', slug: 'nature', count: 200 },
  { emoji: '🐶', name: 'Pets & Animals', slug: 'pets-animals', count: 217 },
  { emoji: '🤔', name: 'Philosophy', slug: 'philosophy', count: 199 },
  { emoji: '⚛️', name: 'Physics', slug: 'physics', count: 208 },
  { emoji: '🏛️', name: 'Politics', slug: 'politics', count: 179 },
  { emoji: '🧩', name: 'Psychology', slug: 'psychology', count: 198 },
  { emoji: '🙏', name: 'Religion', slug: 'religion', count: 199 },
  { emoji: '🔬', name: 'Science', slug: 'science', count: 170 },
  { emoji: '🚀', name: 'Space', slug: 'space', count: 205 },
  { emoji: '⚽', name: 'Sports', slug: 'sports', count: 210 },
  { emoji: '💻', name: 'Technology', slug: 'technology', count: 187 },
  { emoji: '✈️', name: 'Travel', slug: 'travel', count: 194 },
]

type Category = (typeof CATEGORIES)[number]

const FAQ_ITEMS = [
  {
    q: 'How does the SmartAss Facts random generator work?',
    a: 'Click "Next Random Fact" and the generator instantly picks one from over 5,687 verified facts across Science, History, Animals, Food, Technology, and more. Every fact is labeled ✓ TRUE or ✗ FAKE so you always know what\'s real.',
  },
  {
    q: 'Are the random facts on SmartAss Facts accurate?',
    a: 'Yes. Every fact is independently researched and clearly labeled TRUE or FAKE. The SmartAss Facts team verifies facts before publishing — you\'ll always know whether you\'re reading verified science or a popular myth.',
  },
  {
    q: 'Can I get a random fact from a specific category?',
    a: 'Absolutely. Use the category buttons above to filter by Animals, Science, History, Food, Technology, Space, and more. Each category has its own random fact generator page.',
  },
  {
    q: 'How many random facts are available?',
    a: 'SmartAss Facts has over 5,687 verified facts across 38 categories. The generator picks a different fact every time.',
  },
  {
    q: 'What makes SmartAss Facts different from other fact sites?',
    a: 'Every fact on SmartAss Facts is labeled ✓ TRUE or ✗ FAKE — so you always know what\'s real and what\'s a popular myth. Plus, each fact comes with the witty "SmartAss" take that makes it actually shareable.',
  },
]

const CHEVRON = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function RandomFactsPage() {
  const { navigate, onPlayClick } = useApp()

  useEffect(() => {
    document.title = 'Random Facts Generator — 5,000+ Verified Facts | SmartAss Facts'
    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (canonical) canonical.href = 'https://smartassfacts.com/random/'
    // Signal prerender service: static content is ready. The fact generator
    // only fetches on button click, so there's nothing to wait for at load time.
    document.documentElement.setAttribute('data-prerender-ready', 'true')
  }, [])

  const [fact, setFact] = useState<Fact | null>(null)
  const [pool, setPool] = useState<Fact[]>([])
  const [usedIds, setUsedIds] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [selectedCat, setSelectedCat] = useState<Category | null>(null)
  const generatorRef = useRef<HTMLDivElement>(null)

  // Pool and used-ids are passed explicitly so a category switch can draw from
  // a fresh pool immediately instead of waiting for state to settle.
  const drawFact = useCallback(async (cat: Category | null, currentPool: Fact[], currentUsed: number[]) => {
    setLoading(true)
    setHasStarted(true)
    try {
      let available = currentPool.filter(f => !currentUsed.includes(f.id))
      if (available.length < 3) {
        const saCategory = cat ? CATEGORY_DISPLAY[cat.slug] : undefined
        const fresh = await fetchFactsForClient(saCategory, currentUsed.length > 0 ? currentUsed.slice(-100) : undefined)
        const newFacts = fresh.filter(f => !currentUsed.includes(f.id))
        setPool([...currentPool, ...newFacts])
        available = [...available, ...newFacts]
      }
      if (available.length > 0) {
        const pick = available[Math.floor(Math.random() * available.length)]
        setFact(pick)
        setUsedIds([...currentUsed, pick.id])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  const getRandomFact = () => drawFact(selectedCat, pool, usedIds)

  // Category pill click: toggle the filter, reset the pool, draw immediately,
  // and bring the generator back into view so the result is visible.
  const handleCategoryClick = (cat: Category) => {
    const next = selectedCat?.slug === cat.slug ? null : cat
    setSelectedCat(next)
    setPool([])
    setUsedIds([])
    generatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    drawFact(next, [], [])
  }

  const clearCategory = () => {
    setSelectedCat(null)
    setPool([])
    setUsedIds([])
    drawFact(null, [], [])
  }

  const isTrue = fact?.answer?.toUpperCase() === 'FACT'

  return (
    <div className="random-page">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="random-hero">
        <div className="random-hero__inner">
          <nav className="random-breadcrumb">
            <a href="/" onClick={e => { e.preventDefault(); navigate('/') }}>Home</a>
            <span>›</span>
            <span>Random Facts</span>
          </nav>
          <div className="random-hero__icon">🎲</div>
          <h1 className="random-hero__h1">Random Facts Generator</h1>
          <p className="random-hero__sub">
            Hit the button and get a random surprising fact from our collection of 5,687+ verified facts.
            Every fact is labeled <strong>✓ TRUE</strong> or <strong>✗ FAKE</strong> — so you always know what's real.
          </p>

          <div className="random-stats">
            <div className="random-stat"><span className="random-stat__num">5,687+</span><span className="random-stat__label">Verified Facts</span></div>
            <div className="random-stat"><span className="random-stat__num">35</span><span className="random-stat__label">Categories</span></div>
            <div className="random-stat"><span className="random-stat__num">100%</span><span className="random-stat__label">Labeled True / Fake</span></div>
          </div>
        </div>
      </div>

      {/* ── Generator ─────────────────────────────────────────────── */}
      <div className="random-generator-wrap" ref={generatorRef}>
        <div className="random-generator">
          {selectedCat && (
            <div className="random-filter-chip">
              <span>{selectedCat.emoji} Showing {selectedCat.name} facts</span>
              <button type="button" onClick={clearCategory} aria-label="Clear category filter">✕</button>
            </div>
          )}
          {/* Fact display */}
          <div className={`random-fact-card ${!hasStarted ? 'random-fact-card--empty' : ''} ${loading ? 'random-fact-card--loading' : ''}`}>
            {!hasStarted && !loading && (
              <div className="random-fact-card__placeholder">
                <span>🎲</span>
                <p>Hit the button to get your first random fact!</p>
              </div>
            )}
            {loading && (
              <div className="random-fact-card__placeholder">
                <span className="random-spinner">⏳</span>
                <p>Fetching a fact…</p>
              </div>
            )}
            {fact && !loading && (
              <>
                <div className={`random-fact-card__badge ${isTrue ? 'random-fact-card__badge--true' : 'random-fact-card__badge--fake'}`}>
                  {isTrue ? '✓ TRUE FACT' : '✗ FAKE'}
                </div>
                <p className="random-fact-card__text">{fact.saFact}</p>
                {fact.explanation && (
                  <p className="random-fact-card__explanation">{fact.explanation}</p>
                )}
              </>
            )}
          </div>

          {/* Buttons */}
          <div className="random-generator__actions">
            <button
              className="random-btn random-btn--primary"
              onClick={getRandomFact}
              disabled={loading}
            >
              🎲 {hasStarted ? 'Next Random Fact' : 'Random Fact'}
            </button>
            <button
              className="random-btn random-btn--secondary"
              onClick={() => onPlayClick('For You')}
            >
              ▶ Play Now
            </button>
          </div>
        </div>
      </div>

      {/* ── Browse by category ───────────────────────────────────── */}
      <div className="random-categories-wrap">
        <div className="random-categories-inner">
          <h2 className="random-section-heading">Browse by Category</h2>
          <p className="random-section-sub">Pick a category to get random facts from just that topic. Click it again to go back to all categories.</p>
          <div className="random-cat-pills">
            {CATEGORIES.map(c => (
              <button
                key={c.slug}
                className={`random-cat-pill ${selectedCat?.slug === c.slug ? 'random-cat-pill--active' : ''}`}
                onClick={() => handleCategoryClick(c)}
                title={`${c.count} facts`}
                aria-pressed={selectedCat?.slug === c.slug}
              >
                <span>{c.emoji}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <div className="random-faq">
        <div className="random-faq__inner">
          <h2 className="random-section-heading">Frequently Asked Questions</h2>
          <div className="random-faq__list">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="random-faq__item">
                <button
                  className="random-faq__q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{item.q}</span>
                  <span className={`random-faq__chevron ${openFaq === i ? 'random-faq__chevron--open' : ''}`}>{CHEVRON}</span>
                </button>
                {openFaq === i && (
                  <div className="random-faq__a"><p>{item.a}</p></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
