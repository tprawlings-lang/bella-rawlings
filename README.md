# bellarawlings.com

Official website for **Bella Rawlings** — singer-songwriter. Built per the
musician-site architecture + minor-artist build spec + Brand Kit v1.0:
Next.js (App Router) + Tailwind on Vercel, with BYOC social integration
(the artist never shares passwords).

## What's here

| Route | Purpose |
|---|---|
| `/` | Hero, email signup above the fold, latest release, next 3 shows, featured TikToks |
| `/music` | Originals & Covers with Spotify/YouTube embeds and streaming links |
| `/shows` | Calendar module: list + month grid, past-show archive, ICS/Google Calendar, `MusicEvent` JSON-LD |
| `/content` | TikTok + Instagram feeds (Tier 1 embeds → Tier 2 live feeds) |
| `/about` | Bio & story (Dallas local SEO) |
| `/epk` | Press kit: bios, stats, live video, downloadable photos, management contact |
| `/book` | Booking form → guardian email (honeypot + rate limit) + FAQ JSON-LD |
| `/privacy`, `/terms` | Required legal pages (minor-artist spec) |
| `/merch` | Links out to the store once `merchUrl` is set |
| `/admin` | Guardian-gated: magic-link sign-in, Connect Instagram / Connect TikTok |

**Everything editable lives in `content/`** — plain files with instructions at
the top of each (site settings, music, shows, bio, EPK, curated post URLs).
Editing a file on GitHub auto-redeploys the site.

## The two-tier social module

- **Tier 1 (live today, zero credentials):** paste post URLs into
  `content/social-posts.ts`; the site renders official TikTok/Instagram embeds.
- **Tier 2 (artist-connected):** Bella + guardian visit `/admin`, click
  *Connect Instagram* / *Connect TikTok*, and approve on the platform's own
  OAuth screen. Tokens are stored **server-side only** (Vercel KV / Upstash);
  feeds upgrade automatically, no redeploy. If a token ever lapses, the site
  falls back to Tier 1 — it never depends on Tier 2.
- A weekly Vercel cron (`vercel.json` → `/api/cron/refresh-tokens`) refreshes
  the Instagram 60-day token and rotates the TikTok refresh token.

## Minor-artist protections baked in

- All inquiries route to the **guardian/manager email** (`content/site.ts`);
  Bella's personal contact info appears nowhere.
- Email capture is **email-only, double opt-in** (confirmation link before
  anything is stored); parents can request deletion via the privacy page.
- Publish-only site: no accounts, comments, or DMs.
- Cookieless Vercel Analytics only — **no ad/retargeting pixels** (this
  deliberately overrides the Meta Pixel suggestion in the first architecture
  doc; the dev spec's minor-protection section wins).
- Only `status: "confirmed"` public shows are published.
- **Family follow-ups (not code):** registrar WHOIS privacy ON; published
  address (if any) must be a PO box/business address; if bookings monetize,
  look into a guardian consent agreement and a Coogan-style trust for
  earnings; create a Google Business Profile as a *service-area* business
  (no street address) per the spec's local-SEO section.

## Setup (developer)

```bash
npm install
cp .env.example .env.local   # fill in what you have; everything degrades gracefully
npm run dev
```

Deploy: push to GitHub → import the repo in Vercel → add env vars from
`.env.example` → add the **Upstash for Redis** integration (token storage)
→ create a **Resend** account (free), verify the `bellarawlings.com` domain,
make an Audience, and set the three `RESEND_*` / `CONTACT_FROM_EMAIL` vars.

Developer apps (reusable for future artist clients):
1. **TikTok for Developers** app, Display API, scopes `user.info.basic` +
   `video.list`. Submit for review on day 1 — longest lead time. Redirect URI:
   `https://bellarawlings.com/api/auth/tiktok/callback`.
2. **Meta developer app** → Instagram API with Instagram Login (Bella's
   Instagram must be switched to a free *Professional → Creator* account).
   Redirect URI: `https://bellarawlings.com/api/auth/instagram/callback`.

## Pointing bellarawlings.com at the site (DNS)

1. In Vercel: Project → **Settings → Domains** → add `bellarawlings.com`
   and `www.bellarawlings.com`.
2. At the domain registrar (GoDaddy/Namecheap/etc.), edit DNS records:
   - **A record** — Host: `@` → `76.76.21.21`
   - **CNAME** — Host: `www` → `cname.vercel-dns.com`
   - (Vercel's Domains screen shows these exact values; if it offers
     nameserver delegation instead, that also works and lets Vercel manage
     everything.)
3. Wait for DNS to propagate (minutes to ~48h). Vercel issues the SSL
   certificate automatically; both hosts go green on the Domains screen.
4. Set `www` to redirect to the apex (Vercel does this by default).
5. Registrar checklist: **WHOIS privacy ON**, auto-renew ON.

## Handoff to the family

1. Transfer the Vercel project (Settings → Transfer) and the GitHub repo to
   their accounts — or keep them under yours as managed hosting.
2. Set `ADMIN_EMAIL` to the guardian's email; they sign into `/admin` with a
   magic link (no password to lose).
3. They connect Instagram/TikTok themselves on `/admin` — passwords never
   change hands.
4. Day-to-day updates (shows, music, bio, curated posts) are plain-text edits
   in `content/` on GitHub.
