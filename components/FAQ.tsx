'use client'

import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/AppContext'
import { PRIVACY_PATH, HOW_PATH } from './paths'
import '../styles/FAQ.scss'

const CHEVRON_SVG = (
  <svg viewBox="0 0 24 24">
    <polyline points="6 9 12 15 18 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

type FaqItem = { q: string; a: React.ReactNode | ((navigate: (path: string) => void) => React.ReactNode) }
type FaqGroup = { label: string; emoji: string; items: FaqItem[] }

const FAQ_GROUPS: FaqGroup[] = [
  {
    label: 'Getting started',
    emoji: '🚀',
    items: [
      {
        q: 'Do I need an account to play?',
        a: "Nope. You can jump straight into a game without signing up for anything. Just open the app, pick a category, and start guessing. An account unlocks streaks and your personal XP history — but it's completely optional.",
      },
      {
        q: 'Is Smartass Facts free?',
        a: "Yes, the core game is completely free to play. All game modes, all categories, all facts — no paywalls, no \"watch an ad to continue\". We're building toward premium features in the future, but anything that exists today is free.",
      },
      {
        q: 'What devices can I play on?',
        a: 'Smartass Facts works in any modern web browser — on desktop, tablet, or mobile. No app download required. If you can open a browser, you can play. Native iOS and Android apps are on the roadmap.',
      },
      {
        q: 'How long does a round take?',
        a: "A single Fake or Fact question takes about 10–15 seconds. Most players do 5–10 questions in a sitting, which puts a casual session at about 2–3 minutes. There's no forced stopping point — you can play for 40 rounds if you want. We won't stop you. Your boss might.",
      },
    ],
  },
  {
    label: 'Gameplay',
    emoji: '🎮',
    items: [
      {
        q: 'How does Fake or Fact work exactly?',
        a: "A statement appears on screen. Tap either Fake or Fact. If you're right, you earn XP and your streak grows. If you're wrong, your streak resets. Either way, you immediately find out the truth — with a source and a bonus detail. Then the next statement appears.",
      },
      {
        q: 'How does the streak and XP system work?',
        a: 'Every correct answer earns XP and extends your streak. One wrong answer resets the streak to zero, but your total XP stays. The longer you keep a streak alive, the more satisfying it becomes — and the more it hurts when it ends.',
      },
      {
        q: 'How does the Daily Challenge work?',
        a: "Every day at midnight a new set of 10 questions goes live — identical for every player around the world. You get one attempt. No replays, no second chances. Once you've submitted your answers, you can see how your score compares with the community. It's a great equaliser: same facts, same time limit, different brains.",
      },
      {
        q: 'How do Fact-off Battles work?',
        a: 'Challenge a friend via share link, or get matched with a random opponent. Both players see the same facts. Whoever gets the most correct answers wins. Trash talk is not a built-in feature, but nothing in the terms of service prevents it.',
      },
    ],
  },
  {
    label: 'Content & categories',
    emoji: '🧬',
    items: [
      {
        q: 'Are the facts actually true?',
        a: "The facts marked as Fact? Yes, 100% — and every one comes with a cited source. The statements marked as Fake are designed to be plausible but wrong. We invest a lot of care into the line between \"this sounds wild but it's true\" and \"this sounds true but it's wild nonsense\". Getting that balance right is basically our whole job.",
      },
      {
        q: 'How are the facts verified?',
        a: "Every fact goes through an editorial review before it enters the game. We check the primary source, verify the claim in context, and review the framing to make sure nothing is technically true but misleading. No fact ships without a traceable source. If we can't cite it clearly, it doesn't go in.",
      },
      {
        q: 'How many categories are there?',
        a: "Right now there are 30+ categories, each with its own name and editorial tone — things like Culture Shock Therapy, Nerds Gone Wild, Past Drama, Fit Happens, Edible Evidence, and Planet Weird. New categories drop every month. We'll never just call something \"History\" when we can call it something that actually makes you want to play.",
      },
      {
        q: 'I think a fact is wrong. What do I do?',
        a: (
          <>
            If you think something&apos;s off, reach out to us directly at{' '}
            <a href="mailto:support@smartassfacts.com">support@smartassfacts.com</a>. We review every
            message and take accuracy seriously. We&apos;d genuinely rather pull a good fact than
            keep a wrong one.
          </>
        ),
      },
    ],
  },
  {
    label: 'Account & privacy',
    emoji: '🔐',
    items: [
      {
        q: 'What data do you collect?',
        a: (navigate) => (
          <>
            If you play without an account, we collect minimal session data to make the game work —
            nothing identifying. If you create an account, we store your email, your game history,
            and your XP. We don&apos;t sell your data to anyone. Full details are in our{' '}
            <a
              href={PRIVACY_PATH}
              onClick={(e) => {
                e.preventDefault()
                navigate(PRIVACY_PATH)
              }}
            >
              Privacy Policy
            </a>
            .
          </>
        ),
      },
      {
        q: 'Can I delete my account?',
        a: "Yes. You can request full account deletion at any time from your account settings. We'll remove all your personal data within 30 days. Your submitted facts (if any were approved) are anonymised and may remain in the game — but nothing linked back to you personally.",
      },
      {
        q: 'Is there a minimum age requirement?',
        a: "You need to be at least 13 years old to create an account. The game content is suitable for general audiences — we aim for the tone of a smart, edgy pub quiz, not explicit content. Parents, if your kid is playing: they have taste.",
      },
    ],
  },
]

function FaqItemRow({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  id: string
  question: string
  answer: React.ReactNode
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <button
        type="button"
        className="faq-q"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        {question}
        <span className="faq-chevron">{CHEVRON_SVG}</span>
      </button>
      <div className="faq-a" role="region">
        <div className="faq-a-inner">{answer}</div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const rootRef = useRef<HTMLDivElement>(null)
  const { navigate } = useApp()
  const [openId, setOpenId] = useState<string | null>(null)

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

  const handleHowItWorksClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    navigate(HOW_PATH)
  }

  return (
    <div className="faq-page" ref={rootRef}>
      <section className="hero">
        <h1 className="reveal">
          Questions? Good.
          <br />
          We&apos;ve got answers.
        </h1>
        <p className="hero-desc reveal d1">
          Everything you wanted to know about Smartass but were too busy guessing to ask.
        </p>
        <button type="button" className="pill-btn reveal d2" onClick={onStartGame}>
          <span className="play-dot" />
          Start game
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

      <section className="faq-section">
        <h2 className="sec-title reveal">Frequently asked</h2>
        <p className="sec-sub reveal d1">
          Tap any question to expand it. No trick questions here — we promise.
        </p>

        {FAQ_GROUPS.map((group, gi) => (
          <div key={group.label} className="faq-group reveal d1">
            <div className="faq-group-label">
              <span>{group.emoji}</span>
              {group.label}
            </div>
            {group.items.map((item, ii) => {
              const id = `faq-${gi}-${ii}`
              const answer = typeof item.a === 'function' ? item.a(navigate) : item.a
              return (
                <FaqItemRow
                  key={id}
                  id={id}
                  question={item.q}
                  answer={answer}
                  isOpen={openId === id}
                  onToggle={() => setOpenId((prev) => (prev === id ? null : id))}
                />
              )
            })}
          </div>
        ))}
      </section>

      <section className="contact-section">
        <div className="contact-grid">
          <div className="contact-card light reveal d1">
            <div className="contact-card-icon">💬</div>
            <h3>Still curious?</h3>
            <p>
              Browse our full How It Works page for a deeper dive into gameplay, streaks, categories,
              and everything else Smartass has to offer.
            </p>
            <a href={HOW_PATH} className="pill-btn-outline" onClick={handleHowItWorksClick}>
              Read How It Works →
            </a>
          </div>
          <div className="contact-card dark reveal d2">
            <div className="contact-card-icon">✉️</div>
            <h3>Can&apos;t find your answer?</h3>
            <p>
              Drop us a line. We read every message and typically respond within 24 hours. We&apos;re
              a small team but we take support seriously.
            </p>
            <a href="mailto:support@smartassfacts.com" className="pill-btn-outline">
              support@smartassfacts.com →
            </a>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-box reveal">
          <h2>Enough reading. Time to play.</h2>
          <p>
            10,000+ players already guessing their way through the weirdest facts on the internet.
          </p>
          <button type="button" className="pill-btn" onClick={onStartGame}>
            <span className="play-dot" />
            Start game
          </button>
        </div>
      </section>
    </div>
  )
}
