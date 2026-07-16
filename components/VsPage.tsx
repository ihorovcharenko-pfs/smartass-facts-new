'use client'

import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import '../styles/VsPage.scss'

const COMPARISONS = [
  { emoji: '🎯', title: 'Accuracy vs Precision', slug: 'accuracy-vs-precision', desc: 'Accuracy is how close you are to the true value. Precision is how repeatable your results are. You can be one without the other.' },
  { emoji: '✍️', title: 'Active vs Passive Voice', slug: 'active-vs-passive-voice', desc: 'The subject acts vs the subject is acted upon. When to use each — and why passive voice isn\'t always wrong.' },
  { emoji: '📝', title: 'Affect vs Effect', slug: 'affect-vs-effect', desc: 'The most confused word pair in English. Affect is usually a verb; effect is usually a noun. With the real exceptions.' },
  { emoji: '🐊', title: 'Alligator vs Crocodile', slug: 'alligator-vs-crocodile', desc: 'Snout shape is the classic tell: crocodiles have pointy V-shaped snouts, alligators wide U-shaped ones.' },
  { emoji: '🫀', title: 'Arteries vs Veins', slug: 'arteries-vs-veins', desc: 'Arteries carry blood away from the heart under high pressure; veins carry it back. One famous exception included.' },
  { emoji: '☄️', title: 'Asteroid vs Meteor vs Meteorite', slug: 'asteroid-vs-meteor-vs-meteorite', desc: 'The same space rock gets three different names depending on where it is. One burns up, one lands.' },
  { emoji: '⚛️', title: 'Atom vs Molecule', slug: 'atom-vs-molecule', desc: 'An atom is the smallest unit of an element. A molecule is two or more atoms bonded together. Water is a molecule.' },
  { emoji: '🦬', title: 'Bison vs Buffalo', slug: 'bison-vs-buffalo', desc: 'American bison are not true buffalo. True buffalo live in Africa and Asia. The mix-up has a historical origin.' },
  { emoji: '🏗️', title: 'Cement vs Concrete', slug: 'cement-vs-concrete', desc: 'Cement is an ingredient in concrete, not the same thing. What concrete actually contains and why builders care.' },
  { emoji: '🤧', title: 'Cold vs Flu', slug: 'cold-vs-flu', desc: 'Similar symptoms, very different severity. Flu means fever, sudden onset, and severe fatigue. When to see a doctor.' },
  { emoji: '🌡️', title: 'Conduction vs Convection vs Radiation', slug: 'conduction-vs-convection-vs-radiation', desc: 'Three ways heat travels: direct contact, fluid movement, and electromagnetic waves — the last works in a vacuum.' },
  { emoji: '🗺️', title: 'Country vs Nation vs State', slug: 'country-vs-nation-vs-state', desc: 'A country is territory. A nation is a people with shared identity. A state is a sovereign political entity.' },
  { emoji: '🌍', title: 'Crust vs Mantle vs Core', slug: 'crust-vs-mantle-vs-core', desc: 'The thin shell we live on, the thick layer of hot rock beneath, and the iron-rich centre of our planet.' },
  { emoji: '🌀', title: 'Cyclone vs Hurricane vs Typhoon', slug: 'cyclone-vs-hurricane-vs-typhoon', desc: 'All the same storm — a tropical cyclone. The name changes based on where in the world it forms.' },
  { emoji: '🧬', title: 'DNA vs RNA', slug: 'dna-vs-rna', desc: 'Both carry genetic instructions, but DNA stores them long-term while RNA is the messenger that makes proteins.' },
  { emoji: '🐬', title: 'Dolphin vs Porpoise', slug: 'dolphin-vs-porpoise', desc: 'Most people can\'t tell them apart. Body shape, teeth, and behaviour differences — and dolphins are more talkative.' },
  { emoji: '🦠', title: 'Epidemic vs Pandemic', slug: 'epidemic-vs-pandemic', desc: 'An epidemic is a surge of disease in one region. A pandemic is that epidemic gone global. Scale is the difference.' },
  { emoji: '🌫️', title: 'Fog vs Mist', slug: 'fog-vs-mist', desc: 'Both are low-lying clouds of water droplets. The only official difference is visibility: under 1 km means fog.' },
  { emoji: '🍅', title: 'Fruit vs Vegetable', slug: 'fruit-vs-vegetable', desc: 'Botanically, tomatoes and cucumbers are fruits. Culinarily, they\'re vegetables. Both definitions are valid.' },
  { emoji: '🌌', title: 'Solar System vs Galaxy vs Universe', slug: 'galaxy-vs-universe-vs-solar-system', desc: 'Our Sun and its planets, then billions of star systems, then all 2 trillion galaxies. Scale: unimaginable.' },
  { emoji: '🔬', title: 'Hypothesis vs Theory vs Law', slug: 'hypothesis-vs-theory-vs-law', desc: 'An educated guess, a well-tested explanation, and a description of what happens. \'Just a theory\' misses the point.' },
  { emoji: '🎭', title: 'Irony vs Sarcasm', slug: 'irony-vs-sarcasm', desc: 'Irony is a gap between expectation and reality. Sarcasm is verbal irony used to mock. Related, not the same.' },
  { emoji: '⛓️', title: 'Jail vs Prison', slug: 'jail-vs-prison', desc: 'Jail is short-term, run by local authorities. Prison is long-term, run by state or federal government.' },
  { emoji: '🍓', title: 'Jam vs Jelly vs Marmalade', slug: 'jam-vs-jelly-vs-marmalade', desc: 'Jam has fruit pieces, jelly is clear fruit juice, marmalade uses citrus peel. Preserves and conserves explained too.' },
  { emoji: '⚡', title: 'Kinetic vs Potential Energy', slug: 'kinetic-vs-potential-energy', desc: 'Energy of motion vs stored energy. A ball at the top of a ramp has potential; rolling down converts it to kinetic.' },
  { emoji: '🌋', title: 'Lava vs Magma', slug: 'lava-vs-magma', desc: 'Same molten rock, different location. Underground: magma. Above ground: lava. Location is everything.' },
  { emoji: '🧭', title: 'Latitude vs Longitude', slug: 'longitude-vs-latitude', desc: 'Latitude runs east–west, longitude north–south. Memory tricks, the equator, and how GPS uses both.' },
  { emoji: '🧲', title: 'Mass vs Weight', slug: 'mass-vs-weight', desc: 'You weigh less on the Moon. Your mass doesn\'t change. These two words are not interchangeable.' },
  { emoji: '🧫', title: 'Mitosis vs Meiosis', slug: 'mitosis-vs-meiosis', desc: 'Two identical cells for growth and repair vs four unique sex cells with half the chromosomes.' },
  { emoji: '🦋', title: 'Moth vs Butterfly', slug: 'moth-vs-butterfly', desc: 'Night vs day is just the start. Antennae shape, resting wing position, and cocoons also differ — with exceptions.' },
  { emoji: '☢️', title: 'Nuclear Fission vs Fusion', slug: 'nuclear-fission-vs-fusion', desc: 'Fission splits atoms and powers today\'s reactors. Fusion joins them and powers the Sun. Both release enormous energy.' },
  { emoji: '🧪', title: 'Proton vs Neutron vs Electron', slug: 'proton-vs-neutron-vs-electron', desc: 'Protons and neutrons form the nucleus; electrons orbit it. Proton count defines the element itself.' },
  { emoji: '🖥️', title: 'RAM vs ROM', slug: 'ram-vs-rom', desc: 'One is fast, temporary working memory; the other is permanent storage your device can\'t rewrite. You need both.' },
  { emoji: '🦎', title: 'Reptile vs Amphibian', slug: 'reptile-vs-amphibian', desc: 'Dry scaly skin and shelled eggs on land vs moist skin and eggs in water. Frogs vs lizards, settled.' },
  { emoji: '🪐', title: 'Rotation vs Revolution', slug: 'rotation-vs-revolution', desc: 'Spinning on your own axis (a day) vs orbiting another body (a year). Earth does both at once.' },
  { emoji: '🔌', title: 'Series vs Parallel Circuit', slug: 'series-vs-parallel-circuit', desc: 'One loop with a single current path vs branches with many. Why one dead bulb kills some fairy lights but not others.' },
  { emoji: '💰', title: 'Simple vs Compound Interest', slug: 'simple-vs-compound-interest', desc: 'Interest on the principal only vs interest on interest. The second one is how fortunes — and debts — snowball.' },
  { emoji: '🏎️', title: 'Speed vs Velocity', slug: 'speed-vs-velocity', desc: 'Speed is how fast. Velocity is how fast and in what direction. Physics cares. Your GPS cares. You should too.' },
  { emoji: '🕳️', title: 'Stalactite vs Stalagmite', slug: 'stalactite-vs-stalagmite', desc: 'Stalactites hang from the ceiling; stalagmites rise from the ground. Memory tricks and what happens when they meet.' },
  { emoji: '💞', title: 'Sympathy vs Empathy', slug: 'sympathy-vs-empathy', desc: 'Feeling for someone from the outside vs feeling with them by sharing their perspective. Empathy takes more work.' },
  { emoji: '🐢', title: 'Tortoise vs Turtle', slug: 'tortoise-vs-turtle', desc: 'Tortoises live on land, turtles in water. Shell shape, feet, lifespan — plus the British vs American naming confusion.' },
  { emoji: '🌊', title: 'Tsunami vs Tidal Wave', slug: 'tsunami-vs-tidal-wave', desc: 'One is caused by earthquakes, the other is a misnomer. Spoiler: \'tidal wave\' is basically wrong.' },
  { emoji: '🇬🇧', title: 'UK vs Great Britain vs England', slug: 'uk-vs-great-britain-vs-england', desc: 'England is one nation; Great Britain is the island; the UK adds Northern Ireland. They\'re not synonymous.' },
  { emoji: '🥗', title: 'Vegan vs Vegetarian', slug: 'vegan-vs-vegetarian', desc: 'What each diet excludes, the types of vegetarianism, and the nutrition considerations for both.' },
  { emoji: '🐍', title: 'Venomous vs Poisonous', slug: 'venomous-vs-poisonous', desc: 'It\'s all about delivery. Venom is injected; poison is ingested or touched. Snakes are venomous, not poisonous.' },
  { emoji: '🦠', title: 'Virus vs Bacteria', slug: 'virus-vs-bacteria', desc: 'Two very different invaders. One has cells, one hijacks yours — and antibiotics only work on one.' },
  { emoji: '🐝', title: 'Wasp vs Bee vs Hornet', slug: 'wasp-vs-bee-vs-hornet', desc: 'Furry pollinators vs sleek repeat-stingers vs large wasps. How to tell them apart before you get too close.' },
  { emoji: '🌦️', title: 'Weather vs Climate', slug: 'weather-vs-climate', desc: 'Your mood vs your personality. One changes daily, one defines a region over decades.' },
  { emoji: '🥃', title: 'Whisky vs Whiskey', slug: 'whisky-vs-whiskey', desc: 'The spelling varies by country: Scotland and Japan drop the \'e\', Ireland and America keep it. Both are correct.' },
]

const FAQ_ITEMS = [
  {
    q: 'What\'s the difference between a meteor and a meteorite?',
    a: 'A meteor is the streak of light you see when a space rock burns up in Earth\'s atmosphere — what most people call a "shooting star." If the rock survives the journey and hits the ground, it becomes a meteorite. A meteoroid is the rock before it enters the atmosphere.',
  },
  {
    q: 'Is venom the same as poison?',
    a: 'No. Venom is injected (by bite or sting). Poison is ingested or absorbed through the skin. A venomous snake bites you. A poisonous frog is dangerous if you touch or eat it. Some animals are both. Many people use the words interchangeably, but biologists care deeply about the distinction.',
  },
  {
    q: 'What\'s the actual difference between weather and climate?',
    a: 'Weather is what\'s happening outside right now — temperature, precipitation, wind. Climate is the long-term pattern of weather in a region, typically measured over 30+ years. A classic line: "Climate is what you expect. Weather is what you get."',
  },
]

const CHEVRON_SVG = (
  <svg viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
    <polyline points="6 9 12 15 18 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function VsPage() {
  const { navigate, onPlayClick } = useApp()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    document.title = 'vs Comparisons — 49 Commonly Confused Terms Explained | SmartAss Facts'
    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (canonical) canonical.href = 'https://smartassfacts.com/facts/vs/'
    document.documentElement.setAttribute('data-prerender-ready', 'true')
  }, [])

  return (
    <div className="vs-page">
      {/* Hero */}
      <div className="vs-hero">
        <div className="vs-hero__inner">
          <nav className="vs-breadcrumb">
            <a href="/" onClick={e => { e.preventDefault(); navigate('/') }}>Home</a>
            <span>›</span>
            <span>vs Comparisons</span>
          </nav>
          <div className="vs-hero__icon">⚖️</div>
          <h1 className="vs-hero__h1">vs Comparisons</h1>
          <p className="vs-hero__sub">
            The clearest answer to &ldquo;what&rsquo;s the difference between X and Y?&rdquo;
            49 pairs. Every distinction explained.
          </p>

          <div className="vs-stats">
            <div className="vs-stat">
              <span className="vs-stat__num">49</span>
              <span className="vs-stat__label">Comparisons</span>
            </div>
            <div className="vs-stat">
              <span className="vs-stat__num">196</span>
              <span className="vs-stat__label">Distinctions Documented</span>
            </div>
            <div className="vs-stat">
              <span className="vs-stat__num">196</span>
              <span className="vs-stat__label">FAQs Answered</span>
            </div>
          </div>

          <button className="vs-btn vs-btn--primary" onClick={() => onPlayClick('For You')}>
            ▶ Play Now
          </button>
        </div>
      </div>

      {/* Comparisons grid */}
      <div className="vs-section">
        <div className="vs-section__inner">
          <h2 className="vs-section__title">All Comparisons</h2>
          <p className="vs-section__sub">
            Concise, jargon-free explanations for the pairs people mix up most.
          </p>
          <div className="vs-grid">
            {COMPARISONS.map((item, i) => (
              // Plain anchor (no router navigate): the target is a static HTML
              // page served from /public, so a full page load is the right move.
              <a key={i} className="vs-card" href={`/facts/vs/${item.slug}/`}>
                <div className="vs-card__emoji">{item.emoji}</div>
                <div className="vs-card__body">
                  <span className="vs-card__badge">⚖️ Comparison</span>
                  <h3 className="vs-card__title">{item.title}</h3>
                  <p className="vs-card__desc">{item.desc}</p>
                  <span className="vs-card__more">Read the full comparison →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="vs-faq-section">
        <div className="vs-faq__inner">
          <h2 className="vs-section__title">Common Questions</h2>
          <p className="vs-section__sub">Tap to expand.</p>
          <div className="vs-faq-list">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className={`vs-faq-item ${openFaq === i ? 'vs-faq-item--open' : ''}`}>
                <button
                  type="button"
                  className="vs-faq-q"
                  onClick={() => setOpenFaq(prev => prev === i ? null : i)}
                >
                  <span>{item.q}</span>
                  <span className="vs-faq-chevron" style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    {CHEVRON_SVG}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="vs-faq-a">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="vs-cta-section">
        <div className="vs-cta-box">
          <h2>Think you can spot the difference?</h2>
          <p>Put your knowledge to the test — play Fake or Fact and see how many you really know.</p>
          <button className="vs-btn vs-btn--primary" onClick={() => onPlayClick('For You')}>
            ▶ Play Now
          </button>
        </div>
      </div>
    </div>
  )
}
