'use client'

import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import '../styles/MythsPage.scss'

const MYTHS = [
  { emoji: '🧠', title: 'You Only Use 10% of Your Brain', desc: 'False. You use virtually all of your brain, continuously. Brain imaging studies using fMRI and PET scans show all regions are active during normal daily tasks.' , slug: 'you-only-use-10-percent-of-your-brain' },
  { emoji: '🐠', title: 'Goldfish Have 3-Second Memories', desc: 'False. Goldfish can retain memories for months, not seconds. Controlled studies at Plymouth University trained goldfish to navigate mazes and remember results for months.' , slug: 'goldfish-have-three-second-memories' },
  { emoji: '🧱', title: 'The Great Wall of China Is Visible from Space', desc: 'False. The Great Wall cannot be seen by the naked eye from low Earth orbit. At its widest, the wall is only about 9 metres — far too narrow to resolve without optical aid.' , slug: 'great-wall-of-china-visible-from-space' },
  { emoji: '🤚', title: 'Cracking Your Knuckles Causes Arthritis', desc: 'False. No scientific study has found a causal link between knuckle cracking and arthritis. The most famous self-experiment — 60 years, one hand only — found no difference.' , slug: 'cracking-knuckles-causes-arthritis' },
  { emoji: '⚡', title: 'Lightning Never Strikes the Same Place Twice', desc: 'False. Lightning routinely strikes the same location many times. The Empire State Building is struck by lightning around 20–25 times per year.' , slug: 'lightning-never-strikes-the-same-place-twice' },
  { emoji: '👁️', title: 'Reading in Dim Light Ruins Your Eyesight', desc: 'False. Reading in dim light causes temporary eye strain and fatigue, but no clinical evidence shows it causes any lasting damage to vision.' , slug: 'reading-in-dim-light-ruins-your-eyesight' },
  { emoji: '👤', title: 'Napoleon Bonaparte Was Unusually Short', desc: 'False. Napoleon was approximately 5 feet 7 inches tall (170 cm), which was average for a French man of his era. The confusion arose from a mix-up between French and English inches.' , slug: 'napoleon-was-very-short' },
  { emoji: '🕷️', title: 'Humans Swallow 8 Spiders Per Year in Their Sleep', desc: 'False. There is no scientific evidence that humans routinely swallow spiders in their sleep. The vibrations, heat, and CO₂ from sleeping humans actively repel spiders.' , slug: 'humans-swallow-spiders-in-their-sleep' },
  { emoji: '🐂', title: 'Bulls Are Enraged by the Color Red', desc: 'False. Cattle are red-green colorblind and cannot distinguish red from green. Bulls in bullfighting react to the movement of the cape, not its colour.' , slug: 'bulls-are-enraged-by-the-color-red' },
  { emoji: '🫀', title: 'Humans Have Only Five Senses', desc: 'False. Humans have far more than five senses. Depending on how strictly you define a "sense," modern neuroscience counts between 9 and 21 — including proprioception, thermoception, and vestibular sense.' , slug: 'we-have-only-five-senses' },
  { emoji: '🍬', title: 'Sugar Makes Kids Hyperactive', desc: 'False. More than a dozen double-blind, placebo-controlled trials have found no link between sugar consumption and hyperactivity in children. The effect appears to be entirely in the parents\' expectations.' , slug: 'sugar-makes-kids-hyperactive' },
  { emoji: '🧢', title: 'You Lose Most Body Heat Through Your Head', desc: 'False. Heat loss is proportional to the surface area of skin exposed. The human head represents roughly 10% of total body surface — no more heat escapes through it than any other uncovered area.' , slug: 'you-lose-most-heat-through-your-head' },
  { emoji: '🦇', title: 'Bats Are Blind', desc: 'False. All known bat species have functional eyes and can see. Many have good low-light vision. Microbats use echolocation to navigate in darkness, but that does not mean they are blind.' , slug: 'bats-are-blind' },
  { emoji: '📐', title: 'Einstein Failed Math in School', desc: 'False. Einstein did not fail mathematics. He mastered calculus before the age of 15 and consistently excelled in maths and physics. The myth stems from a misreading of the Swiss grading system.' , slug: 'einstein-failed-math-in-school' },
  { emoji: '🪒', title: 'Shaving Makes Hair Grow Back Thicker and Darker', desc: 'False. Shaving has no effect on hair thickness, colour, or growth rate. This has been confirmed by multiple controlled studies. The blunt cut just makes regrown hair feel stubbly.' , slug: 'shaving-makes-hair-grow-back-thicker' },
  { emoji: '🫧', title: 'Swallowed Chewing Gum Stays in Your Stomach for 7 Years', desc: 'False. Swallowed gum does not remain in the stomach for 7 years. While the gum base is indigestible, it moves through the digestive system normally and is excreted within days.' , slug: 'chewing-gum-stays-in-stomach-seven-years' },
  { emoji: '🩸', title: 'Blood in Your Veins Is Blue', desc: 'False. Human blood is always red. Oxygenated arterial blood is bright red; deoxygenated venous blood is a darker red. Veins appear blue through skin because of how skin tissue absorbs light.' , slug: 'blood-in-veins-is-blue' },
  { emoji: '🥃', title: 'Alcohol Warms You Up in Cold Weather', desc: 'False, and dangerously so. Alcohol causes vasodilation — widening of blood vessels near the skin — which produces a sensation of warmth but actually accelerates core body heat loss.' , slug: 'alcohol-warms-you-up' },
  { emoji: '🐕', title: 'Dogs Are Completely Colourblind', desc: 'Misleading. Dogs are not completely colourblind — they have dichromatic colour vision and can distinguish blue from yellow. They simply cannot distinguish red from green.' , slug: 'dogs-are-completely-colorblind' },
  { emoji: '🪙', title: 'A Penny Dropped from a Skyscraper Can Kill Someone', desc: 'False. A penny dropped from a skyscraper cannot kill anyone. Due to its flat, tumbling shape, a penny reaches a terminal velocity of only about 40–50 km/h — painful, not lethal.' , slug: 'penny-dropped-from-skyscraper-can-kill' },
  { emoji: '🧩', title: 'People Are Either Left-Brained or Right-Brained', desc: 'False. Brain imaging of over 1,000 people found no evidence that individuals preferentially use one hemisphere. Both hemispheres work together for almost every cognitive function.' , slug: 'left-brain-right-brain-personality' },
  { emoji: '💧', title: 'You Must Drink 8 Glasses of Water a Day', desc: 'False. The "8 glasses a day" rule has no scientific basis. Daily fluid requirements vary significantly by body size, climate, activity level, and diet. Much hydration comes from food.' , slug: 'drink-eight-glasses-of-water-a-day' },
  { emoji: '💀', title: 'Hair and Nails Continue to Grow After Death', desc: 'False. Hair and nails do not grow after death. Growth requires active cellular metabolism. What happens is the skin dehydrates and retracts, making hair and nails appear longer.' , slug: 'hair-nails-grow-after-death' },
  { emoji: '🤧', title: 'Cold Weather Causes the Common Cold', desc: 'False. The common cold is caused by viruses — primarily rhinoviruses — not by cold temperatures. You cannot catch a cold from being cold. Viruses spread through contact, not weather.' , slug: 'cold-weather-causes-colds' },
  { emoji: '🐦', title: 'Touching a Baby Bird Makes Its Mother Reject It', desc: 'False. Most bird species have a very limited sense of smell and cannot detect human scent on their young. Birds do not abandon chicks simply because a human has touched them.' , slug: 'touching-baby-bird-mother-rejects-it' },
  { emoji: '👅', title: 'Different Parts of the Tongue Taste Different Flavours', desc: 'False. The "tongue map" showing sweet at the tip and bitter at the back is a misrepresentation. Taste buds capable of detecting all flavours are distributed across the entire tongue.' , slug: 'tongue-taste-map-different-zones' },
  { emoji: '🥕', title: 'Carrots Improve Your Eyesight', desc: 'Misleading. Carrots are rich in beta-carotene, which the body converts to vitamin A — essential for retinal function. But eating more carrots than needed does not improve sight beyond normal.' , slug: 'carrots-improve-eyesight' },
  { emoji: '🦤', title: 'Ostriches Bury Their Heads in the Sand', desc: 'False. Ostriches do not bury their heads in the sand. An ostrich that buried its head would suffocate. They do lower their heads to turn eggs in ground nests — this may have inspired the myth.' , slug: 'ostriches-bury-heads-in-sand' },
  { emoji: '🍊', title: 'High-Dose Vitamin C Prevents the Common Cold', desc: 'Misleading. For most people, taking high-dose vitamin C does not prevent colds. Large meta-analyses show it may reduce duration by about half a day in adults, not prevent infection.' , slug: 'vitamin-c-prevents-colds' },
  { emoji: '🫁', title: 'We Experience Taste Only Through Our Tongue', desc: 'False. Taste buds are not limited to the tongue — they also exist on the soft palate, epiglottis, upper oesophagus, and even the gut. Smell contributes up to 80% of what we perceive as taste.' , slug: 'we-taste-with-our-tongue-alone' },
  { emoji: '🐪', title: 'Camels Store Water in Their Humps', desc: 'False. Humps store fat, not water. Camels manage dehydration through specialised oval-shaped blood cells and the ability to tolerate losing 30% of their body water without harm.' , slug: 'camels-store-water-in-their-humps' },
  { emoji: '💎', title: 'Diamonds Are Made from Coal', desc: 'False. Most diamonds formed 1–3 billion years ago deep in the mantle, long before coal-forming land plants even existed. They are made from carbon under extreme heat and pressure.' , slug: 'diamonds-are-made-of-coal' },
  { emoji: '🐒', title: 'Humans Evolved from Chimpanzees', desc: 'False. Humans and chimps share a common ancestor from approximately 6–7 million years ago. We are evolutionary cousins, not direct descendants of modern chimpanzees.' , slug: 'humans-evolved-from-chimpanzees' },
  { emoji: '🌍', title: 'Seasons Are Caused by Earth\'s Distance from the Sun', desc: 'False. Seasons result from Earth\'s 23.5° axial tilt — not distance. Earth is actually closest to the Sun in January, during Northern Hemisphere winter.' , slug: 'seasons-caused-by-distance-from-sun' },
  { emoji: '🏊', title: 'Eating Before Swimming Causes Dangerous Cramps', desc: 'False. No scientific evidence supports this rule. The American Red Cross formally abandoned this advice. Exercise after a large meal may cause discomfort, not dangerous cramps.' , slug: 'eating-before-swimming-causes-cramps' },
  { emoji: '🕸️', title: 'Daddy Long-Legs Are the Most Venomous Spider', desc: 'False on two counts. Harvestmen (the most common "daddy long-legs") are not spiders and have no venom glands at all. Cellar spiders have mild venom that poses no threat to humans.' , slug: 'daddy-long-legs-most-venomous-spider' },
  { emoji: '🦎', title: 'Chameleons Change Colour to Blend In', desc: 'Mostly false. Colour change in chameleons is primarily for temperature regulation and social signalling — communicating mood and dominance. Camouflage is a secondary benefit.' , slug: 'chameleons-change-color-to-blend-in' },
  { emoji: '💊', title: 'Antibiotics Can Treat Viral Infections', desc: 'False. Antibiotics only work on bacteria. They have zero effect on viruses. Misuse and overuse of antibiotics is a leading driver of dangerous antibiotic-resistant bacteria.' , slug: 'antibiotics-can-treat-viral-infections' },
  { emoji: '🏔️', title: 'Mount Everest Is the Tallest Mountain on Earth', desc: 'It depends on the measure. Everest is highest above sea level (8,849 m). Mauna Kea is tallest base-to-summit. Chimborazo in Ecuador is furthest from Earth\'s centre due to the equatorial bulge.' , slug: 'mount-everest-is-the-tallest-mountain' },
  { emoji: '🍺', title: 'Alcohol Kills Brain Cells', desc: 'False as stated. Alcohol disrupts synaptic signalling but does not kill neurons at typical drinking doses. Long-term brain damage from chronic heavy drinking occurs mainly through thiamine deficiency.' , slug: 'alcohol-kills-brain-cells' },
  { emoji: '⚡', title: 'Lightning Rods Attract Lightning', desc: 'False. Lightning rods do not attract lightning — they intercept strikes that would occur regardless and safely conduct the energy to ground, protecting the building.' , slug: 'lightning-rods-attract-lightning' },
  { emoji: '🔧', title: 'Humans Are the Only Animals That Use Tools', desc: 'False. Chimpanzees, crows, sea otters, dolphins, elephants, and even some fish use tools. Several species also manufacture tools from raw materials — not just pick them up.' , slug: 'humans-are-only-animals-that-use-tools' },
  { emoji: '💉', title: 'Vaccines Cause Autism', desc: 'False. The 1998 Wakefield paper claiming this was retracted as fraudulent. Dozens of independent studies across millions of children have found no link between vaccines and autism.' , slug: 'vaccines-cause-autism' },
  { emoji: '💪', title: 'The Tongue Is the Strongest Muscle in the Body', desc: 'False. The masseter (jaw muscle) generates the most force. The heart does the most sustained work. The glutes move the most mass. The tongue holds no absolute strength record.' , slug: 'tongue-is-the-strongest-muscle' },
  { emoji: '😴', title: 'Waking a Sleepwalker Is Dangerous', desc: 'False. Waking a sleepwalker causes brief confusion and disorientation, not serious harm. The real danger is leaving them asleep to walk into hazards.' , slug: 'waking-a-sleepwalker-is-dangerous' },
  { emoji: '🐕', title: 'Dogs\' Mouths Are Cleaner Than Human Mouths', desc: 'False as a comparison. Dogs\' mouths contain a different bacterial community from humans, not a smaller one. They routinely contact faeces, decaying matter, and soil.' , slug: 'dogs-mouths-are-cleaner-than-humans' },
  { emoji: '🥩', title: 'Searing Meat Seals In the Juices', desc: 'False. Searing creates no moisture barrier — seared meat loses just as much moisture as unseared. Its real value is the Maillard reaction, which creates hundreds of complex flavour compounds.' , slug: 'searing-meat-seals-in-juices' },
  { emoji: '🚽', title: 'Toilet Flushes Differently in the Southern Hemisphere', desc: 'False. Flush direction is determined by the toilet\'s inlet jets, not the hemisphere. The Coriolis effect on a toilet bowl is approximately 10 million times too weak to influence the direction.' , slug: 'toilet-flushes-differently-in-southern-hemisphere' },
  { emoji: '🍕', title: 'The Five-Second Rule Makes Dropped Food Safe', desc: 'False. Bacteria transfer on contact, not after five seconds. A Rutgers University study found contamination in every single trial, including at under one second of contact.' , slug: 'five-second-rule-food-is-safe' },
  { emoji: '📡', title: 'Microwave Ovens Cook Food From the Inside Out', desc: 'False. Microwaves penetrate 1–3 cm and heat the outer layers first; heat then conducts inward. This is why the outside of food is hot while the centre remains cold.' , slug: 'microwave-ovens-cook-food-from-inside-out' },
  { emoji: '🥠', title: 'Fortune Cookies Are Chinese', desc: 'False. Fortune cookies were invented by Japanese-Americans in California in the early 1900s. They are virtually unknown as a traditional food in China.' , slug: 'fortune-cookies-are-chinese' },
]

const FAQ_ITEMS = [
  {
    q: 'What is a common myth about the human brain?',
    a: 'The claim that humans only use 10% of their brain. Brain imaging studies confirm all brain regions are active during normal daily life — the 10% figure has no scientific origin.',
  },
  {
    q: 'Is it true that goldfish have 3-second memories?',
    a: 'No. Research at Plymouth University showed goldfish can retain memories for months, not seconds. They were trained to navigate mazes and remembered the routes long-term.',
  },
  {
    q: 'Can you really see the Great Wall of China from space?',
    a: 'No. The wall is at most 9 metres wide — far too narrow to be resolved by the naked eye from orbital altitude. Even Chinese astronaut Yang Liwei confirmed he could not see it.',
  },
]

const CHEVRON = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function MythsPage() {
  const { navigate, onPlayClick } = useApp()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    document.title = 'Myths Debunked — 51 Popular Myths That Are Completely False | SmartAss Facts'
    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (canonical) canonical.href = 'https://smartassfacts.com/facts/myths/'
    document.documentElement.setAttribute('data-prerender-ready', 'true')
  }, [])

  return (
    <div className="myths-page">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="myths-hero">
        <div className="myths-hero__inner">
          <nav className="myths-breadcrumb">
            <a href="/" onClick={e => { e.preventDefault(); navigate('/') }}>Home</a>
            <span>›</span>
            <span>Myths Debunked</span>
          </nav>
          <div className="myths-hero__icon">🔬</div>
          <h1 className="myths-hero__h1">Myths Debunked</h1>
          <p className="myths-hero__sub">Popular beliefs examined with primary sources — and found to be completely false.</p>
          <p className="myths-hero__body">
            Some of the most confidently repeated "facts" are myths. The brain myth, the goldfish memory
            myth, the lightning myth — each has been circulating for decades despite being directly
            contradicted by peer-reviewed research. Every entry here includes the actual science and the
            exact origin of the wrong belief.
          </p>
          <div className="myths-stats">
            <div className="myths-stat"><span className="myths-stat__num">51</span><span className="myths-stat__label">Myths Debunked</span></div>
            <div className="myths-stat"><span className="myths-stat__num">100%</span><span className="myths-stat__label">Primary Sources</span></div>
            <div className="myths-stat"><span className="myths-stat__num">130</span><span className="myths-stat__label">Citations</span></div>
          </div>
          <button className="myths-play-btn" onClick={() => onPlayClick('For You')}>▶ Play Now</button>
        </div>
      </div>

      {/* ── Myth cards ───────────────────────────────────────────── */}
      <div className="myths-grid-section">
        <div className="myths-grid">
          {MYTHS.map((m, i) => (
            // Plain anchor (no router navigate): the target is a static HTML
            // page served from /public, so a full page load is the right move.
            <a key={i} className="myth-card" href={`/facts/myths/${m.slug}/`}>
              <div className="myth-card__emoji">{m.emoji}</div>
              <div className="myth-card__body">
                <span className="myth-card__badge">✗ MYTH</span>
                <h3 className="myth-card__title">{m.title}</h3>
                <p className="myth-card__desc">{m.desc}</p>
                <span className="myth-card__more">Read the full debunk →</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <div className="myths-faq">
        <div className="myths-faq__inner">
          <h2 className="myths-faq__heading">Common Questions</h2>
          <div className="myths-faq__list">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="myths-faq__item">
                <button
                  className="myths-faq__q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{item.q}</span>
                  <span className={`myths-faq__chevron ${openFaq === i ? 'myths-faq__chevron--open' : ''}`}>{CHEVRON}</span>
                </button>
                {openFaq === i && (
                  <div className="myths-faq__a"><p>{item.a}</p></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <div className="myths-cta">
        <div className="myths-cta__box">
          <h2>Think You Can Spot the Fake?</h2>
          <p>These myths show up in our game. Can you beat 7 out of 10?</p>
          <button className="myths-play-btn" onClick={() => onPlayClick('For You')}>▶ Play Now</button>
        </div>
      </div>
    </div>
  )
}
