# Ruby Queen — Deployment Notes (for the web developer)

## What this is
A small, zero-config **Vercel** project: a single-page web app (`index.html`) plus two serverless
functions (`api/ask.js`, `api/screen.js`) that call the Anthropic **Claude** API. It's an internal
POS-troubleshooting assistant for APEC's service technicians. The app answers from an embedded
knowledge base (235 entries) and, when enabled, falls back to a web search — always labelling whether
an answer came from the library or the web.

## SECURITY — read first
- The Anthropic API key is **never** in the front-end. It is read server-side from the
  `ANTHROPIC_API_KEY` environment variable.
- **Ali will give you the API key separately** (it is NOT in this zip). Do not commit it anywhere,
  and do not place it in any client-side file.
- Set it only as a **Vercel Environment Variable** (encrypted at rest).
- `.env.example` lists the variable names. For local dev you'd copy it to `.env.local` (gitignored).

## Project layout
```
index.html      The whole app (login, Ask chat, Log-a-Fix, Review Queue, Browse; 235-entry KB embedded)
api/ask.js      POST /api/ask    — answers, library-first, optional web fallback
api/screen.js   POST /api/screen — AI screen for tech-submitted fixes
package.json    Node >= 18 (functions use global fetch; no dependencies)
vercel.json     Function settings (maxDuration 60s for the two-pass + web search)
.env.example    Variable names (copy to .env.local for local dev)
```

## How the API works
- **POST `/api/ask`** `{ question, history[], context[] }` → `{ source:"library"|"web"|"none", answer, entries[] }`
  Pass 1 answers strictly from the library entries the page sends in `context`. If the library doesn't
  cover it and `WEB_FALLBACK=true`, Pass 2 uses the Anthropic `web_search` tool and marks the answer as
  `web`. The system prompt also keeps it on POS/fuel/payment topics only.
- **POST `/api/screen`** `{ sys, symptom, found, fix, who }` → `{ verdict:"accept"|"clarify"|"reject", reason, clarifying_question, cleaned{...} }`
  Screens tech-submitted fixes (rejects anecdotal/junk before a manager sees them).

## Environment variables  (Vercel → Project → Settings → Environment Variables)
| Name | Required | Default | Notes |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | yes | — | Provided separately by Ali. Set for Production (and Preview if you want preview testing). |
| `WEB_FALLBACK` | no | `true` | `true` allows web search when the library lacks an answer. |
| `ANSWER_MODEL` | no | `claude-sonnet-4-6` | Confirm the exact model name in Ali's Anthropic Console → Models. |
| `SCREEN_MODEL` | no | `claude-haiku-4-5-20251001` | Cheap model for the screen step. |
| `WEB_SEARCH_TOOL` | no | `web_search_20250305` | Anthropic web-search tool version. |
| `ALLOWED_ORIGIN` | no | unset | Only needed if the app is served from a different domain than the API. Same-project Vercel: leave unset. |

## Deploy
**Option 1 — Git + Vercel dashboard (recommended)**
1. Put these files in a Git repo (the repo root = this folder).
2. Vercel → Add New → Project → import the repo. Framework preset: **Other** (zero-config).
3. Add the environment variables above (at minimum `ANTHROPIC_API_KEY`).
4. Deploy. App serves at `/`, API at `/api/ask` and `/api/screen` (same origin, no CORS needed).

**Option 2 — Vercel CLI**
```
npm i -g vercel
vercel            # set up the project (accept defaults)
vercel --prod     # production deploy
```
Set env vars in the dashboard or with `vercel env add ANTHROPIC_API_KEY production`.

## Access control (important — this is an internal tool)
Put the deployment **behind a login**:
- Easiest on Vercel Pro: enable **Deployment Protection / Vercel Authentication** (only invited users)
  or **Password Protection** on the project.
- Or wire it into APEC's existing site auth / a middleware password.
- The `apec` password on the app's login screen is **only a front-end placeholder for demos — not real
  security**. Remove or replace it and rely on the platform login.

## Models note
If Anthropic returns a "model not found" error, the model names differ for this account. Open the
Anthropic Console → **Models** and set `ANSWER_MODEL` / `SCREEN_MODEL` to the exact names shown.

## Quick test after deploy
1. Open the deployed URL (through the login). App password: `apec` (until real auth is wired).
2. Ask "pump stuck on blue at 0.00" → answers from the library, green **APEC Verified**.
3. Ask a brand-new problem → amber **From the web** (if `WEB_FALLBACK` is on).
4. Ask "what's the weather" → it should politely decline (scope-limited).
5. Log a Fix with a real fix → switch the role toggle to **Service Manager** → it's in the Review Queue → Approve.

## Data persistence note (v1)
Tech submissions and approvals are stored per-browser (localStorage), with a Settings → Export to JSON.
Ali folds new fixes and invoice batches into the next version of the embedded knowledge base. If you
later want submissions shared server-side across all users, that's a small add-on (a KV store or DB
behind a third function) — not required for v1.
