// Server-only: forward one campaign count to the API (Postgres). Used by proxy.ts
// (landings) and app/api/c/route.ts (game events). No identifiers are sent or kept.
import type { Campaign, CampaignEvent } from './campaign'

const API = process.env.CAMPAIGN_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.smartassfacts.com'

export async function postCampaignEvent(e: CampaignEvent, c: Campaign): Promise<void> {
  try {
    await fetch(`${API}/api/c`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ e, ...c }),
      signal: AbortSignal.timeout(3000),
    })
  } catch {
    /* counting is best-effort and must never affect the page */
  }
}
