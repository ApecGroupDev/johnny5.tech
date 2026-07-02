# Ruby Queen v3.2 — Handoff for efficiency4 (2026-07-02)

The app is already live on Johnny5.tech. This version adds **server-side storage for tech
fix submissions** (new `api/fixes.js`) plus 643 new service invoices in `data/service.json`.
Same structure as before — redeploy these files. **The one thing that MUST be done this
time is creating and connecting the database (Part 2).** Without it, tech submissions and
the leaderboard are NOT saved centrally.

---
## Part 1 — Redeploy the files (5 min)
1. Replace the project files with the contents of `RubyQueen_Vercel_Package.zip`
   (everything under `ruby-queen/`).
2. Keep the existing `ANTHROPIC_API_KEY` env var. No other env vars are required.
3. Deploy. (If you finish Part 2 after this, you must deploy **again** — see below.)

Files changed vs v3.1:
- `index.html`     — Log-a-Fix + Review tab now talk to the server; everything else unchanged
- `api/fixes.js`   — NEW: stores submissions/approvals in the database
- `data/service.json` — grew 6,277 → 6,920 records
- `EFFICIENCY4_HANDOFF.md`, `README_DEPLOY.md` — this documentation
- Unchanged: `api/ask.js`, `api/screen.js`, `api/contrib.js`, other `data/*`, `package.json`, `vercel.json`

---
## Part 2 — CREATE THE DATABASE (Vercel KV) — REQUIRED, ~5 min
This is the piece that was skipped last time. It stores, centrally and permanently:
- every tech fix submission (full problem + solution text) — key `rq_fixes`
- every manager approval/rejection and the approved library entries — key `rq_fixes`
- the contribution leaderboard events — key `rq_contrib`

Steps (Vercel dashboard):
1. Open the Ruby Queen project in Vercel → **Storage** tab.
2. **Create Database** → choose **KV** (listed as Upstash / "Durable Redis").
3. Name it `ruby-queen-kv`. Region: pick the closest to the deployment (US East is fine).
4. Click **Connect Project** → select the Ruby Queen project → Connect.
   This auto-injects the env vars `KV_REST_API_URL` and `KV_REST_API_TOKEN`. Do not edit them.
5. **REDEPLOY the project.** Env vars only take effect on a new deployment.
   (Deployments tab → ⋯ on the latest → Redeploy.)

### Verify it worked (2 min — please actually do this)
1. Open `https://johnny5.tech/api/fixes` in a browser →
   must show `{"ok":true,"service":"ruby-queen-fixes","kv":true}` — **`kv:true` is the test.**
   `kv:false` = database not connected or you didn't redeploy after connecting.
2. Same check: `https://johnny5.tech/api/contrib` → `"kv":true`.
3. End-to-end: in the app, Log a Fix → submit a test entry. Open the app on a DIFFERENT
   device/browser → Service Manager (password) → Review tab → the test entry must appear.
   Approve it → Browse tab on any device now shows it. That proves central storage.

### Do NOT ever
- Delete or disconnect the KV database — that deletes all field submissions.
  If it must be moved/recreated, download a backup first (below) and tell Ali.

---
## Part 3 — BACKUPS (how nothing gets lost)
Two built-in export URLs return everything as JSON (they are guarded by the manager password):
- **All fix submissions (full text, all statuses):**
  `https://johnny5.tech/api/fixes?export=1&key=Summerville`
  (managers also have a "⬇ Download full backup (server JSON)" button on the Review tab)
- **Leaderboard events:**
  `https://johnny5.tech/api/contrib?export=1&key=Summerville`

Backup routine (agreed with Ali):
1. **After every solution-entry day** and at least **weekly**, download both URLs.
2. Save into Box: `Ruby_Queen/8_Field_Submissions/` with the date in the file name,
   e.g. `fixes_backup_2026-07-10.json`. Ali's local Box copy is the authoritative archive;
   approved fixes get merged into the app's built-in library (`data/kb.json`) from there,
   so the knowledge ends up stored in three places: KV database, Box archive, and the
   deployed app itself.
3. The export is safe to run any time — it's read-only.

Durability notes:
- KV data survives redeploys and code changes; it lives in Upstash, independent of the app.
- Redeploying with a new zip never touches the database.
- The app degrades gracefully: if the database is unreachable, submissions fall back to the
  browser's localStorage and the Review tab says "Server storage not connected yet" —
  if anyone sees that message after Part 2, something is wrong: re-check `kv:true`.

---
## Env vars (complete list)
| Var | Required | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | yes (existing) | powers /api/ask + /api/screen |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | auto | injected by Storage → Connect; don't edit |
| `WEB_FALLBACK` | no | `false` disables web answers (default on) |
| `ADMIN_KEY` | no — **leave unset** | guards the export/queue endpoints; unset = manager password `Summerville`. If you set it, it MUST equal the manager password in `index.html` (`tryManager`), or approvals/exports break. |
| `ALLOWED_ORIGIN` | no | CORS lock-down, optional |

## Passwords
- Service Manager password is hard-coded in `index.html` (`tryManager`): `Summerville`.
  It also authorizes server-side approve/reject/export. To change it: edit it in `tryManager`
  AND set `ADMIN_KEY` to the same word, then redeploy.

## Troubleshooting
- `kv:false` on /api/fixes or /api/contrib → KV not connected to THIS project, or no redeploy after connecting.
- `403 Wrong key` on export/queue → `ADMIN_KEY` env var doesn't match the manager password. Unset it.
- Leaderboard tab empty → same cause as `kv:false`.
- Review tab says "showing this browser's local queue" → server storage off; fix Part 2.

## After deployment — send Ali ONE message with these 4 answers
Ali's side will run an automated weekly backup that pulls the two export URLs. To set
that up he needs exactly this — copy the template, fill it in, send it, done:

> 1. v3.2 deployed, KV connected, /api/fixes shows kv:true  — YES / NO
> 2. Exact production URL of the app:  https://______  (is it johnny5.tech, www.johnny5.tech, a subpath?)
> 3. ADMIN_KEY env var:  UNSET (default)  /  or set to: ______
> 4. Anything in front of the site (Vercel Deployment Protection, password page, Cloudflare
>    Access)?  NO / YES → if YES: either exempt GET /api/fixes and /api/contrib from it,
>    or include Vercel's "Protection Bypass for Automation" token here: ______

Important for #4: the automated backup is a plain server-to-server GET request. If a login
wall sits in front of /api/fixes, backups silently break. Please make sure those two GET
endpoints stay reachable (they are already guarded by the key parameter themselves).

## Checklist to hand back to Ali
- [ ] Deployed v3.2 zip
- [ ] KV database created + connected + redeployed
- [ ] `/api/fixes` shows `kv:true`
- [ ] Test submission visible from a second device, approved, appears in Browse
- [ ] First backup JSON downloaded and saved to `Ruby_Queen/8_Field_Submissions/`
- [ ] Sent Ali the one-message report above (4 answers)
