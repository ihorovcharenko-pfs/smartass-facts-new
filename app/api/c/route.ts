// Same-origin endpoint the browser beacons game_start / game_complete to. Validates and
// sanitises, then forwards the counts to the API. Landings are NOT accepted here: they
// are counted server-side in proxy.ts. Always answers 204; nothing is returned or stored
// about the caller.
import { normalizeCampaign } from '@/utils/campaign'
import { postCampaignEvent } from '@/utils/campaignServer'

export async function POST(req: Request) {
  try {
    const b = JSON.parse(await req.text())
    const e = b?.e
    const campaign = normalizeCampaign(b?.s, b?.m, b?.c)
    if ((e === 'game_start' || e === 'game_complete') && campaign) await postCampaignEvent(e, campaign)
  } catch {
    /* malformed beacon: ignore */
  }
  return new Response(null, { status: 204 })
}
