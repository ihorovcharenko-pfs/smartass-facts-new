// Per-category SEO copy for /facts/[category] pages. `plain` is the keyword
// people actually search ("music facts"), unlike the branded saCategory names
// ("Offbeat Brilliance") which stay visible as flavor. `description` feeds the
// meta description (~155 chars); `intro` renders under the H1.
// Framework-agnostic on purpose: imported by both server routes and client components.

export type CategoryCopy = { plain: string; description: string; intro: string }

export const CATEGORY_COPY: Record<string, CategoryCopy> = {
  'arts': {
    plain: 'Arts',
    description: 'Surprising arts facts — painting, sculpture, ballet, museums and the world\'s strangest galleries. Every fact verified and labeled true or fake.',
    intro: 'From Renaissance fresco disasters to the economics of banana-based installations, these arts facts cover painting, sculpture, dance and the museums that house them — each one verified and labeled true or fake.',
  },
  'cars': {
    plain: 'Cars',
    description: 'Car facts worth repeating — from the first speeding ticket at 13 km/h to why early cars had no mirrors. Verified automotive trivia, labeled true or fake.',
    intro: 'The first car accident, the first speeding ticket, and everything absurd that happened between then and self-driving software — verified car facts, labeled true or fake.',
  },
  'construction': {
    plain: 'Construction',
    description: 'Construction facts from Roman concrete to modern skyscrapers — cathedrals that took 800 years and bricks that built civilization. Verified true or fake.',
    intro: 'Roman concrete that outlasts ours, cathedrals eight centuries in the making, and the surprisingly dramatic history of the humble brick — construction facts, verified and labeled.',
  },
  'design': {
    plain: 'Design',
    description: 'Design facts — from IKEA\'s founding story to why touch targets are 48 pixels. The hidden decisions behind everyday objects, verified true or fake.',
    intro: 'Why hamburger menus are called that, how IKEA really started, and the invisible rules governing every app you use — design facts, verified and labeled true or fake.',
  },
  'famous-people': {
    plain: 'Famous People',
    description: 'Facts about famous people — Cleopatra, Tesla, Einstein, Bruce Lee and more. Which stories are real and which are legend? Verified, labeled true or fake.',
    intro: 'Cleopatra lived closer to the moon landing than to the pyramids being built. Tesla, Twain, Bruce Lee, Joan of Arc — the verified stories and the legends, labeled true or fake.',
  },
  'fashion': {
    plain: 'Fashion',
    description: 'Fashion facts spanning 5,000 years — silk\'s Chinese origins, the navy roots of the pea coat, chokers in ancient Egypt. Verified true or fake.',
    intro: 'Silk was a Chinese state secret, the pea coat is naval issue, and chokers have cycled in and out of style since ancient Egypt — fashion facts, verified and labeled.',
  },
  'finance': {
    plain: 'Finance',
    description: 'Finance facts — the first bubble, the oldest recorded interest rates, and why a dollar today beats one tomorrow. Money history verified, true or fake.',
    intro: 'Interest predates coins, the first bubble involved tulips, and the time value of money runs everything — finance facts from Mesopotamia to the stock market, verified and labeled.',
  },
  'food': {
    plain: 'Food',
    description: 'Food facts — bananas are herbs, cashews grow on apples, gelato beats ice cream on density. Delicious trivia, every item verified true or fake.',
    intro: 'A banana plant is technically an herb, cashews grow on the bottom of a fruit, and the fear of peanut butter sticking to your palate has a name — food facts, verified and labeled.',
  },
  'games': {
    plain: 'Games',
    description: 'Gaming facts — Angry Birds\' 4 billion downloads, the first DLC, and the accidental origins of multiplayer. Video game history verified, true or fake.',
    intro: 'From billion-download birds to the sibling arguments that produced multiplayer gaming, these facts cover video games, board games and everything with a high score — verified and labeled.',
  },
  'geography': {
    plain: 'Geography',
    description: 'Geography facts — the Dead Sea\'s record low, the world\'s longest place name, and why there\'s no land under the North Pole. Verified true or fake.',
    intro: 'The lowest point on land, the longest place name on Earth, and the ocean under the North Pole ice — geography facts checked against the atlas, labeled true or fake.',
  },
  'guinness-world-records': {
    plain: 'World Records',
    description: 'World record facts — the longest yawn (21 seconds), the largest pizza, the 9-year hiccup episode. Record-book absurdity, verified true or fake.',
    intro: 'The longest yawn ever clocked, a hiccup episode that lasted nine years, and the largest pizza ever baked — record-book facts at their most absurd, verified and labeled.',
  },
  'health': {
    plain: 'Health',
    description: 'Health facts — 5 liters of blood, a trillion smells, and what the hippocampus actually does. Body trivia verified and labeled true or fake.',
    intro: 'Your nose can distinguish a trillion smells and your body holds about five liters of blood — health and human-body facts, checked against the research and labeled true or fake.',
  },
  'history': {
    plain: 'History',
    description: 'History facts — Napoleon in Russia, urine as Roman toothpaste, the 350-year Spanish Inquisition. Real past, verified and labeled true or fake.',
    intro: 'Romans whitened teeth with urine, the Titanic printed its own newspaper, and the Magna Carta still echoes through law — history facts, verified and labeled true or fake.',
  },
  'human-brain': {
    plain: 'Human Brain',
    description: 'Brain facts — why rejection hurts like injury, why your brain predicts everything, and what it does while you sleep. Verified true or fake.',
    intro: 'Your brain treats rejection like physical pain and spends all day predicting the future — brain facts from neuroscience, verified and labeled true or fake.',
  },
  'humans': {
    plain: 'Humans',
    description: 'Human body facts — hearts that squirt blood 30 feet, bones stronger than steel by weight. The machine you live in, verified true or fake.',
    intro: 'Your heart generates enough pressure to squirt blood 30 feet — facts about the strange machine you live in, verified and labeled true or fake.',
  },
  'humour': {
    plain: 'Humour',
    description: 'Facts about humour — laugh tracks, the first pun conviction, and why fake laughing becomes real. The science of funny, verified true or fake.',
    intro: 'Fake laughter turns real thanks to brain chemistry, and the laugh track has a stranger history than most sitcoms — humour facts, verified and labeled.',
  },
  'inventions': {
    plain: 'Inventions',
    description: 'Invention facts — the compass, the printing press, the 1930s defibrillator and the moth in the first computer. Verified and labeled true or fake.',
    intro: 'The compass was invented in Han-dynasty China and the first computer bug was a literal moth — invention facts from fire to smartphones, verified and labeled.',
  },
  'languages': {
    plain: 'Languages',
    description: 'Language facts — click consonants, the world\'s most translated book, and scripts used by 100 million people. Verified and labeled true or fake.',
    intro: 'Some African languages use clicks as consonants and Vietnamese writes with accented Latin letters — language facts from scripts to slang, verified and labeled.',
  },
  'literature': {
    plain: 'Literature',
    description: 'Literature facts — Mark Twain\'s real name, the Gutenberg Bible, and the first mystery novel. Book history verified and labeled true or fake.',
    intro: 'Mark Twain was really Samuel Langhorne Clemens, and the first printed book changed everything — literature facts from fairy tales to first editions, verified and labeled.',
  },
  'mathematics': {
    plain: 'Mathematics',
    description: 'Math facts — pi to 62 trillion digits, zero\'s invention in India, and Euler\'s "most beautiful equation." Verified and labeled true or fake.',
    intro: 'Zero was invented in India, pi has been computed to 62 trillion digits, and Euler\'s identity still makes mathematicians emotional — math facts, verified and labeled.',
  },
  'movies': {
    plain: 'Movies',
    description: 'Movie facts — the T-rex roar\'s animal mix, Pixar\'s hidden references, and a $60k film that made $250M. Film trivia verified, true or fake.',
    intro: 'The Jurassic Park T-rex roar mixes dog, penguin and tiger, and The Blair Witch Project turned $60,000 into a fortune — movie facts, verified and labeled.',
  },
  'music': {
    plain: 'Music',
    description: 'Music facts — a 33,000-pipe organ, the Japanese roots of karaoke, and a Stradivarius auction record. Verified and labeled true or fake.',
    intro: 'The world\'s largest pipe organ has over 33,000 pipes and "karaoke" means empty orchestra — music facts from Mozart to metal, verified and labeled true or fake.',
  },
  'nature': {
    plain: 'Nature',
    description: 'Nature facts — octopus camouflage, two-year pineapples, and more microbes in a teaspoon of soil than people on Earth. Verified true or fake.',
    intro: 'A teaspoon of soil holds more microorganisms than there are people on Earth, and pineapples take two years to grow — nature facts, verified and labeled.',
  },
  'pets-animals': {
    plain: 'Pets & Animals',
    description: 'Animal facts — dog nose prints, koala fingerprints, rats that laugh when tickled, 80-year parrots. Verified and labeled true or fake.',
    intro: 'A dog\'s nose print is as unique as your fingerprint, koalas could fool a crime lab, and rats laugh when tickled — animal facts, verified and labeled.',
  },
  'philosophy': {
    plain: 'Philosophy',
    description: 'Philosophy facts — Occam\'s razor, moral luck, Socratic irony and why "it depends" is the field\'s real motto. Verified and labeled true or fake.',
    intro: 'From Occam\'s razor to moral luck, these philosophy facts explain the ideas people argue about at 2 a.m. — verified, labeled, and only slightly smug.',
  },
  'physics': {
    plain: 'Physics',
    description: 'Physics facts — plasma as the fourth state of matter, 68% dark energy, and Heisenberg\'s limits on knowing. Verified and labeled true or fake.',
    intro: 'The universe is mostly dark energy, plasma is the state of matter nobody remembers, and uncertainty is a law — physics facts, verified and labeled.',
  },
  'politics': {
    plain: 'Politics',
    description: 'Politics facts — the Geneva Conventions, the Electoral College, and protests that changed law. How power works, verified true or fake.',
    intro: 'The Electoral College, the Geneva Conventions, and the protests that rewrote constitutions — politics facts, verified and labeled true or fake.',
  },
  'psychology': {
    plain: 'Psychology',
    description: 'Psychology facts — the placebo effect, hindsight bias, and why being heard feels like being paid. Mind science verified, true or fake.',
    intro: 'The placebo effect works even when you know it\'s a placebo, and your brain rewrites memories to say "I knew it all along" — psychology facts, verified and labeled.',
  },
  'religion': {
    plain: 'Religion',
    description: 'Religion facts — the Eightfold Path, Jainism\'s radical non-violence, and why sacred bells mark time. World faiths verified, true or fake.',
    intro: 'Why bells mark sacred time, what the Eightfold Path actually teaches, and Jainism\'s radical care for every living thing — religion facts, verified and labeled.',
  },
  'science': {
    plain: 'Science',
    description: 'Science facts — hair that holds 100 grams, 5,000-year-old trees, and life without a stomach. Peer-reviewed surprises, labeled true or fake.',
    intro: 'A single hair supports about 100 grams, the oldest tree predates writing, and you can live without a stomach — science facts, verified and labeled true or fake.',
  },
  'space': {
    plain: 'Space',
    description: 'Space facts — $12M astronaut suits, a rum-scented gas cloud, and the Sun losing 4 million tons a second. Verified and labeled true or fake.',
    intro: 'Astronaut suits cost $12 million, there\'s a giant alcohol cloud near Aquila, and the Sun sheds 4 million tons every second — space facts, verified and labeled.',
  },
  'sports': {
    plain: 'Sports',
    description: 'Sports facts — the 1903 World Series, Messi\'s 8 Ballons d\'Or, and the laundry basket that started basketball. Verified and labeled true or fake.',
    intro: 'Basketball began with a laundry basket, the marathon honors a soldier\'s run, and Messi owns eight Ballons d\'Or — sports facts, verified and labeled.',
  },
  'technology': {
    plain: 'Technology',
    description: 'Technology facts — the first computer bug (a moth), 150 daily phone unlocks, and a trillion-terabyte yottabyte. Verified and labeled true or fake.',
    intro: 'The first computer bug was an actual moth and you probably unlock your phone 150 times a day — technology facts, verified and labeled true or fake.',
  },
  'travel': {
    plain: 'Travel',
    description: 'Travel facts — Pisa\'s 200-year lean, Norway\'s sunless winters, and the real Hobbiton in New Zealand. Wanderlust trivia verified, true or fake.',
    intro: 'The Leaning Tower took 200 years to build (and lean), and a Norwegian town skips sunrise for two months — travel facts, verified and labeled.',
  },
}

export function getCategoryCopy(slug: string): CategoryCopy | null {
  return CATEGORY_COPY[slug] ?? null
}
