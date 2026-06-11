// Shared, framework-agnostic helpers for the /facts/* SEO pages. No browser or
// React APIs, so both Server Components (routes + generateMetadata) and Client
// Components can import them.

// internal category slug → branded saCategory display name
export const CATEGORY_DISPLAY: Record<string, string> = {
  'arts':                   'Culture Shock Therapy',
  'cars':                   'Horsepower & Sass',
  'construction':           'Bricks & Banter',
  'countries':              'Longitude? Attitude',
  'design':                 'Form Meets Dysfunction',
  'famous-people':          'Fame & Blame',
  'fashion':                'Vogue & Vexed',
  'finance':                'In Debt We Trust',
  'food':                   'Forking Controversies',
  'games':                  'Crashed Joystick',
  'geography':              'Longitude? Attitude',
  'guinness-world-records': 'Peak Weirdness',
  'health':                 'Fit Happens',
  'history':                'Past Drama',
  'human-brain':            'Gray Matter, No Chatter',
  'humans':                 'Homo Sillyence',
  'humour':                 'Giggle Epiphany',
  'inventions':             'Patent Pending Insanity',
  'languages':              'Grammar Crimes Division',
  'literature':             'Booked & Bewildered',
  'mathematics':            'Rude Numbers',
  'movies':                 'Popcorn & Plot Holes',
  'music':                  'Offbeat Brilliance',
  'nature':                 'Green, Mean, and Unseen',
  'people':                 'Homo Sillyence',
  'pets-animals':           'Fur Real?',
  'philosophy':             'Cognitive Dissonantics',
  'physics':                'Quantum Snark',
  'politics':               'Democrazy in Action',
  'psychology':             'Freud & Error',
  'religion':               'Holy Sh*t',
  'science':                'Nerds Gone Wild',
  'space':                  'Astronaughty',
  'sports':                 'Gym & Tonic',
  'technology':             'Artificial Unintelligence',
  'topics':                 'Peak Weirdness',
  'travel':                 'Jet Lag & Bragging Rights',
}

export function getDisplayName(slug: string): string {
  return (
    CATEGORY_DISPLAY[slug] ||
    slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  )
}

export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/\//g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

// "<id>-<slugified-fact>" (no leading path)
export function buildFactSlug(id: number, saFact: string): string {
  const slug = saFact
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60)
    .replace(/-+$/, '')
  return `${id}-${slug}`
}

// full path "/facts/<cat>/<id>-<slug>"
export function buildRelatedSlug(id: number, saFact: string, category: string): string {
  return `/facts/${categoryToSlug(category)}/${buildFactSlug(id, saFact)}`
}
