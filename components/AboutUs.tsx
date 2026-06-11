'use client'

import { useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import '../styles/About.scss'

export default function AboutUs() {
  const rootRef = useRef<HTMLDivElement>(null)
  const { navigate } = useApp()

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
    <div className="about-us" ref={rootRef}>
      {/* Hero */}
      <section className="hero">
        <h1 className="reveal">Hey, we&apos;re Smartass Facts!</h1>
        <p className="hero-desc reveal d1">
          Smartass turns knowledge into a witty, gamified app. Skip the doomscrolling and get your
          facts with a sarcastic punch.
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

      {/* How it works */}
      <section className="how-section">
        <h2 className="sec-title reveal">How Smartass works</h2>
        <p className="sec-sub reveal d1">
          You get the fun and chaos of memes, plus the quiet satisfaction of actually learning stuff.
        </p>

        <div className="steps">
          <div className="step reveal d1">
            <div className="step-num">1</div>
            <p>
              <strong>Fake or Fact</strong> mode for solo play, where you swipe through &quot;this
              can&apos;t be real&quot; statements and see what&apos;s actually true.
            </p>
          </div>
          <div className="step reveal d2">
            <div className="step-num">2</div>
            <p>
              <strong>Mood-based categories</strong> like Culture Shock Therapy instead of
              &quot;Art&quot;, Fit Happens instead of &quot;Health&quot;, Nerds Gone Wild instead
              of &quot;Science&quot;, Past Drama instead of &quot;History&quot;, etc.
            </p>
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="vision-section">
        <h2 className="sec-title reveal">Our Vision</h2>
        <p className="sec-sub reveal d1">
          A world where &quot;wasting time on your phone&quot; secretly makes you smarter.
        </p>

        <div className="vision-grid">
          <div className="vision-text reveal d1">
            <h3>We imagine Smartass Facts as:</h3>
            <ul>
              <li>
                The go-to app for witty, bite-sized learning — the place you open when you&apos;re
                bored and want something better than another forgettable reel.
              </li>
              <li>
                A global playground for facts, where people can not only consume, but also submit,
                rate, and battle with their favorite weird truths.
              </li>
              <li>
                A bridge between edutainment and real knowledge — where jokes, memes, and sarcasm
                sit on top of solid, credible information.
              </li>
            </ul>
          </div>
          <div className="vision-img reveal d2">
            <div className="monkey">🐒</div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="mission-section">
        <h2 className="sec-title reveal">Our Mission</h2>
        <p className="sec-sub reveal d1">
          To turn curiosity into the most fun thing you do on your phone
        </p>

        <div className="mission-cards">
          <div className="mc reveal d1">
            <div className="mc-icon">🎓</div>
            <p>
              Make learning feel like a game, not homework. If it isn&apos;t addictive, it
              doesn&apos;t belong in the app.
            </p>
          </div>
          <div className="mc reveal d2">
            <div className="mc-icon">⏱️</div>
            <p>
              Replace mindless scrolling with short, funny, fact-packed moments. A round takes 40
              seconds.
            </p>
          </div>
          <div className="mc reveal d3">
            <div className="mc-icon">💡</div>
            <p>
              Help people sound smarter in real life — at dinner, on dates, at work. Facts you
              actually remember.
            </p>
          </div>
        </div>
      </section>

      {/* What We Believe In */}
      <section className="beliefs-section">
        <h2 className="sec-title reveal">What We Believe In</h2>
        <p className="sec-sub reveal d1">Like any good Smartass, we have opinions. Here are a few:</p>

        <div className="beliefs-grid">
          <div className="belief reveal d1">
            <h3>Play First, Learn Always</h3>
            <p>
              If it&apos;s not fun, you&apos;re not coming back. So we start with play — but we
              always sneak real knowledge in underneath. The game is the hook. The facts are the
              point.
            </p>
          </div>
          <div className="belief reveal d2">
            <h3>Facts &gt; Vibes (but Vibes Matter)</h3>
            <p>
              We care about accuracy. Behind every punchline there&apos;s a real fact, with sources
              and context where it counts. The tone is unserious; the information isn&apos;t.
            </p>
          </div>
          <div className="belief reveal d3">
            <h3>Micro Is The New Macro</h3>
            <p>
              You don&apos;t need a 40-minute course. You need 40 seconds in line for coffee. We
              design for tiny moments that add up over time into something real.
            </p>
          </div>
        </div>
      </section>

      {/* Why We Built It */}
      <section className="why-section">
        <h2 className="sec-title reveal">Why We Built Smartass Facts</h2>
        <p className="sec-sub reveal d1">
          Most trivia and fact apps feel like they were designed by a textbook in a suit.
        </p>

        <div className="prob-cards">
          <div className="pc reveal d1">
            <div className="pc-img">🦧</div>
            <div className="pc-body">
              <h3>Problem 1: Boring Apps</h3>
              <p>
                Most trivia and fact apps feel like they were designed by a textbook in a suit. Dry
                questions, no personality, zero reason to open them tomorrow.
              </p>
            </div>
          </div>
          <div className="pc reveal d2">
            <div className="pc-img">📚</div>
            <div className="pc-body">
              <h3>Problem 2: Social Feed Half-Truths</h3>
              <p>
                Social feeds are packed with fake wisdom and half-truths, spreading because
                they&apos;re entertaining — not because they&apos;re credible.
              </p>
            </div>
          </div>
          <div className="pc reveal d3">
            <div className="pc-img">🧘🐒</div>
            <div className="pc-body">
              <h3>Solution: Smartass</h3>
              <p>
                Smartass is the bridge, sitting exactly between the chaotic fun of your meme feed
                and the credible grounding of a good encyclopedia. All wrapped up in a game you
                actually want to play. Welcome to the club.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
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
