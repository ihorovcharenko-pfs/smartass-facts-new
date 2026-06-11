'use client'

import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/AppContext'
import { PRIVACY_PATH } from './paths'
import '../styles/HowItWorks.scss'

// ── Shared FAQ data ────────────────────────────────────────────────────────────
const CHEVRON_SVG = (
  <svg viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
    <polyline points="6 9 12 15 18 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const FAQ_ITEMS = [
  { q: 'Do I need an account to play?', a: "Nope. Jump straight into a game without signing up. An account unlocks streaks and XP history — but it's completely optional." },
  { q: 'Is Smartass Facts free?', a: "Yes. All game modes, all categories, all facts — no paywalls, no ads to skip. The core game is free forever." },
  { q: 'How does Fake or Fact work?', a: "A statement appears on screen. Tap Fact or Fake. Right or wrong, you immediately learn the truth — with explanation. Then the next one appears." },
  { q: 'How does the Daily Challenge work?', a: "Every day at midnight a fresh 10-question set goes live — identical for every player worldwide. One attempt, no replays. Compare your score with the community." },
  { q: 'Are the facts actually true?', a: "The Fact ones? 100% — every one has a cited source. The Fake ones are designed to be plausible but wrong. The line between 'sounds wild but true' and 'sounds true but nonsense' is our whole editorial job." },
  { q: 'What data do you collect?', a: "Without an account: minimal session data to run the game, nothing identifying. With an account: email, game history, XP. We don't sell your data. See our Privacy Policy for full details." },
  { q: 'I think a fact is wrong. What do I do?', a: "Email us at support@smartassfacts.com. We review every message and take accuracy seriously — we'd rather pull a good fact than keep a wrong one." },
  { q: 'Can I delete my account?', a: "Yes — request deletion any time from account settings. We remove all personal data within 30 days." },
]

export default function HowItWorks() {
  const rootRef = useRef<HTMLDivElement>(null)
  const { navigate } = useApp()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  // suppress unused import warning
  void PRIVACY_PATH

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const revealEls = root.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    revealEls.forEach((el) => obs.observe(el))
    return () => revealEls.forEach((el) => obs.unobserve(el))
  }, [])

  const onStartGame = (e: React.MouseEvent) => {
    e.preventDefault()
    navigate('/')
  }

  return (
    <div className="how-it-works" ref={rootRef}>
      <section className="hero">
        <h1 className="reveal">How Smartass works</h1>
        <p className="hero-desc reveal d1">
          You get the fun and chaos of memes, plus the quiet satisfaction of actually learning
          stuff.
        </p>
        <button type="button" className="pill-btn reveal d2" onClick={onStartGame}>
          <span className="play-dot" />
          Play Now
        </button>

        <div className="cards-strip reveal d3">
          <div className="gc gc-1">
            <div className="gc-emoji">✈️</div>
            <div className="gc-label">Travel</div>
          </div>
          <div className="gc gc-2">
            <div className="gc-emoji">🐒</div>
            <div className="gc-label">Wild Facts</div>
          </div>
          <div className="gc gc-3">
            <div className="gc-emoji">🌿</div>
            <div className="gc-label">Science</div>
          </div>
        </div>
      </section>

      <section className="how-section">
        <h2 className="sec-title reveal">The game, step by step</h2>
        <p className="sec-sub reveal d1">
          No tutorials, no onboarding friction. You can be guessing facts within 15 seconds of
          opening the app.
        </p>

        <div className="steps">
          <div className="step reveal d1">
            <div className="step-num">1</div>
            <p>
              <strong>Pick your mood, pick your category.</strong> Choose from 30+ mood-based
              categories — like Culture Shock Therapy instead of &quot;Art&quot;, or Nerds Gone
              Wild instead of &quot;Science&quot;. Each one has its own personality and voice.
            </p>
          </div>
          <div className="step reveal d2">
            <div className="step-num">2</div>
            <p>
              <strong>Fake or Fact</strong> mode for solo play, where you swipe through &quot;this
              can&apos;t be real&quot; statements and see what&apos;s actually true. One statement
              at a time. No lifelines. Just your gut.
            </p>
          </div>
          <div className="step reveal d3">
            <div className="step-num">3</div>
            <p>
              <strong>Get instant feedback.</strong> Right or wrong, you always find out the truth
              — with a source, a bonus detail, and your current streak update. You always leave
              knowing more than when you arrived.
            </p>
          </div>
          <div className="step reveal d4">
            <div className="step-num">4</div>
            <p>
              <strong>Build your streak. Climb the leaderboard.</strong> Every correct answer grows
              your streak multiplier and earns XP. Weekly rankings reset every Monday — so every
              week is a fresh shot at the top.
            </p>
          </div>
        </div>
      </section>

      <section className="modes-section">
        <h2 className="sec-title reveal">Three ways to play</h2>
        <p className="sec-sub reveal d1">
          Solo focus, live competition, or a daily ritual. Pick the mode that fits your mood right
          now.
        </p>

        <div className="mode-cards">
          <div className="mode-card reveal d1">
            <div className="mode-img">🃏</div>
            <div className="mode-body">
              <h3>Fake or Fact — Solo</h3>
              <p>
                The classic. One statement at a time. You call it before the timer runs out. Perfect
                for a quick 2-minute session or a deep 40-round dive into whatever category
                you&apos;re feeling today.
              </p>
            </div>
          </div>
          <div className="mode-card dark reveal d2">
            <div className="mode-img">
              ⚔️
              <span className="mode-badge">Popular</span>
            </div>
            <div className="mode-body">
              <h3>Fact-off Battle</h3>
              <p>
                Challenge a friend by link or get matched with a stranger. Same facts, same clock
                — but faster correct answers score bonus points. Most XP when time runs out wins.
              </p>
            </div>
          </div>
          <div className="mode-card reveal d3">
            <div className="mode-img">🧩</div>
            <div className="mode-body">
              <h3>Daily Challenge</h3>
              <p>
                A fresh 10-question set drops at midnight, identical for every player on the
                planet. One shot. No replays. Compare your score with the community and see where
                you land.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <h2 className="sec-title reveal">30+ categories. Zero boring names.</h2>
        <p className="sec-sub reveal d1">
          We renamed every topic to give it a personality. Here&apos;s a taste — new categories
          drop every month.
        </p>

        <div className="cat-cards">
          <div className="cat-card reveal d1">
            <div className="cat-icon">🎨</div>
            <h3>Culture Shock Therapy</h3>
            <p>
              Art and culture facts that make you rethink everything you thought you knew about
              human creativity.
            </p>
          </div>
          <div className="cat-card reveal d2">
            <div className="cat-icon">🧬</div>
            <h3>Nerds Gone Wild</h3>
            <p>
              Science stripped of the textbook — physics, biology, chemistry, but the parts they
              definitely didn&apos;t teach you.
            </p>
          </div>
          <div className="cat-card reveal d3">
            <div className="cat-icon">🏺</div>
            <h3>Past Drama</h3>
            <p>
              History as it actually happened — messy, weird, and far more interesting than your
              school syllabus.
            </p>
          </div>
          <div className="cat-card reveal d1">
            <div className="cat-icon">💪</div>
            <h3>Fit Happens</h3>
            <p>
              Health and body facts that&apos;ll make you question every wellness tip you&apos;ve
              ever seen on Instagram.
            </p>
          </div>
          <div className="cat-card reveal d2">
            <div className="cat-icon">🌿</div>
            <h3>Planet Weird</h3>
            <p>
              The natural world — animals, ecosystems, evolution — featuring facts that make Earth
              feel like an alien planet.
            </p>
          </div>
          <div className="cat-card reveal d3">
            <div className="cat-icon">🍔</div>
            <h3>Edible Evidence</h3>
            <p>
              Food and drink facts from around the world. The origin of ketchup alone will ruin your
              next barbecue.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="faq-section how-it-works__faq" id="faq">
        <h2 className="sec-title reveal">Frequently asked</h2>
        <p className="sec-sub reveal d1">Tap any question to expand it.</p>
        <div className="how-it-works__faq-list">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className={`how-it-works__faq-item ${openFaq === i ? 'how-it-works__faq-item--open' : ''}`}>
              <button
                type="button"
                className="how-it-works__faq-q"
                onClick={() => setOpenFaq(prev => prev === i ? null : i)}
              >
                <span>{item.q}</span>
                <span className="how-it-works__faq-chevron" style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  {CHEVRON_SVG}
                </span>
              </button>
              {openFaq === i && (
                <div className="how-it-works__faq-a">
                  <p>{item.a}</p>
                  {item.q.includes('data') && (
                    <p>See our <a href={PRIVACY_PATH} onClick={e => { e.preventDefault(); navigate(PRIVACY_PATH) }}>Privacy Policy</a> for full details.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-box reveal">
          <h2>Ready to start?</h2>
          <p>
            10,000+ players already guessing their way through the weirdest facts on the internet.
          </p>
          <button type="button" className="pill-btn" onClick={onStartGame}>
            <span className="play-dot" />
            Play Now
          </button>
        </div>
      </section>
    </div>
  )
}
