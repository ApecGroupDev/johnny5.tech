# johnny5.tech — Full Codebase & Website Audit

**Date:** 2026-08-03  
**Auditor:** Antigravity (automated deep-dive)  
**Scope:** Security · Performance · SEO · Accessibility · Code Quality · Legal

---

## Executive Summary — Top 6 Issues

> [!CAUTION]
> **1. PRODUCTION API KEYS & DATABASE CREDENTIALS ARE COMMITTED IN `.env`**
> The `.env` file is tracked in the local workspace and contains **live Anthropic API keys**, **Railway MySQL credentials for two databases**, and the `NEXTAUTH_SECRET`. Although `.env*` is listed in `.gitignore`, the file exists locally and the `NEXTAUTH_SECRET` is literally `"change-me-to-a-random-secret"` — this is a non-random secret in active use.

> [!CAUTION]
> **2. NO MIDDLEWARE FILE EXISTS — `proxy.ts` IS DEAD CODE**
> The file `proxy.ts` at the project root **looks** like it should be `middleware.ts`, but Next.js only picks up `middleware.ts` (or `.js`). Because it's named `proxy.ts`, **none of the matcher-based auth guards in it are active**, meaning `/apps/:path*` and `/admin/:path*` are NOT protected at the middleware layer. Server-side `redirect()` calls in each page file are the only protection line.

> [!WARNING]
> **3. NO RATE LIMITING, CAPTCHA, OR BRUTE-FORCE PROTECTION ON LOGIN**
> The `/api/auth/[...nextauth]` endpoint and the `/api/admin/users` POST (create user) endpoint accept unlimited attempts. There is no CAPTCHA, honeypot, IP rate limiter, or account lockout mechanism.

> [!WARNING]
> **4. ZERO HTTP SECURITY HEADERS CONFIGURED**
> `next.config.ts` is completely empty. There is no `Content-Security-Policy`, no `Strict-Transport-Security`, no `X-Frame-Options`, no `Referrer-Policy`, and no `Permissions-Policy` configured. The iframes embedding external apps (ruby-queen.vercel.app, pulse-360-apec.vercel.app, etc.) are also completely unsandboxed.

> [!WARNING]
> **5. NO PRIVACY POLICY, TERMS OF SERVICE, OR COOKIE CONSENT**
> The site collects user credentials, stores sessions via JWTs, and processes personal data (name, email, passwords) — but has no Privacy Policy, Terms of Service, or any legal disclosure page.

> [!IMPORTANT]
> **6. NO `sitemap.xml` OR `robots.txt` — SEO IS BLIND**
> There is no `sitemap.xml`, no `robots.txt`, incomplete Open Graph metadata (OG image uses a relative URL), no Twitter Card meta, and no structured data / JSON-LD schema markup of any kind.

---

## Findings Table

| Severity | Category | Issue | File / Location | Fix |
|----------|----------|-------|-----------------|-----|
| **CRITICAL** | Security | Live API keys & DB creds in `.env` | [.env](file:///c:/Projects/johnny5.tech/.env) | Rotate ALL keys/secrets immediately. Ensure `.env` is never committed. Use a secrets manager. |
| **CRITICAL** | Security | `NEXTAUTH_SECRET` is a default placeholder | [.env:5](file:///c:/Projects/johnny5.tech/.env#L5) | Generate a cryptographically random secret: `openssl rand -base64 32` |
| **CRITICAL** | Security | `proxy.ts` is dead code — no middleware protection | [proxy.ts](file:///c:/Projects/johnny5.tech/proxy.ts) | Rename to `middleware.ts` |
| **HIGH** | Security | No rate limiting on login or admin API | [route.ts](file:///c:/Projects/johnny5.tech/app/api/auth/%5B...nextauth%5D/route.ts) | Add rate limiter (e.g., `upstash/ratelimit` or custom IP tracker) |
| **HIGH** | Security | No CSRF protection on admin PATCH/DELETE/POST | [route.ts](file:///c:/Projects/johnny5.tech/app/api/admin/users/route.ts) | Validate origin/referer header or use CSRF tokens |
| **HIGH** | Security | No HTTP security headers | [next.config.ts](file:///c:/Projects/johnny5.tech/next.config.ts) | Add `headers()` config with CSP, HSTS, X-Frame-Options, Referrer-Policy |
| **HIGH** | Security | iframes unsandboxed — no `sandbox` attribute | Multiple app pages | Add `sandbox="allow-scripts allow-same-origin"` to all iframes |
| **HIGH** | Security | `dangerouslySetInnerHTML` in hero (XSS vector) | [hero.tsx:663](file:///c:/Projects/johnny5.tech/app/components/hero.tsx#L663) | Use CSS modules or a `<style>` component instead |
| **HIGH** | Legal | No Privacy Policy or Terms of Service | Site-wide | Create `/privacy` and `/terms` pages |
| **HIGH** | Legal | No cookie/analytics consent disclosure | Site-wide | Even without analytics, the JWT session cookie needs disclosure |
| **MEDIUM** | Security | Admin API: no input sanitization on user creation | [route.ts:48](file:///c:/Projects/johnny5.tech/app/api/admin/users/route.ts#L48) | Validate and sanitize `name`, email, `role`, `allowedApps` with zod |
| **MEDIUM** | Security | Password policy too weak — only `minLength={6}` on client | [admin-dashboard.tsx:481](file:///c:/Projects/johnny5.tech/app/admin/admin-dashboard.tsx#L481) | Enforce min 8 chars + complexity server-side |
| **MEDIUM** | SEO | No `robots.txt` file | Missing entirely | Create `app/robots.ts` using Next.js metadata API |
| **MEDIUM** | SEO | No `sitemap.xml` | Missing entirely | Create `app/sitemap.ts` using Next.js metadata API |
| **MEDIUM** | SEO | OG image uses relative URL (`/logos/apec-logo.webp`) | [layout.tsx:31](file:///c:/Projects/johnny5.tech/app/layout.tsx#L31) | Use absolute URL: `https://johnny5.tech/logos/apec-logo.webp` |
| **MEDIUM** | SEO | No Twitter Card metadata | [layout.tsx:22](file:///c:/Projects/johnny5.tech/app/layout.tsx#L22) | Add `twitter` metadata object |
| **MEDIUM** | SEO | No structured data / JSON-LD | Site-wide | Add Organization schema, WebApplication schema |
| **MEDIUM** | SEO | App page titles are bare strings without site suffix | All app pages | Use template: `"PULSE 360 \| Johnny5"` |
| **MEDIUM** | Accessibility | Login form labels not associated with `htmlFor`/`id` | [page.tsx:93-117](file:///c:/Projects/johnny5.tech/app/login/page.tsx#L93-L117) | Add matching `htmlFor` + `id` pairs |
| **MEDIUM** | Accessibility | Admin form labels not associated with `htmlFor`/`id` | [admin-dashboard.tsx:430-500](file:///c:/Projects/johnny5.tech/app/admin/admin-dashboard.tsx#L430-L500) | Add matching `htmlFor` + `id` pairs |
| **MEDIUM** | Accessibility | Color contrast: `text-white/35`, `text-white/20` used extensively | Login, Apps sections | Many text elements fall below WCAG 2.1 AA 4.5:1 ratio |
| **MEDIUM** | Accessibility | No `aria-label` on icon-only delete/edit buttons in admin table | [admin-dashboard.tsx:348-363](file:///c:/Projects/johnny5.tech/app/admin/admin-dashboard.tsx#L348-L363) | Add descriptive `aria-label` attributes |
| **MEDIUM** | Accessibility | Error messages not live-announced to screen readers | Login, Admin forms | Wrap errors in `aria-live="polite"` region |
| **MEDIUM** | Performance | `StarsBackground` canvas instantiated 4+ times simultaneously | Hero, AppsSection, Login, Admin | Reuse a single global instance or use IntersectionObserver to pause off-screen canvases |
| **MEDIUM** | Performance | `BackgroundEffects` runs a full-screen RAF loop permanently | [background-effects.tsx](file:///c:/Projects/johnny5.tech/app/components/background-effects.tsx) | Add visibility-based pause (Page Visibility API) |
| **MEDIUM** | Performance | Hero component is 851 lines / 32KB — monolithic | [hero.tsx](file:///c:/Projects/johnny5.tech/app/components/hero.tsx) | Break into `GlobeCanvas`, `ConnectorCanvas`, `EcosystemNode`, `Hero` subfiles |
| **MEDIUM** | Performance | Logo images served as PNG (33KB, 10KB, 6KB) instead of WebP | [public/logos/](file:///c:/Projects/johnny5.tech/public/logos) | Convert to WebP (already have `apec-logo.webp` at 11KB vs PNG at 33KB) |
| **MEDIUM** | Code | Command palette has stale/broken app routes | [command-palette.tsx:24-26](file:///c:/Projects/johnny5.tech/app/components/command-palette.tsx#L24-L26) | Fix: `pulse-360` → `/apps/pulse-360` (not `/apps/project-updates`), `site360` → `/apps/site-360` (not `/apps/site360`) |
| **MEDIUM** | Code | Duplicated `Info` component defined locally in 4 app pages | pulse-360, rain-risk, ruby-queen, site-360 | Extract to shared component |
| **MEDIUM** | Code | Duplicated page layout across 4 app pages | pulse-360, rain-risk, ruby-queen, site-360 | Use `AppDetailLayout` pattern (canopy-configurator already does this) |
| **LOW** | Performance | `rain-risk-dashboard.html` (39KB) served as static HTML in public | [public/rain-risk-dashboard.html](file:///c:/Projects/johnny5.tech/public/rain-risk-dashboard.html) | Consider minification or moving to external hosting like other apps |
| **LOW** | Performance | Dual PNG+WebP logos kept in public — PNG versions unused by code | Logo files | Remove unused PNG duplicates |
| **LOW** | Code | `typewriter.tsx` component is never imported/used | [typewriter.tsx](file:///c:/Projects/johnny5.tech/app/components/motion/typewriter.tsx) | Dead code — remove or use |
| **LOW** | Code | `prisma.config.ts` defines migrations path but no migrations exist | [prisma.config.ts](file:///c:/Projects/johnny5.tech/prisma.config.ts) | Using `db push` is fine for now, but consider migrations for production |
| **LOW** | Code | `sync-users.ts` hardcodes reference to "alihusain.me" database | [sync-users.ts:3](file:///c:/Projects/johnny5.tech/prisma/sync-users.ts#L3) | Document or remove if no longer needed |
| **LOW** | SEO | Home page has no meta description beyond layout default | [page.tsx](file:///c:/Projects/johnny5.tech/app/page.tsx) | Export page-level `metadata` with richer description |
| **LOW** | Accessibility | Skip-to-content link: `z-60` may not be a valid Tailwind v4 value | [layout.tsx:51](file:///c:/Projects/johnny5.tech/app/layout.tsx#L51) | Verify or use `z-[60]` |
| **LOW** | Accessibility | Mobile hamburger menu lacks focus trap | [site-header.tsx:125-163](file:///c:/Projects/johnny5.tech/app/components/site-header.tsx#L125-L163) | Add focus trap when mobile menu is open |

---

## Detailed Findings by Category

### 1. Recon — Tech Stack & Architecture

| Layer | Detail |
|-------|--------|
| **Framework** | Next.js 16.2.9 (App Router), React 19.2.4 |
| **Styling** | Tailwind CSS v4, PostCSS, custom design tokens in `globals.css` |
| **Auth** | NextAuth v4 (CredentialsProvider), bcryptjs, JWT sessions |
| **ORM** | Prisma 6.19.3, MySQL (Railway-hosted) |
| **Animation** | Framer Motion 12.42, custom canvas animations |
| **Icons** | Lucide React |
| **Utilities** | clsx + tailwind-merge (`cn()` helper) |
| **Deployment** | Designed for Vercel, no Docker config found |

**Stack Mismatches vs. README:**
- README mentions `@next-auth/prisma-adapter` — ✅ confirmed in package.json and `auth.ts`
- README says "No external LLM SDKs" — but `.env` contains **two Anthropic API keys** (`PROJECT_UPDATES_ANTHROPIC_API_KEY`, `RUBY_QUEEN_ANTHROPIC_API_KEY`), which are likely consumed by the embedded external apps (not this codebase directly)
- README doesn't mention `SOURCE_DATABASE_URL` or the user sync script

---

### 2. Security & Data Handling

#### 🔴 CRITICAL: Exposed Secrets in `.env`

```env
# These are LIVE credentials visible in the workspace:
DATABASE_URL="mysql://root:BGTYygSCljbiHdVbUVBWuYTVsawYlQLX@reseau.proxy.rlwy.net:40755/railway"
NEXTAUTH_SECRET="change-me-to-a-random-secret"
PROJECT_UPDATES_ANTHROPIC_API_KEY="sk-ant-api03-HUsQABe..."
RUBY_QUEEN_ANTHROPIC_API_KEY="sk-ant-api03-LLPpLZSb6..."
SOURCE_DATABASE_URL="mysql://root:3faf23c2b3a6735dd03087cea895d679@..."
```

**Impact:** Anyone with repo access has full database access and API key usage. The NEXTAUTH_SECRET being a default string means **JWTs can be forged by anyone**.

#### 🔴 CRITICAL: `proxy.ts` Is Not Active Middleware

The file [proxy.ts](file:///c:/Projects/johnny5.tech/proxy.ts) contains `withAuth` middleware config:

```ts
export default withAuth({ pages: { signIn: "/login" } });
export const config = { matcher: ["/apps/:path*", "/admin/:path*"] };
```

Next.js requires this file to be named `middleware.ts` at the project root. Since it's named `proxy.ts`, **this code never executes**. The only auth protection is server-side `getServerSession()` + `redirect()` in each page, which works but is a fragile, single-layer defense.

#### 🟡 No Input Validation on Admin API

The `POST` and `PATCH` handlers in [route.ts](file:///c:/Projects/johnny5.tech/app/api/admin/users/route.ts) do `await req.json()` without schema validation:

```ts
const { email, password, name, role, active, allowedApps } = await req.json();
```

A malicious admin could inject unexpected fields, set arbitrary roles, or provide malformed data. Use `zod` for runtime validation.

#### 🟡 No Brute-Force Protection

The login flow goes directly through NextAuth's `CredentialsProvider.authorize()` with no rate limiting, failed attempt tracking, or CAPTCHA.

---

### 3. Performance & Core Web Vitals

#### Multiple Simultaneous Canvas Animations

The site runs **at minimum 2 full-screen canvas animations** on every page:
1. **`BackgroundEffects`** — fixed, full-viewport canvas drawing 440 objects per frame (280 distant stars + 160 warp streaks)
2. **`StarsBackground`** — section-level canvas drawing 360 objects per frame, instantiated in Hero, AppsSection, Login, and Admin pages

On the home page specifically, there are additionally:
3. **`GlobeCanvas`** — complex 3D globe with orbital rings, dot grids, rotating labels
4. **`ConnectorCanvas`** — bezier path animation with flowing packets

**Total: 4 concurrent `requestAnimationFrame` loops on the home page**, none of which pause when the tab is hidden or when they scroll off-screen.

> [!TIP]
> Use the **Page Visibility API** (`document.hidden`) to pause RAF loops when the tab is inactive. Use `IntersectionObserver` to pause canvases when off-screen.

#### Image Optimization

| File | Size | Issue |
|------|------|-------|
| `apec-logo.png` | 33KB | WebP version exists at 11KB — PNG is unused |
| `mpc-logo.png` | 10KB | No WebP version |
| `geo-logo.png` | 6KB | No WebP version |
| `rain-risk-dashboard.html` | 39KB | Monolithic self-contained HTML |

The hero uses `next/image` with `fill` and `sizes="60px"` for logos — this is good. But the PNG source files are unnecessarily large for 60px display.

#### LCP Concerns

The hero renders a large canvas + text content. The canvas has no fallback and draws asynchronously, meaning the **Largest Contentful Paint will be the text headings**, which is acceptable. However, the `loading="lazy"` on iframes is good practice.

---

### 4. SEO & Structured Data

#### Missing Files
- ❌ No `robots.txt` — search engines get no crawl guidance
- ❌ No `sitemap.xml` — search engines can't discover pages
- ❌ No JSON-LD structured data

#### Incomplete Metadata
- Open Graph image URL is relative (`/logos/apec-logo.webp`) — must be absolute for social sharing
- No `twitter` card metadata configured
- App sub-pages use bare `title` strings without the site name suffix
- No canonical URLs set

#### Command Palette Routes Are Wrong (Would Be 404s)
In [command-palette.tsx](file:///c:/Projects/johnny5.tech/app/components/command-palette.tsx#L24-L26):
```ts
{ id: "pulse-360", label: "PULSE 360", href: "/apps/project-updates" },  // ❌ should be /apps/pulse-360
{ id: "site360",   label: "SITE 360",  href: "/apps/site360" },           // ❌ should be /apps/site-360
```

These would generate **404 errors** if users navigate via the command palette.

---

### 5. Accessibility (WCAG 2.1 AA)

#### Form Label Association: FAIL
**Zero** `htmlFor`/`id` pairs found across the entire codebase. Every `<label>` wraps its description text but is NOT programmatically linked to its `<input>`:

```tsx
// Login — no association
<label className="...">Registry Key (Email)</label>
<input type="email" ... />  // No id attribute

// Admin — no association
<label className="...">Designation (Name)</label>
<input type="text" ... />   // No id attribute
```

**Impact:** Screen readers cannot associate labels with inputs.

#### Color Contrast: MULTIPLE FAILURES
Extensive use of very low-opacity text classes:
- `text-white/20` (~0.20 opacity on black ≈ #333 on #000 = **1.22:1 ratio** — fails 4.5:1)
- `text-white/35` (~0.35 opacity ≈ **1.66:1 ratio** — fails)
- `text-white/45` (~0.45 opacity ≈ **2.36:1 ratio** — fails)

Even `text-muted` (defined as `#a1a1aa`) on black (`#000`) gives about **5.5:1** which passes, but many decorative texts use opacity values far below the minimum.

#### Missing ARIA
- Icon-only buttons (edit/delete in admin table) have `title` but no `aria-label`
- Error messages in forms are not wrapped in `aria-live` regions
- Modal dialogs in admin and access-denied use `AnimatePresence` but don't manage focus trap
- Command palette dialog has `role="dialog"` and `aria-modal="true"` ✅ (good)

#### Positive Accessibility Findings
- ✅ Skip-to-content link present in root layout
- ✅ `prefers-reduced-motion` media query implemented in CSS
- ✅ `useReducedMotion()` hook used in Reveal and Typewriter components
- ✅ Focus-visible outlines configured globally
- ✅ `lang="en"` set on `<html>`
- ✅ `font-display: swap` on Google Fonts

---

### 6. Code Quality & Architecture

#### Dead / Orphan Code
| Item | Location | Issue |
|------|----------|-------|
| `proxy.ts` | Project root | Should be `middleware.ts` or deleted |
| `typewriter.tsx` | `components/motion/` | Imported nowhere — dead code |
| `app-previews.tsx` exports (`CadPreview`, `RainPreview`, etc.) | `_components/` | These preview components are defined but rendered nowhere in the current card implementation — they're exported but unused |

#### Duplicated Patterns
The `Info` helper component is **defined locally 4 times** (identically) in:
- [pulse-360/page.tsx:182](file:///c:/Projects/johnny5.tech/app/apps/pulse-360/page.tsx#L182)
- [rain-risk/page.tsx:102](file:///c:/Projects/johnny5.tech/app/apps/rain-risk/page.tsx#L102)
- [ruby-queen/page.tsx:129](file:///c:/Projects/johnny5.tech/app/apps/ruby-queen/page.tsx#L129)
- [site-360/page.tsx:101](file:///c:/Projects/johnny5.tech/app/apps/site-360/page.tsx#L101)

Similarly, the page layout (back link, header, iframe frame, info grid) is duplicated across 4 pages when `AppDetailLayout` already exists and is used by `canopy-configurator`.

#### Monolithic Components
- [hero.tsx](file:///c:/Projects/johnny5.tech/app/components/hero.tsx) is **851 lines** containing 5 distinct components (`GlobeCanvas`, `ConnectorCanvas`, `EcosystemNode`, `StatBadge`, `Hero`). Should be split into separate files.
- [admin-dashboard.tsx](file:///c:/Projects/johnny5.tech/app/admin/admin-dashboard.tsx) is **585 lines** mixing data table, modal, form, and stat cards. Should be decomposed.

#### `dangerouslySetInnerHTML` in Hero

```tsx
<style dangerouslySetInnerHTML={{ __html: `...keyframes...` }} />
```

While the content is a static string (not user input), this is a code smell. Use CSS modules or a `<style jsx>` pattern instead.

---

### 7. Legal & Compliance

| Requirement | Status | Risk |
|-------------|--------|------|
| Privacy Policy | ❌ Missing | HIGH — collects PII (name, email, password) |
| Terms of Service | ❌ Missing | MEDIUM |
| Cookie Consent Banner | ❌ Missing | MEDIUM — JWT session cookie is set |
| Analytics Disclosure | ✅ N/A | No analytics scripts detected |
| GDPR / Data Deletion | ❌ No mechanism | HIGH if EU users exist |

---

## Quick Wins (High Impact, Low Effort)

1. **Rename `proxy.ts` → `middleware.ts`** — instant middleware protection for all app/admin routes. Zero code changes needed inside the file.

2. **Regenerate `NEXTAUTH_SECRET`** — run `openssl rand -base64 32` and update `.env`. One line change.

3. **Fix command palette routes** — change two `href` strings in [command-palette.tsx](file:///c:/Projects/johnny5.tech/app/components/command-palette.tsx#L24-L26):
   ```diff
   -{ id: "pulse-360", ..., href: "/apps/project-updates" },
   +{ id: "pulse-360", ..., href: "/apps/pulse-360" },
   -{ id: "site360", ..., href: "/apps/site360" },
   +{ id: "site360", ..., href: "/apps/site-360" },
   ```

4. **Add `robots.txt` and `sitemap.xml`** — create `app/robots.ts` and `app/sitemap.ts` using Next.js metadata API (< 20 lines each).

5. **Make OG image URL absolute** — change `/logos/apec-logo.webp` to `https://johnny5.tech/logos/apec-logo.webp` in [layout.tsx:31](file:///c:/Projects/johnny5.tech/app/layout.tsx#L31).

6. **Add `sandbox` attribute to all iframes** — add `sandbox="allow-scripts allow-same-origin allow-forms"` to the 5 iframe elements across app pages.

7. **Add `htmlFor`/`id` pairs** to login and admin form labels — straightforward attribute additions.

8. **Convert remaining PNG logos to WebP** and remove unused PNG duplicates.

---

## Longer-Term Recommendations

1. **Security Headers in `next.config.ts`** — implement a comprehensive `headers()` function:
   ```ts
   async headers() {
     return [{
       source: "/(.*)",
       headers: [
         { key: "X-Frame-Options", value: "DENY" },
         { key: "X-Content-Type-Options", value: "nosniff" },
         { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
         { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
         { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
       ],
     }];
   }
   ```

2. **API Input Validation** — add `zod` schemas to all API route handlers for type-safe request body parsing.

3. **Rate Limiting** — implement per-IP rate limiting on `/api/auth/[...nextauth]` (login) and `/api/admin/users` endpoints. Consider `@upstash/ratelimit` with Vercel KV.

4. **Canvas Performance** — implement visibility-aware animation lifecycle:
   - Pause all RAF loops when `document.hidden === true`
   - Use `IntersectionObserver` to pause section-level canvases when off-screen
   - Deduplicate `StarsBackground` instances (single global canvas vs. per-section)

5. **Refactor App Pages** — migrate pulse-360, rain-risk, ruby-queen, and site-360 to use the existing `AppDetailLayout` component (like canopy-configurator already does), eliminating ~400 lines of duplication.

6. **Decompose Monoliths** — split `hero.tsx` (851 lines) and `admin-dashboard.tsx` (585 lines) into focused sub-components.

7. **Privacy & Legal Pages** — create `/privacy` and `/terms` pages. Add a cookie consent banner if you plan to add analytics.

8. **Structured Data** — add JSON-LD schema markup for `Organization` and `WebApplication` types to improve search visibility.

9. **Prisma Migrations** — move from `db push` to proper migrations for production database schema management.

10. **Rotate ALL Exposed Secrets** — the Anthropic API keys, Railway database passwords, and source database credentials visible in `.env` should all be considered compromised and rotated.
