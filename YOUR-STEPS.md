# SmartAss Facts → Next.js (SSR) — ✅ LIVE

**As of 2026-06-12, the new server-rendered site is live at https://smartassfacts.com.**

## What changed
- Rebuilt from a client-only React SPA to **Next.js (SSR)**, hosted on **Vercel**.
- Pages now arrive pre-rendered → faster + far better SEO.
- Your API, database, admin panel, image hosting, and **email all stayed put** on the VPS — only the website's front door moved to Vercel.

## Results (Google PageSpeed, mobile)
| | Before | After |
|---|---|---|
| Performance | 72 | **86** |
| SEO | weak (SPA) | **100** |
| Best Practices | — | **100** |
| Accessibility | — | **95** |
| First paint (FCP) | 2.6s | **0.9s** |

## How it's wired now
- `smartassfacts.com` → Vercel (the new site), `www` → redirects to it.
- `api` / `admin` / `images.smartassfacts.com` → still your VPS (unchanged).
- Email (privateemail + Resend/SES) → untouched and working.
- The **old site is still on your VPS**, now dormant — keep it as a backup for a while.

## Good to know
- **Future updates**: any change is now `git push` → Vercel rebuilds automatically (I can do these for you).
- **Repo is public** — harmless (frontend code, no secrets), but you can flip it to private in GitHub → Settings if you prefer.
- Vercel may show "DNS Change Recommended" on the domain — safe to ignore; the A-record we used works (we deliberately avoided their CNAME because your email needs the apex free for MX records).

## Recommended next step (SEO)
Submit your sitemap in **Google Search Console**: `https://smartassfacts.com/sitemap.xml`. This tells Google to re-crawl all the now-server-rendered pages, which is where the SEO payoff lands over the coming weeks.
