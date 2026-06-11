# SmartAss Facts → Next.js (SSR) migration — your tracker

Plain-English status of the "Route 2" rebuild. I (Claude) do all the technical
work. This file lists what's done, what's left, and the few steps that only you
can do (creating accounts, clicking "deploy", DNS). **Right now there is nothing
for you to do** — I'll tell you clearly when I need you.

---

## Why we're doing this
Your site was a "single-page app": the browser downloaded a blank page, then
ran ~3 seconds of JavaScript before any content appeared. That's the ceiling we
kept hitting on the performance score. The fix is **server-side rendering (SSR)**:
the server now sends a fully-built page, so content appears almost instantly.
Better speed score + better Google SEO.

We chose **Next.js** (the framework) hosted on **Vercel** (push-to-deploy, no
servers for you to manage, free at your traffic level). Your existing API and
database on the VPS **do not change at all.**

---

## ✅ Done so far (verified working on my machine)
1. **Full backup** of everything taken first — saved in
   `Claude Code/_backups/2026-06-11_pre-nextjs-migration/`. Your old site is
   completely untouched and still live.
2. **New Next.js app** created in `smart-ass/client-next/` (sitting *next to*
   your old `client/`, not replacing it yet).
3. **Landing page now server-rendered.** All 35 category cards are in the page
   the moment it loads — I confirmed this in the raw server output and in a live
   browser preview. The search box and filters still work.
4. Shared header, footer, sign-in popup, and styling all carried over and look
   identical to the current site.

## ⏳ Still to do (my work, no action from you)
5. Port the content pages (All Facts, Myths, vs, Random, About, etc.) — these
   get the SSR + SEO benefit too.
6. Port the interactive pages (Game, Party Mode/rooms, Battle, Leaderboard) —
   these stay browser-side, exactly as they behave now.
7. Re-add analytics (Google, Amplitude), the service worker, and push
   notifications, then check every feature matches the old site.

## 🔜 Then — the part where I'll need you (later, I'll guide you click-by-click)
8. **Create a free GitHub account / repo** (or I use one you have) so Vercel can
   read the code.
9. **Create a free Vercel account** and connect it to that repo — this is the
   "deploy" button.
10. **Point your domain** `smartassfacts.com` at Vercel (a DNS change in
    Cloudflare). We'll first test on a temporary Vercel URL *side-by-side* with
    your live site, and only switch the real domain once it's proven.

Nothing in steps 8–10 touches money or your live site until we deliberately flip
the switch together.

---

## How to see it yourself (optional)
The new app runs locally during our sessions. If you ever want to look, the
preview opens at `http://localhost:3100`. You don't need to run anything — I
start it.
