// Summary verdicts by score tier (out of 10) and their witty sublines.
export interface Tier { title: string; sublines: string[] }

const TIERS: Array<{ min: number; tier: Tier }> = [
  { min: 9, tier: { title: 'Certified SmartAss', sublines: ['Cleopatra would be proud. Mostly.', 'The monkey is taking notes from YOU.', 'Fake facts fear you. Rightfully.'] } },
  { min: 7, tier: { title: 'Dangerously Smart', sublines: ['You sniff out fakes like a bloodhound with a library card.', 'Two more and the monkey bows.', 'Suspiciously good at this.'] } },
  { min: 4, tier: { title: 'Suspiciously Average', sublines: ['Not bad, not great. The monkey shrugs.', 'Half smart, half lucky. We won’t tell which.', 'Respectable. Forgettable. Replay it.'] } },
  { min: 0, tier: { title: 'Professionally Fooled', sublines: ['You believed the rubber duck thing, didn’t you?', 'The fakes send their regards.', 'Brave. Wrong. But brave.'] } },
]

export function tierFor(score: number, total: number): Tier & { subline: string } {
  const scaled = total > 0 ? Math.round((score / total) * 10) : 0
  const t = TIERS.find(x => scaled >= x.min)!.tier
  // Stable pick (no flicker between renders)
  const subline = t.sublines[(score + total) % t.sublines.length]
  return { ...t, subline }
}

/** Longest run of consecutive correct answers. */
export function bestStreak(results: boolean[]): number {
  let best = 0, run = 0
  for (const r of results) { run = r ? run + 1 : 0; best = Math.max(best, run) }
  return best
}
