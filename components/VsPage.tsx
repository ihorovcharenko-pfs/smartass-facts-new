'use client'

import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import '../styles/VsPage.scss'

const COMPARISONS = [
  { emoji: '☄️', title: 'Meteor vs Meteorite', desc: 'One burns up, one lands. Know which is which before your next pub quiz.' },
  { emoji: '🐍', title: 'Venom vs Poison', desc: 'It\'s all about delivery. One bites you, one you eat — and only one is technically "venomous."' },
  { emoji: '🌦️', title: 'Weather vs Climate', desc: 'Your mood vs your personality. One changes daily, one defines a region over decades.' },
  { emoji: '🦠', title: 'Virus vs Bacteria', desc: 'Two very different invaders. One has cells, one hijacks yours — and antibiotics only work on one.' },
  { emoji: '🧠', title: 'Intelligence vs Wisdom', desc: 'Knowing the answer vs knowing when to use it. They\'re not the same thing.' },
  { emoji: '🌊', title: 'Tsunami vs Tidal Wave', desc: 'One is caused by earthquakes, the other is a misnomer. Spoiler: "tidal wave" is basically wrong.' },
  { emoji: '🔴', title: 'Red Dwarf vs Red Giant', desc: 'Two very different life stages of stars. One is tiny and cool, one is enormous and dying.' },
  { emoji: '🌍', title: 'Continents vs Subcontinent', desc: 'India is technically a subcontinent — but what does that even mean? More nuanced than you think.' },
  { emoji: '🐬', title: 'Dolphin vs Porpoise', desc: 'Most people can\'t tell them apart. The differences are subtle but real — and dolphins are more talkative.' },
  { emoji: '🦈', title: 'Shark vs Dolphin', desc: 'Fish vs mammal. One breathes underwater, one surfaces for air. One is feared, one is loved — unfairly so on both counts.' },
  { emoji: '⚡', title: 'Speed vs Velocity', desc: 'Both involve movement, but only one has direction. Physics cares. Your GPS cares. You should too.' },
  { emoji: '🧲', title: 'Mass vs Weight', desc: 'You weigh less on the moon. Your mass doesn\'t change. These two words are not interchangeable.' },
  { emoji: '🔬', title: 'Cell vs Atom', desc: 'One is the building block of life, one is the building block of matter. Scale: unimaginably different.' },
  { emoji: '🌡️', title: 'Heat vs Temperature', desc: 'Temperature measures energy intensity. Heat is energy transferred. Hot coffee in a big pool vs a small cup.' },
  { emoji: '🧪', title: 'Element vs Compound', desc: 'Pure substance vs two-or-more-things-bonded. Water is a compound. Oxygen is an element. Simple but often confused.' },
  { emoji: '🏔️', title: 'Mountain vs Hill', desc: 'There\'s no universally agreed height difference. Countries define it differently — and it causes arguments.' },
  { emoji: '🌋', title: 'Lava vs Magma', desc: 'Same molten rock, different location. Underground: magma. Above ground: lava. Location is everything.' },
  { emoji: '🌿', title: 'Plant vs Tree', desc: 'All trees are plants, but not all plants are trees. The distinction is about woody stems and height.' },
  { emoji: '🍄', title: 'Mushroom vs Fungus', desc: 'A mushroom is the fruiting body of a fungus. The fungus is the whole organism — mostly hidden underground.' },
  { emoji: '🦋', title: 'Butterfly vs Moth', desc: 'Both are Lepidoptera but night vs day is just the start. Antennae, body shape, and cocoons also differ.' },
  { emoji: '🐊', title: 'Crocodile vs Alligator', desc: 'Snout shape is the classic tell. Crocodiles have pointy V-shaped snouts. Alligators have wide U-shaped ones.' },
  { emoji: '🦁', title: 'Lion vs Tiger', desc: 'The two biggest cats in the world, but built for completely different habitats and hunting styles.' },
  { emoji: '🐘', title: 'African vs Asian Elephant', desc: 'Ear size, head shape, tusk presence — they\'re more different than most people realise.' },
  { emoji: '🐦', title: 'Crow vs Raven', desc: 'Ravens are bigger and smarter. Crows are sneakier and more social. Both are disturbingly intelligent.' },
  { emoji: '🍷', title: 'Red vs White Wine', desc: 'It\'s not just the grape colour. The fermentation process, tannins, and serving temperature all differ fundamentally.' },
  { emoji: '☕', title: 'Coffee vs Espresso', desc: 'Espresso is a brewing method, not a bean type. Stronger per ml, but a flat white has more caffeine than a shot.' },
  { emoji: '🍺', title: 'Ale vs Lager', desc: 'Top-fermented vs bottom-fermented. Temperature and yeast type make all the difference.' },
  { emoji: '🍫', title: 'Cocoa vs Cacao', desc: 'One is raw and minimally processed. One is roasted and heat-treated. The health claims depend on which you\'re eating.' },
  { emoji: '🧈', title: 'Butter vs Margarine', desc: 'Dairy fat vs vegetable oil. The great fat debate that\'s been raging since the 1970s — with plot twists.' },
  { emoji: '🍬', title: 'Sugar vs Sweetener', desc: 'Caloric vs non-caloric. The science of whether one is actually better for you is more complicated than labels suggest.' },
  { emoji: '💊', title: 'Antibiotic vs Antiviral', desc: 'One kills bacteria, one disrupts viral replication. Using one for the other is how resistance spreads.' },
  { emoji: '🩺', title: 'Symptom vs Sign', desc: 'A symptom is what you feel. A sign is what a doctor observes. Pain is a symptom. Fever is a sign.' },
  { emoji: '🧬', title: 'DNA vs RNA', desc: 'Both carry genetic instructions, but RNA is the messenger. mRNA vaccines taught the world about this in 2021.' },
  { emoji: '🏋️', title: 'Aerobic vs Anaerobic', desc: 'With oxygen vs without. Running a marathon vs sprinting 100m. Two completely different energy systems.' },
  { emoji: '🧘', title: 'Flexibility vs Mobility', desc: 'Flexibility is passive range of motion. Mobility is active control. You can be flexible but immobile.' },
  { emoji: '💤', title: 'Sleep vs Rest', desc: 'Rest relaxes your body. Sleep resets your brain. You can rest without sleeping, but not the reverse.' },
  { emoji: '📱', title: 'App vs Software', desc: 'Software is the broad category. Apps are a subset designed for end users on specific platforms.' },
  { emoji: '🖥️', title: 'RAM vs Storage', desc: 'RAM is your desk space — fast but temporary. Storage is your filing cabinet — slow but permanent.' },
  { emoji: '🔒', title: 'Encryption vs Hashing', desc: 'Encryption is reversible. Hashing is one-way. Your password should be hashed, never encrypted.' },
  { emoji: '🌐', title: 'Internet vs Web', desc: 'The internet is the infrastructure. The web is what you browse on it. Email uses the internet but not the web.' },
  { emoji: '📊', title: 'Data vs Information', desc: 'Raw numbers vs interpreted meaning. 42 is data. "42% of users bounce in 3 seconds" is information.' },
  { emoji: '📈', title: 'Revenue vs Profit', desc: 'Revenue is what comes in. Profit is what\'s left after expenses. A company can have huge revenue and still go bankrupt.' },
  { emoji: '💰', title: 'Price vs Value', desc: 'Price is what you pay. Value is what you get. The gap between them is where good deals — and bad ones — live.' },
  { emoji: '🏦', title: 'Savings vs Investment', desc: 'Savings preserve capital. Investments risk it for potential growth. Both are necessary. Neither is optional.' },
  { emoji: '📉', title: 'Recession vs Depression', desc: 'Two consecutive quarters of negative GDP growth vs a prolonged, severe economic downturn. One is bad, one is catastrophic.' },
  { emoji: '⚖️', title: 'Law vs Regulation', desc: 'Laws are passed by legislatures. Regulations are issued by agencies. Both are binding, but they come from different places.' },
  { emoji: '🗳️', title: 'Democracy vs Republic', desc: 'Direct democracy vs representative government. Most modern "democracies" are technically republics.' },
  { emoji: '📰', title: 'Opinion vs Fact', desc: 'A fact can be verified. An opinion is a judgment or perspective. Confusing these two is how misinformation spreads.' },
  { emoji: '🎭', title: 'Irony vs Sarcasm', desc: 'Irony is when reality contradicts expectation. Sarcasm is verbal irony used to mock. They\'re related but not the same.' },
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
              <div key={i} className="vs-card">
                <div className="vs-card__emoji">{item.emoji}</div>
                <div className="vs-card__body">
                  <span className="vs-card__badge">⚖️ Comparison</span>
                  <h3 className="vs-card__title">{item.title}</h3>
                  <p className="vs-card__desc">{item.desc}</p>
                </div>
              </div>
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
