# Ruby Queen — Deployment Notes (for the web developer)  ·  v3 (2026-06-30)

## What this is
Internal POS assistant for APEC/GEO field techs. Zero-config **Vercel** project: a static front-end
(`index.html`) that loads its data from `/data/*.json`, plus serverless functions that call Claude and
store contributions. Three knowledge layers, searched in the browser:
- **Peggy's troubleshooting library** — 235 verified fixes.
- **Service history** — 5,226 past calls (1,699 invoices with problem→solution→parts + 3,527 site logs).
- **Site profiles** — 1,433 sites: equipment, software, network, dispensers, access details.

## What changed in v3
- **Service Manager gate** — clicking "Service Manager" now asks for a password. It is hard-coded as
  `Summerville` in `index.html` (function `tryManager`). Techs get the normal single login; only people
  you give the word to can open the manager tabs (Review + Leaderboard). Note: a hard-coded password is
  visible in page source to anyone signed in — that's inherent to "hard-code it," and fine for internal use.
- **Contribution leaderboard** — every submitted / approved fix is recorded with the tech's name via the
  new `api/contrib.js`. Managers get a **🏆 Leaderboard** tab (week / month / quarter / all-time, with a
  top + runner-up), and an **admin export**. This needs **Vercel KV** (see below) — without it the app
  still runs, contributions just aren't stored.
- **Web answers ON by default** — `api/ask.js` now falls back to the web automatically when the library
  has nothing, and techs get an **"Also search the web"** button on any answer. Set `WEB_FALLBACK=false`
  to turn it off.
- **Service History tab** now lists only the 1,699 coherent invoices; each row is clickable to the full
  ticket incl. solution. (Terse site logs still show under each site's own profile, newest first.)
- **Simplified Ask screen**, prominent input at top, a **Clear** button, and access fields shown without
  masking (inner-circle use).

## SECURITY — read first
- The Anthropic API key is **never** in the front-end; read server-side from `ANTHROPIC_API_KEY`
  (Ali provides it separately, not in this package).
- Site profiles include pump passwords, keys and IPs, shown to all signed-in users, so the whole app
  **must** sit **behind login and HTTPS**. Don't expose `data/*.json` on public URLs.
- Site is now **Johnny5.tech** (migrated from alihusain.me). R2D2 stays private on the old site.

## Layout
```
index.html              the app (UI + search); loads data/*.json on start
data/kb.json            235 troubleshooting entries
data/service.json       5,226 service calls (source = "Invoice" | "Site Log")
data/sites.json         1,433 site profiles
data/field_labels.json  decodes the site field codes (label + group)
api/ask.js              POST /api/ask     — library + service grounded, web fallback (on by default)
api/screen.js           POST /api/screen  — AI junk-screen for tech-submitted fixes
api/contrib.js          GET/POST /api/contrib — records contributions, serves the leaderboard
package.json, vercel.json, .env.example
```

## Environment variables (Vercel → Project → Settings → Environment Variables)
- `ANTHROPIC_API_KEY` — **required** (sent separately).
- `WEB_FALLBACK` — optional; omit or `true` = web answers on, `false` = off.
- `ANSWER_MODEL=claude-sonnet-4-6` · `SCREEN_MODEL=claude-haiku-4-5-20251001` · `WEB_SEARCH_TOOL=web_search_20250305`.
- `ALLOWED_ORIGIN` — only if the app is served from a different domain than the API.
- `ADMIN_KEY` — optional; guards the leaderboard export. Defaults to `Summerville` if unset.
- `KV_REST_API_URL`, `KV_REST_API_TOKEN` — **auto-added by Vercel when you attach KV** (next section).

## Turn on the leaderboard (Vercel KV — ~2 minutes)
1. Vercel dashboard → your project → **Storage** → create a **KV / Upstash Redis** store, connect it to the project.
2. Vercel injects `KV_REST_API_URL` + `KV_REST_API_TOKEN` automatically. **Redeploy.**
3. Done. Submissions now persist and the Leaderboard fills in. No code changes needed.
- **Admin export** (pull the raw data any time): `https://<your-app>/api/contrib?export=1&key=Summerville`
  (change the word by setting `ADMIN_KEY`). Returns JSON of every contribution event.

## Deploy
1. Put these files in a Git repo; import to Vercel (framework preset **Other**, zero-config).
2. Add `ANTHROPIC_API_KEY` (and attach KV for the leaderboard).
3. Deploy. App at `/`, data at `/data/*`, API at `/api/ask`, `/api/screen`, `/api/contrib`.
4. Keep it behind your SSO/login.

## Quick test after deploy
Open through login (page password `apec`). Ask "pump stuck on blue" → answer + "Also search the web".
**Sites** → open a site (equipment + newest-first history). **Service History** → search a brand, click a
ticket. Click **Service Manager**, enter `Summerville` → **Review** + **🏆 Leaderboard** appear.

## v3.2 (2026-07-02)
New `api/fixes.js`: server-side store for Log-a-Fix submissions + manager review (same Vercel KV as the leaderboard). Full backup: `GET /api/fixes?export=1&key=<manager password>`.
