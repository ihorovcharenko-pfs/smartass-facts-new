# SmartAss Facts — QA report (2026-10-17)

Tested on a local production build (`next start`, port 5173) of `client-next` with the fixes below, plus the live site for the GA check. Desktop 1440px and mobile 390px, Playwright/Chromium. Nothing committed or deployed.

## Fixed (critical, verified)

| # | Problem | Root cause | Fix |
|---|---|---|---|
| 1 | Category tile / sidebar+tile / search+tile did not start a game (bounced to home) | `GameRoute` read `?cat=` from `window.location` at render; on client-side nav with a cached chunk the URL isn't updated yet, so category = null → redirect home | `components/GameRoute.tsx`: use `useSearchParams()` |
| 2 | Play Now on other pages only went home / did nothing | Header Play Now → `navigate('/')`; 296 static SEO pages had `<a href="/">` | Header: start "Game of the day". Static pages: href → `/game/?cat=Game%20of%20the%20day` (no page URLs changed) |
| 3 | Logo → home | was a `div role=button` | real `<a href="/">` in `Header.tsx` (works on all pages tested, incl. static) |
| 4 | Headline wrapped to 2 lines on laptops | forced `<br>` + 640px max-width | `clamp(2.25rem, 3.6vw, 3.5rem)`, nowrap ≥1024px; 1 line at 1280/1440/1470 (46/52/53px). Wraps on tablet/mobile |
| 5 | **Party Mode broken** (host stuck on "Creating…", room dies) | (a) `navigate('/room/CODE')` swaps Next pages → RoomPage remounts → cleanup disconnects socket; (b) `useRef(connectRoomSocket())` reconnects every render → "WebSocket already in CLOSING" race | `components/RoomPage.tsx`: `history.replaceState` for the share URL; connect once inside the effect |
| 6 | 11 category pictures 404 (names with `&` `,`) under plain static serving | raw `&`/`,` in `<img src>` | `MainPageClient.tsx` `getCategoryImage`: encode filename |

## QA results (desktop 1440 / mobile 390)

| Area | Test | Pass/Fail | Notes |
|---|---|---|---|
| Game start | Category tile, tile ▶, sidebar filter→tile, search→tile, Game of the day | Pass | desktop+mobile (after fix; failed before) |
| Search | No-results state | Pass | |
| Search | Search box on mobile | **Fail** | header search is hidden at 390px — no way to search on phones |
| Play Now | 17 page types (home-adjacent, facts, myths static+React, random, about, how-it-works, faq, vs, educators, privacy, terms, cookies, leaderboard, myth/vs/animal/category detail) | Pass | |
| Play Now | `/about/gigi-smarts/` | Fail (minor) | page has no header/Play Now |
| Game flow | Answer → next → end screen → stats → share → challenge (API 201, link copied) → play again → continue | Pass | |
| Game flow | Explanation "instantly" | **Fail** | ~800ms after tap (300ms deliberate timeout + card animation); first Q ~1.4s |
| Game flow | Back arrow in game | **Fail** | rendered under the sticky header logo — invisible/unclickable (header now shows on /game). Logo still exits |
| Party Mode | Setup, host+guest join, 10 Qs, reveals, end screen, podium, share, replay same category, replay new category, guest replay | Pass | desktop+mobile (after fix; broken before, incl. on live) |
| Navigation | Header Leaderboard / Party Mode / logo (12 pages), sidebar Explore, footer internal (18) + social (3), bottom legal links | Pass | |
| Sign in | Modal + fields (not submitted) | Pass | |
| Leaderboard | Loads with data | Pass | |
| Newsletter | Visible, invalid email blocked (not submitted) | Pass | |
| Images | Logo, 35 category pictures, 20 pages | Pass | after fix #6 |
| Console | JS errors on 20 pages | Pass | (live also logs React hydration error #418 on `/` — see below) |
| Links | 200 unique internal hrefs | Fail (minor) | `/cookie-policy.html` 404 (link in Privacy Policy → should be `/cookies/`) |
| Contrast | Dark pages (axe) | **Fail** | white on orange `#f06030` = 3.27 (Play Now, Play, newsletter button, "Start"); white on green `#66bb6a` = 2.36 (Sign in); `#65657f` on `#13131f` = 3.26 (sidebar headings); `#ab47bc` breadcrumb 3.94. Need ≥4.5 |
| SEO risk | Fact detail pages under burst load | **Fail** | ~13 rapid requests → API rate-limits → pages return **404** instead of 5xx/cached. Googlebot could see 404s |
| Console (live) | Hydration mismatch (React #418) on `/` | Fail (minor) | live site only; recovers by client re-render |

## Google Analytics (GA4 `G-MS3N10PT93` via GTM `GTM-KBFTJDH2`)

| Check | Result |
|---|---|
| Tag on every page | **No.** React pages: yes (`page_view` fires on ~all). **All 297 static SEO pages (myths, vs, topics, animals, countries, people, hubs, author, embed) have no GA/GTM** — the site's top Google performers aren't tracked |
| Game start / game complete (single-player) | **Not tracked.** Only `page_view` (+ auto `scroll`). No custom events exist anywhere in the code |
| Party Mode start / complete | **Not tracked.** Only `page_view`. (Also: replaceState to `/room/CODE/` fires a page_view with the room code in the URL) |
| Category / mode / score params | None sent |
| Cookie consent | **No consent banner exists.** GA loads and sets `_ga` cookies on first visit with no consent step (Privacy/Cookie policy text refers to consent) — a GDPR/ePrivacy exposure for EU users |

### Proposed events (awaiting approval)

All via `gtag('event', …)` / dataLayer push, params: `category`, `mode` (`single` | `party` | `daily` | `battle`), `score`, `total`.
- `game_start` — `{category, mode}`
- `game_complete` — `{category, mode, score, total, percentage}`
- `game_replay` — `{category, mode}`
- `challenge_created` — `{category, score}`
- `party_room_created` — `{category}`; `party_game_start` — `{category, players}`; `party_game_complete` — `{category, players, winner_score}`
- `share_click` — `{method, category}`

## Awaiting your approval (not changed)

1. Game Back button hidden under header
2. Explanation delay (~800ms → instant)
3. Search hidden on mobile
4. Contrast fixes (brand orange darker or dark text)
5. Fact-page 404-under-rate-limit (return 5xx / retry / cache)
6. `/cookie-policy.html` link → `/cookies/`
7. Add GA to the 297 static pages
8. Add the game/party events above
9. Cookie consent banner + GA consent mode (decide scope: EU only vs all)
10. React #418 hydration warning on live home

## Note: uncommitted changes you already had

`components/Analytics.tsx` (GA/GTM now deferred until interaction or ~2.5s idle) and `components/MainPageClient.tsx` (plain `<img>` instead of `next/image`) were modified before I started; they are included in the local build I tested. I left them as they were apart from the image-name encoding.

---

## Round 2 — approved fixes (all verified on a local production build; NOT deployed)

| Item | Result |
|---|---|
| Back button hidden under header | Fixed (`.game` is now the positioning context) |
| Explanation delay | Fixed — now ~15–50ms (removed the 300ms timeout) |
| Search on mobile | Fixed — search box in the home hero at ≤768px |
| Contrast | Fixed — darker orange for white-text fills, darker green Sign in, muted text lightened, breadcrumb/purple links lightened (app + 297 static pages). Remaining axe nit: `btn-white` mailto button on /privacy and /terms (4.24:1) |
| Fact pages 404 under rate limit | Fixed — `serverData.ts` retries 429/5xx with backoff, returns 404 only for a real 404, otherwise throws (stale cache / 5xx, never a fake 404 or an empty cached grid) |
| `/cookie-policy.html` link | Fixed → `/cookies/` |
| React #418 hydration error (live) | Cause: server HTML had a "▶ Play Now" the client doesn't render on `/`. Header Play Now now renders after mount. Couldn't reproduce locally, so confirm on live after deploy |
| GA on static pages | Added to all 297 (embed/quiz excluded) |
| Game/party events | `game_start`, `game_complete` (score,total,percentage), `game_replay`, `challenge_created`, `share_click`, `party_room_created`, `party_game_start`, `party_game_complete` — params category/mode/score verified in `g/collect` |
| Cookie consent | Banner for ALL visitors (React + static pages), Google consent mode default denied, choice stored in `sa_consent`, "Cookie settings" footer link reopens it. Before choice: no `_ga` cookies, cookieless pings only, no Amplitude/Metricool. Decline: stays that way. Accept: cookies + Amplitude/Metricool load |
| Sidebar | Categories now above Explore |

**Heads-up — existing GTM tags:** container GTM-KBFTJDH2 already has GA4 event tags `game_started` (fires on clicks of the tile ▶ button only) and `game_completed` (fires when the results screen's dot element is visible, once per page load), with no parameters. My `game_start` / `game_complete` are separate, more accurate events. To avoid double-counting, pause those two GTM tags (needs GTM access) or tell me to rename mine to match.
