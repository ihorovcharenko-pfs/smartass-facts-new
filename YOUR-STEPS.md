# SmartAss Facts → Next.js (SSR) migration — your tracker

Plain-English status of the "Route 2" rebuild. I (Claude) do all the technical
work. This file lists what's done and the few steps that only you can do
(accounts, clicking "deploy", DNS).

---

## Why we did this
Your old site was a "single-page app": the browser downloaded a blank page, then
ran ~3 seconds of JavaScript before any content showed. That was the performance
ceiling. The rebuild uses **server-side rendering (SSR)**: the server sends a
fully-built page, so content appears almost instantly. Faster speed score +
much better Google SEO. Built with **Next.js**, to be hosted on **Vercel**. Your
API + database on the VPS are unchanged.

---

## ✅ DONE — the entire app is rebuilt and working (verified)
1. **Backup** taken first → `Claude Code/_backups/2026-06-11_pre-nextjs-migration/`. Old site untouched & still live.
2. **Landing page** — server-rendered. All 35 category cards are in the HTML instantly (was a blank page before). Built as a static page refreshed every 5 min = served from a global CDN, basically instant.
3. **Content/SEO pages** — `/facts`, every category page, and every individual fact page are server-rendered. Google now sees the full fact + TRUE/FAKE verdict on each page. Plus About, How It Works, Myths, vs, Random, For Educators, and legal pages.
4. **Interactive pages** — the Game, Party Mode (rooms), Battle, and Leaderboard all work exactly as before. I played a game and opened Party Mode to confirm.
5. **Analytics** (Google Tag Manager + GA4 + Amplitude + Metricool), **service worker** (offline caching + push notifications), **first-visit onboarding**, and the **"sign in" link** — all carried over.
6. **SEO extras added**: `robots.txt` and a `sitemap.xml` listing every page.
7. **Production build passes** with zero errors — it's ready to deploy.

The new code lives in `smart-ass/client-next/` (next to your old `client/`, which
is still the live site until we switch over).

---

## 🔜 REMAINING — deploy (this is where I need you)
Three things only you can do. I'll be here for each one.

### Step 1 — Put the code on GitHub (free)
- If you don't have a GitHub account: create one at https://github.com (free).
- Create a new **empty** repository (e.g. `smartass-facts-web`). Keep it private.
- Tell me when it exists — I'll give you the exact 2 commands to upload the code
  (it's already committed and ready), or walk you through GitHub Desktop if you
  prefer clicking over typing.

### Step 2 — Connect Vercel (free)
- Go to https://vercel.com and **sign up with your GitHub account**.
- Click **Add New… → Project**, and import the repo from Step 1.
- Vercel auto-detects Next.js. **Important setting:** set the **Root Directory**
  to `client-next` (if the repo contains the whole project) — I'll confirm the
  exact value based on how we upload it.
- Click **Deploy**. In ~2 minutes you get a temporary URL like
  `smartass-facts-web.vercel.app` to test on.

### Step 3 — Test, then point your domain
- We test everything on the temporary Vercel URL first, side-by-side with your
  live site. (Note: the **pages/SEO/speed work immediately** on that URL. The
  **interactive features** — playing a game, login, Party Mode — need one small
  tweak to your API first; see "CORS" below. I handle that.)
- Once it's proven, you change one DNS record in **Cloudflare** to point
  `smartassfacts.com` at Vercel. I'll give you the exact values to paste. Your
  live site keeps running until the moment this change takes effect.

**Nothing here costs money** (Vercel's free tier covers your traffic) and nothing
touches your live site until you deliberately make the DNS change with me.

---

## 🔧 One technical note for me to handle: "CORS"
Your API only accepts browser requests from approved web addresses
(currently `smartassfacts.com` + the old dev address). The interactive features
(game, login, Party Mode) call the API from the browser, so:
- After the DNS switch, everything works automatically — `smartassfacts.com` is
  already approved.
- To test interactive features on the temporary `*.vercel.app` URL *before* the
  switch, I need to add that address to the API's approved list (a 1-line change
  + restart of your API). **This touches your live API, so I'll ask you before
  doing it.** The SSR pages and SEO don't need this — only the interactive bits.

---

## How to see it yourself right now (optional)
The rebuilt app runs locally during our sessions at `http://localhost:5173`.
You don't need to run anything — I start it.
