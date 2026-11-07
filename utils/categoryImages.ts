// sa_category → square (400×400) sticker art in /public/category-images.
// Used by the comic screens and the share-card generator.
const FILES: Record<string, string> = {
  'Artificial Unintelligence': 'Artificial Unintelligence',
  'Astronaughty': 'Astronaughty',
  'Booked & Bewildered': 'Booked & Bewildered',
  'Bricks & Banter': 'Bricks & Banter',
  'Cognitive Dissonantics': 'Cognitive Dissonantics',
  'Crashed Joystick': 'Crashed Joystick',
  'Culture Shock Therapy': 'Culture Shock Therapy',
  'Democrazy in Action': 'Democrazy in Action',
  'Fame & Blame': 'Fame & Blame',
  'Fit Happens': 'Fit Happens',
  'Forking Controversies': 'Forking Controversies',
  'Form Meets Dysfunction': 'Form Meets Dysfunctiond',
  'Freud & Error': 'Freud & Error',
  'Fur Real?': 'Fur Real',
  'Game of the day': 'Game of the day3',
  'Giggle Epiphany': 'Giggle Epiphany',
  'Grammar Crimes Division': 'Grammar Crimes Division',
  'Gray Matter, No Chatter': 'Gray Matter, No Chatter',
  'Green, Mean, and Unseen': 'Green, Mean, and Unseen',
  'Gym & Tonic': 'Gym & Tonic',
  'Holy Sh*t': 'Holy Sht2',
  'Homo Sillyence': 'Homo Sillyence',
  'Horsepower & Sass': 'Horsepower & Sass',
  'In Debt We Trust': 'In Debt We Trust',
  'Jet Lag & Bragging Rights': 'Jet Lag & Bragging Rights',
  'Longitude? Attitude': 'Longitude Attitude',
  'Nerds Gone Wild': 'Nerds Gone Wild',
  'Offbeat Brilliance': 'Offbeat Brilliance',
  'Past Drama': 'Past Drama',
  'Patent Pending Insanity': 'Patent Pending Insanity',
  'Peak Weirdness': 'Peak Weirdness',
  'Popcorn & Plot Holes': 'Popcorn & Plot Holes',
  'Quantum Snark': 'Quantum Snark',
  'Rude Numbers': 'Rude Numbers',
  'Vogue & Vexed': 'Vogue & Vexed',
}

/** Encoded URL of the category's square art, or null (e.g. "For You"). */
export function getCategoryArt(category: string): string | null {
  const f = FILES[category]
  return f ? `/category-images/${encodeURIComponent(f)}.webp` : null
}
