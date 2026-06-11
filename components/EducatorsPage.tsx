'use client'

import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/AppContext'
import '../styles/EducatorsPage.scss'

const CHEVRON_SVG = (
  <svg viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
    <polyline points="6 9 12 15 18 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const FAQ_ITEMS = [
  {
    q: 'Is Smartass Facts free for educators?',
    a: 'Yes — completely free. No subscription, no sign-up required to play. Teachers can use every game mode and all 30+ categories at zero cost. An optional account unlocks streaks and XP history for students who want it.',
  },
  {
    q: 'What age group is it suitable for?',
    a: 'The game is designed for ages 13 and up. The content is fact-based and family-friendly — no adult humour, no graphic content. The tone is irreverent but the facts are clean. We\'d recommend a teacher preview for any group under 16.',
  },
  {
    q: 'How do I run it as a class activity?',
    a: 'The easiest way: project the game on a screen, pick a category relevant to your lesson, and have students vote on each answer before you reveal it. No accounts needed. Works on any device with a browser.',
  },
  {
    q: 'Can students play on their own devices?',
    a: 'Yes. Smartass Facts works on mobile, tablet, and desktop. Students can play simultaneously — useful for comparing scores on the Daily Challenge, which is the same set of questions for everyone on a given day.',
  },
  {
    q: 'Do you have printable materials?',
    a: 'Not yet — but it\'s on the roadmap. If you\'d like to be notified when worksheets and discussion guides are available, drop us a line at support@smartassfacts.com.',
  },
]

const USE_CASES = [
  {
    icon: '🧠',
    title: 'Bell-ringer warm-ups',
    desc: 'Start the class with 3 rounds of Fake or Fact in a topic related to the day\'s lesson. Gets brains switched on without feeling like homework.',
  },
  {
    icon: '💬',
    title: 'Discussion starters',
    desc: 'Show a "surprising but true" fact and ask: why is this true? What does it imply? Designed to generate the kind of conversation textbooks can\'t.',
  },
  {
    icon: '🏆',
    title: 'End-of-unit revision',
    desc: 'Use the Daily Challenge as a low-stakes end-of-unit test. Same 10 questions for the whole class — easy to compare results and highlight gaps.',
  },
  {
    icon: '🎯',
    title: 'Critical thinking drill',
    desc: 'The Fake statements are designed to be plausible — separating fact from credible-sounding fiction is a core media literacy skill. Perfect for any age.',
  },
  {
    icon: '🌍',
    title: 'Cross-curricular connections',
    desc: '30+ categories spanning science, history, geography, psychology, economics, and more. One game, multiple subjects. Run it in any classroom.',
  },
  {
    icon: '⏱️',
    title: 'Sub plans and free periods',
    desc: 'No prep required. Hand a class a device and a category, and they\'re engaged for 20–40 minutes. Every answer comes with an explanation.',
  },
]

const CATEGORIES = [
  { emoji: '🧬', name: 'Nerds Gone Wild', subject: 'Science' },
  { emoji: '🏺', name: 'Past Drama', subject: 'History' },
  { emoji: '🌿', name: 'Planet Weird', subject: 'Geography & Nature' },
  { emoji: '💪', name: 'Fit Happens', subject: 'Health & PE' },
  { emoji: '🎨', name: 'Culture Shock Therapy', subject: 'Art & Culture' },
  { emoji: '🍔', name: 'Edible Evidence', subject: 'Food Science' },
  { emoji: '🧠', name: 'Freud & Error', subject: 'Psychology' },
  { emoji: '💰', name: 'In Debt We Trust', subject: 'Economics' },
  { emoji: '🗳️', name: 'Democrazy in Action', subject: 'Civics & Politics' },
  { emoji: '🤖', name: 'Artificial Unintelligence', subject: 'Technology' },
  { emoji: '📖', name: 'Booked & Bewildered', subject: 'Literature' },
  { emoji: '✈️', name: 'Jet Lag & Bragging Rights', subject: 'Travel & Geography' },
]

export default function EducatorsPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const { navigate, onPlayClick } = useApp()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    document.title = 'For Educators — Free Classroom Resources | SmartAss Facts'
    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (canonical) canonical.href = 'https://smartassfacts.com/for-educators/'
    document.documentElement.setAttribute('data-prerender-ready', 'true')
  }, [])

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

  return (
    <div className="educators-page" ref={rootRef}>
      {/* Hero */}
      <section className="edu-hero">
        <div className="edu-hero__inner">
          <nav className="edu-breadcrumb reveal">
            <a href="/" onClick={e => { e.preventDefault(); navigate('/') }}>Home</a>
            <span>›</span>
            <span>For Educators</span>
          </nav>
          <div className="edu-hero__badge reveal">🎓 For Educators</div>
          <h1 className="edu-hero__h1 reveal">Turn any lesson into a&nbsp;game.</h1>
          <p className="edu-hero__sub reveal d1">
            Smartass Facts is free for classrooms. No sign-up required. 30+ curriculum-adjacent
            categories, every answer labeled True or Fake, instant explanations for every question.
          </p>
          <div className="edu-hero__actions reveal d2">
            <button className="edu-btn edu-btn--primary" onClick={() => onPlayClick('For You')}>
              ▶ Play Now
            </button>
            <a
              href="mailto:support@smartassfacts.com?subject=Educators%20enquiry"
              className="edu-btn edu-btn--outline"
            >
              Contact Us
            </a>
          </div>
          <div className="edu-stats reveal d3">
            <div className="edu-stat">
              <span className="edu-stat__num">Free</span>
              <span className="edu-stat__label">Forever</span>
            </div>
            <div className="edu-stat">
              <span className="edu-stat__num">30+</span>
              <span className="edu-stat__label">Categories</span>
            </div>
            <div className="edu-stat">
              <span className="edu-stat__num">5,000+</span>
              <span className="edu-stat__label">Verified Facts</span>
            </div>
            <div className="edu-stat">
              <span className="edu-stat__num">0</span>
              <span className="edu-stat__label">Setup Required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="edu-section">
        <div className="edu-section__inner">
          <h2 className="edu-section__title reveal">How teachers use it</h2>
          <p className="edu-section__sub reveal d1">
            Six classroom scenarios — no prep, no accounts, no friction.
          </p>
          <div className="edu-use-cases">
            {USE_CASES.map((item, i) => (
              <div key={i} className={`edu-use-card reveal d${(i % 3) + 1}`}>
                <div className="edu-use-card__icon">{item.icon}</div>
                <div className="edu-use-card__body">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="edu-categories-section">
        <div className="edu-section__inner">
          <h2 className="edu-section__title reveal">Categories with curriculum crossover</h2>
          <p className="edu-section__sub reveal d1">
            Every category maps to at least one school subject. The names are irreverent — the facts
            are not.
          </p>
          <div className="edu-cat-grid">
            {CATEGORIES.map((cat, i) => (
              <div
                key={i}
                className={`edu-cat-card reveal d${(i % 3) + 1}`}
                onClick={() => onPlayClick(cat.name)}
                style={{ cursor: 'pointer' }}
              >
                <span className="edu-cat-card__emoji">{cat.emoji}</span>
                <div className="edu-cat-card__body">
                  <span className="edu-cat-card__name">{cat.name}</span>
                  <span className="edu-cat-card__subject">{cat.subject}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why it works */}
      <section className="edu-why-section">
        <div className="edu-section__inner">
          <h2 className="edu-section__title reveal">Why it works in a classroom</h2>
          <div className="edu-why-grid">
            <div className="edu-why-card reveal d1">
              <h3>Every answer teaches something</h3>
              <p>
                Right or wrong, every question ends with an explanation. Students who guessed
                incorrectly learn something new. Students who guessed correctly get their instinct
                validated with context.
              </p>
            </div>
            <div className="edu-why-card reveal d2">
              <h3>Designed to spark debate</h3>
              <p>
                The Fake statements are plausible by design — they&apos;re made to look like facts.
                That tension is exactly what makes students argue, discuss, and engage. It&apos;s
                not just trivia, it&apos;s critical thinking practice.
              </p>
            </div>
            <div className="edu-why-card reveal d3">
              <h3>Works at every level</h3>
              <p>
                No reading level barrier. No prior knowledge required. The game meets students where
                they are and rewards curiosity over memorisation. Suitable for mixed-ability groups.
              </p>
            </div>
            <div className="edu-why-card reveal d1">
              <h3>Zero friction to start</h3>
              <p>
                No app download, no account creation, no IT department. Students open a browser,
                pick a category, and start playing. You can be running a game within 30 seconds of
                the bell.
              </p>
            </div>
            <div className="edu-why-card reveal d2">
              <h3>Builds media literacy</h3>
              <p>
                Distinguishing verified facts from plausible-sounding misinformation is one of the
                most valuable skills students can develop. Fake or Fact is the same skill — gamified.
              </p>
            </div>
            <div className="edu-why-card reveal d3">
              <h3>Genuinely free</h3>
              <p>
                No freemium gotcha. No paywalled categories. No ads. The full game is free for
                students and teachers. We believe learning tools should be accessible to every
                classroom, not just well-funded ones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="edu-faq-section">
        <div className="edu-section__inner">
          <h2 className="edu-section__title reveal">Frequently asked</h2>
          <p className="edu-section__sub reveal d1">Tap to expand.</p>
          <div className="edu-faq-list">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className={`edu-faq-item ${openFaq === i ? 'edu-faq-item--open' : ''}`}>
                <button
                  type="button"
                  className="edu-faq-q"
                  onClick={() => setOpenFaq(prev => prev === i ? null : i)}
                >
                  <span>{item.q}</span>
                  <span
                    className="edu-faq-chevron"
                    style={{
                      transform: openFaq === i ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s',
                    }}
                  >
                    {CHEVRON_SVG}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="edu-faq-a">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="edu-cta-section">
        <div className="edu-cta-box reveal">
          <h2>Ready to try it?</h2>
          <p>
            No setup. No sign-up. Open a browser, pick a category, and start a game. Works on
            any device, any classroom.
          </p>
          <button className="edu-btn edu-btn--primary" onClick={() => onPlayClick('For You')}>
            ▶ Play Now
          </button>
        </div>
      </section>
    </div>
  )
}
