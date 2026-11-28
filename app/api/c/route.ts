// Same-origin endpoint the browser beacons landing, game and progress events to.
// Validates and sanitises, then forwards the counts to the API. Always answers 204; nothing is returned or stored
// about the caller.
import { normalizeCampaign, GAME_EVENTS, type CampaignEvent } from '@/utils/campaign'
import { postCampaignEvent } from '@/utils/campaignServer'

// Known bots, link-preview fetchers and headless browsers are dropped. The user-agent is
// only inspected here; it is never stored or forwarded.
const BOT_RE = /bot|crawl|spider|slurp|preview|headless|lighthouse|pagespeed|phantomjs|selenium|puppeteer|playwright|facebookexternalhit|embedly|curl\/|wget\/|python-|node-fetch|axios|go-http-client|okhttp\/|java\/|whatsapp|pinterest|monitor|uptime|pingdom/i

export async function POST(req: Request) {
  try {
    if (BOT_RE.test(req.headers.get('user-agent') ?? '')) return new Response(null, { status: 204 })
    const b = JSON.parse(await req.text())
    const e = b?.e
    const campaign = normalizeCampaign(b?.s, b?.m, b?.c)
    if ((e === 'landing' || GAME_EVENTS.includes(e)) && campaign) await postCampaignEvent(e as CampaignEvent, campaign)
  } catch {
    /* malformed beacon: ignore */
  }
  return new Response(null, { status: 204 })
}
