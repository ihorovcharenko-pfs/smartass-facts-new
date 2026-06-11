'use client'

import { useApp } from '../context/AppContext'
import '../styles/FactsPage.scss'

const SECTIONS = [
  {
    emoji: '🔬',
    title: 'Myths Debunked',
    desc: '51 myths with full explanations and primary-source citations. Alcohol kills brain cells? Nope.',
    meta: '51 myths',
    path: '/myths',
  },
  {
    emoji: '🎲',
    title: 'Random Fact Generator',
    desc: 'Shuffle through thousands of verified facts by category. Great for trivia prep.',
    meta: '38 categories',
    path: '/random',
  },
  {
    emoji: '🎮',
    title: 'Fake or Fact? — The Game',
    desc: '79 science myths and surprising truths. Guess each one, get instant explanations.',
    meta: 'Play now',
    path: null, // triggers onPlayClick
  },
]

const CATEGORIES = [
  { emoji: '🦁', name: 'Animals',        slug: 'animals' },
  { emoji: '🔭', name: 'Science',         slug: 'science' },
  { emoji: '📜', name: 'History',         slug: 'history' },
  { emoji: '🏥', name: 'Health',          slug: 'health' },
  { emoji: '🚀', name: 'Space',           slug: 'space' },
  { emoji: '🌿', name: 'Nature',          slug: 'nature' },
  { emoji: '🍕', name: 'Food',            slug: 'food' },
  { emoji: '💻', name: 'Technology',      slug: 'technology' },
  { emoji: '🧠', name: 'Psychology',      slug: 'psychology' },
  { emoji: '🧬', name: 'Humans',          slug: 'humans' },
  { emoji: '📐', name: 'Mathematics',     slug: 'mathematics' },
  { emoji: '⚛️', name: 'Physics',        slug: 'physics' },
  { emoji: '🗺️', name: 'Geography',     slug: 'geography' },
  { emoji: '🌍', name: 'Countries',       slug: 'countries' },
  { emoji: '👤', name: 'Famous People',   slug: 'famous-people' },
  { emoji: '⚽', name: 'Sports',          slug: 'sports' },
  { emoji: '🎬', name: 'Movies',          slug: 'movies' },
  { emoji: '🎵', name: 'Music',           slug: 'music' },
  { emoji: '🎨', name: 'Arts',            slug: 'arts' },
  { emoji: '📚', name: 'Literature',      slug: 'literature' },
  { emoji: '✈️', name: 'Travel',         slug: 'travel' },
  { emoji: '💬', name: 'Languages',       slug: 'languages' },
  { emoji: '🕌', name: 'Religion',        slug: 'religion' },
  { emoji: '🏛️', name: 'Politics',      slug: 'politics' },
  { emoji: '💭', name: 'Philosophy',      slug: 'philosophy' },
  { emoji: '💰', name: 'Finance',         slug: 'finance' },
  { emoji: '💡', name: 'Inventions',      slug: 'inventions' },
  { emoji: '🧠', name: 'Human Brain',     slug: 'human-brain' },
  { emoji: '🐾', name: 'Pets',            slug: 'pets-animals' },
  { emoji: '😂', name: 'Humour',          slug: 'humour' },
  { emoji: '🎮', name: 'Games',           slug: 'games' },
  { emoji: '🚗', name: 'Cars',            slug: 'cars' },
  { emoji: '👗', name: 'Fashion',         slug: 'fashion' },
  { emoji: '✏️', name: 'Design',         slug: 'design' },
  { emoji: '🏗️', name: 'Construction',  slug: 'construction' },
  { emoji: '🏆', name: 'World Records',   slug: 'guinness-world-records' },
  { emoji: '👥', name: 'People',          slug: 'people' },
  { emoji: '📌', name: 'Topics',          slug: 'topics' },
]

export default function FactsPage() {
  const { navigate, onPlayClick } = useApp()

  return (
    <div className="facts-page">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <div className="facts-hero">
        <div className="facts-hero__inner">
          <span className="facts-hero__badge">🧠 Knowledge Base</span>
          <h1 className="facts-hero__h1">
            Facts worth <em>knowing</em>.<br />Myths worth <em>killing</em>.
          </h1>
          <p className="facts-hero__sub">
            5,000+ verified facts across 38 categories — all sourced to peer-reviewed research,
            government datasets, or primary-source publications. No clickbait. No vague hedging.
          </p>

          <div className="facts-stats">
            <div className="facts-stat"><span className="facts-stat__num">5,000+</span><span className="facts-stat__label">Verified facts</span></div>
            <div className="facts-stat"><span className="facts-stat__num">51</span><span className="facts-stat__label">Myths debunked</span></div>
            <div className="facts-stat"><span className="facts-stat__num">49</span><span className="facts-stat__label">Concept comparisons</span></div>
            <div className="facts-stat"><span className="facts-stat__num">38</span><span className="facts-stat__label">Categories</span></div>
          </div>
        </div>
      </div>

      {/* ── Game CTA ────────────────────────────────────────────── */}
      <div className="facts-game-card-wrap">
        <div className="facts-game-card">
          <div className="facts-game-card__text">
            <div className="facts-game-card__label">🎮 Fake or Fact? — The Game</div>
            <h2>Can you beat 7/10?</h2>
            <p>79 science myths and surprising truths. Guess each one, get instant explanations.</p>
          </div>
          <button className="facts-play-btn" onClick={() => onPlayClick('For You')}>▶ Play Now</button>
        </div>
      </div>

      {/* ── Popular sections ─────────────────────────────────────── */}
      <div className="facts-sections-wrap">
        <div className="facts-sections-inner">
          <h2 className="facts-section-heading">Popular Sections</h2>
          <div className="facts-sections">
            {SECTIONS.map((s, i) => (
              <div
                key={i}
                className="facts-section-card"
                onClick={() => s.path ? navigate(s.path) : onPlayClick('For You')}
                style={{ cursor: 'pointer' }}
              >
                <div className="facts-section-card__emoji">{s.emoji}</div>
                <div className="facts-section-card__body">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <span className="facts-section-card__meta">{s.meta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Browse by category ───────────────────────────────────── */}
      <div className="facts-categories-wrap">
        <div className="facts-categories-inner">
          <h2 className="facts-section-heading">Browse by Category</h2>
          <div className="facts-cat-grid">
            {CATEGORIES.map((c, i) => (
              <a
                key={i}
                className="facts-cat-chip"
                href={`/facts/${c.slug}`}
                onClick={e => { e.preventDefault(); navigate(`/facts/${c.slug}`) }}
              >
                <span>{c.emoji}</span>
                <span>{c.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── For Educators ────────────────────────────────────────── */}
      <div className="facts-educators-wrap">
        <a className="facts-educators" href="/for-educators/">
          <div className="facts-educators__text">
            <div className="facts-educators__icon">🏫</div>
            <h3>Free Classroom Resources</h3>
            <p>Embeddable quiz widget, myth vs. fact worksheets, and discussion guides. All sourced to peer-reviewed research. No signup required.</p>
            <span className="facts-educators__tag">Free · No account needed →</span>
          </div>
        </a>
      </div>
    </div>
  )
}
