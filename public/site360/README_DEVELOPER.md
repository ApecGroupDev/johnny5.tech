# SITE 360 — APEC Site Profile Database — Web App (Developer Handoff)

**App name:** SITE 360 (front-end branding/logo already built into `index.html`).

## What this is
A search-first web app over **1,433 APEC site profiles** (Verifone POS install records
consolidated from Peggy's workbooks) plus **3,527 service-call records**. It is a single
page of plain HTML/CSS/JavaScript — **no framework, no build step, no CDN/third-party
requests, no API keys, and no AI/LLM calls.** All searching happens in the browser.

**Included in this package**
- `index.html` — the app. Runs out of the box in DEMO mode with the data embedded.
- `data/sites.json` — the 1,433 site records (database seed; same shape the app reads).
- `data/service_calls.json` — the 3,527 service-call rows (join to a site on `sheet` + `workbook`).
- `reference/APEC_Site_Profiles_MASTER.xlsx` — human-readable master with a **Field Dictionary**
  tab that decodes every field code.

## Run the demo (about a minute)
Serve the folder with any static server, e.g.:
```
cd APEC_SiteProfiles_WebApp
python3 -m http.server 8080      # then open http://localhost:8080
```
(You can also just double-click `index.html`.) Search, brand/state filters, the record
detail view, and **Print / Save-PDF** all work immediately. Add / Edit / Notes also work —
but in demo mode they are **not saved** (see the next section).

## ⭐ Where does edited data get saved? (please read)
**Demo mode — `USE_BACKEND = false` (the default):** when a user edits a site or adds a note,
the change updates the in-memory copy so they can see it, but **nothing is written anywhere** —
no file, no localStorage, no server. A page refresh discards it. This is intentional: access
and persistence are meant to live server-side.

**Production mode — `USE_BACKEND = true`:** the app reads from and writes to your API.
- On load it reads `GET /api/sites` and `GET /api/service-calls`.
- When a user clicks **Save** on Add or Edit (the Notes field included), the app calls `apiSave()`:
  - new site → `POST /api/sites`
  - existing site → `PUT /api/sites/:id`
- **Your server handler writes that record to the database.** That is the single place edited
  data and notes are persisted.

In short: today nothing is saved; once you implement the hooks below and set
`USE_BACKEND = true`, every edit and note is written to your database.

## Integration points (all near the top of the `<script>` in `index.html`)
1. `const USE_BACKEND` → set to `true`.
2. `const API_BASE` → your REST base path (default `/api`).
3. `async function loadData()` → already fetches `/sites` and `/service-calls`.
4. `async function apiSave(rec, isNew)` → already POSTs/PUTs. **This is the write path.**

Nothing else needs to change — search, the detail view, printing, and the forms are all
backend-agnostic.

## Backend to provide
> **Note:** this package ships the front-end **and the data** (`data/*.json` = a point-in-time
> seed). It does **not** include a running database or server — those are what you build and
> seed from the JSON. Once live, the database becomes the evolving master.

### Auth / access
The app has **no built-in login** — put it behind your SSO/session middleware and protect both
the page and every `/api/*` route. Restrict Add/Edit to admin users. The app sends
`credentials:"include"`, so a session cookie is honored; return 401/403 to deny.

### Endpoints
| Method | Path | Purpose | Returns |
|---|---|---|---|
| GET | `/api/sites` | all site records | array of site objects |
| GET | `/api/service-calls` | all service-call rows | array |
| POST | `/api/sites` | create a site | the created object, including `_id` |
| PUT | `/api/sites/:id` | update a site (incl. `NOTES`) | the updated object |
| GET | `/api/export?format=json\|csv\|xlsx` | full current dataset for backup / records (admin) | file download |
| DELETE | `/api/sites/:id` (optional) | remove a site | 204 |

### Data model
A site is a **flat JSON object** of `FIELD_CODE: "value"` (see `data/sites.json`). Key fields:
- `_id` — stable identifier; use as the primary key.
- `_sheet`, `_source` — provenance (original tab + workbook). Service calls join on these.
- `NOTES` — the free-form notes field added in the app.
- Everything else is decoded in the Excel **Field Dictionary** tab
  (e.g. `SERVICE_ID`, `TUNNEL_IP`, `COMMANDER_R1`, `SC_JOB_HISTORY`).

Fields are **sparse** — any can be missing. Don't assume a fixed column set; store the record
as JSON/JSONB (Postgres) or a document (Mongo), or an EAV/keyed table.

Service-call object: `{ sheet, workbook, brand, name, address, city, state, date, ticket, tech, desc, raw }`.

### Database & seeding
Any store works. Simplest is a `sites` table with a `JSONB data` column, or a document
collection. Seed by importing `data/sites.json` and `data/service_calls.json`. For the
user-admin requirement, add `updated_by` / `updated_at` on writes (an edit-audit table is a plus).

## Getting the data back out (backup & your records)
The live database is the evolving master. To pull copies for record-keeping and safekeeping,
implement any/all of these — all **admin-only, behind login**:

1. **On-demand export** — `GET /api/export?format=json|csv|xlsx` returns the full current dataset
   as a download. Optionally surface it as an admin-only **"Download master"** button in the app.
   (This is the controlled, server-gated version of the per-user export that was removed for security.)
2. **Scheduled backups to Box (recommended for safekeeping)** — a nightly/weekly server job dumps
   the database to timestamped files (a JSON **and** an Excel master in the same layout as
   `reference/APEC_Site_Profiles_MASTER.xlsx`) and writes them into the Box `Site_Profile` folder
   (or cloud storage / email). Set-and-forget; you always hold dated, point-in-time copies.
3. **Database-native backups** — also enable DB snapshots / `pg_dump` for disaster recovery
   (infrastructure, separate from the readable copies above).

Regenerating the Excel master from the database reuses the column layout already in the reference
file, so your exported master looks exactly like the one in this package.

## Security notes
- Serve over **HTTPS**, behind auth. This data includes operational details — site IP/tunnel
  addresses, **security-question answers, and pump passwords** — so it must not be public.
- In production, do **not** expose `data/*.json` as public URLs; they are DB seeds, not an API.
  Serve data only through the authenticated `/api`.
- Consider role-based redaction (hide passwords / security answers from non-admins).
- The app makes no outbound third-party calls; nothing phones home.

## Print / PDF
Built in. On a record, **Print / Save PDF** opens the browser print dialog with a clean
one-record layout — choose "Save as PDF." No library required.

## Regenerating the data
`data/*.json` were produced by consolidating Peggy's four `Site info*.xlsx` workbooks with a
label-driven parser (handles the shifting layouts and shorthand). Re-running that consolidation
reproduces these files; point your import at the refreshed JSON, or wire a scheduled re-import.

## Changes in this version (vs. the first build)
1. Record view now has **Print / Save-PDF**.
2. **Removed** the Save/Export-to-file UI (security).
3. **Removed** the client-side password gate (access is handled server-side).
4. **Notes** — free-form field in the editor, shown prominently at the top of the profile.
5. **Clear** fully resets to a clean slate with no residual results.
