# Phase 1 — Architecture Audit & Safety

**Checkpoint tag:** `checkpoint/phase1-redesign-pre` @ `754b93c`  
**Branch at audit:** `main` (clean, tracking `origin/main`)  
**Date context:** 2026-11-04

## Stack

| Area | Finding |
| --- | --- |
| Next.js | `15.5.21` App Router (`app/[locale]/…`) |
| React | `19.1.0` |
| TypeScript | `strict`, path alias `@/*` |
| Tailwind | v4 via `@tailwindcss/postcss`, tokens in `styles/globals.css` |
| i18n | `next-intl` — locales `en` / `es`, prefix always, cookie `NEXT_LOCALE` |
| Themes | `next-themes` class strategy, default `system` |
| Motion | `framer-motion` |
| UI | shadcn / Base UI primitives under `components/ui` |

## Routes (preserved)

`/`, `/services`, `/work`, `/company`, `/about`, `/contact`, `/book-consultation`, `/empezar`, `/referral`, `/privacy`, `/terms` — all under `[locale]`.  
API: `app/api/inquiry/route.ts`.

## Localization

- Routing: `i18n/routing.ts`, middleware via `next-intl`
- Messages: `messages/en.json`, `messages/es.json`
- Navigation labels from next-intl (`lib/navigation.ts` keys only)
- New portfolio registry is EN-sourced and localization-ready (`LocalizedText`); ES copy intentionally deferred to Phase 2 message wiring

## Hero & cinematic

- Homepage: `CinematicPreload` + `CinematicIntro` then `Hero`, `BuiltAroundBusiness`, `FeaturedWork`, `WhatWeCanBuild`, `HowWeWork`
- Media under `public/cinematic/{en,es}/` with long-cache headers in `next.config.ts`
- **Do not replace** cinematic with prototype placeholders

## Brand / theme

- Live primary: `#007CFD` (`styles/globals.css`, `lib/design-tokens.ts`)
- Approved redesign blue: `#00AEEF` (prototype + owner brief)
- Official logos: `public/logos/corevia-nav-logo-{light,dark}.png` via `components/shared/logo.tsx` — never recreate

## Existing portfolio data (legacy)

- `lib/work.ts` + `lib/featured-work.ts` power current `/work` and homepage featured blocks (financial, vidaGreen, alchones, cleaningOs, lending, automation examples)
- Phase 1 adds `lib/portfolio/*` **alongside** — no UI swap yet

## Forms & booking

- Inquiry API + Command Station lead capture + optional Resend (`lib/inquiry-*`, `.env.example`)
- Calendly: `NEXT_PUBLIC_CALENDLY_URL`
- Booking modal / consultation flows under `components/sections/book-consultation/`

## SEO

- `generateMetadata` on locale layout + pages
- `metadataBase` / canonical / `alternates.languages` from `lib/site.ts`
- Default site URL env: `NEXT_PUBLIC_SITE_URL` (example still mentions localhost:3000; production domains below)

## Production deployment

| Item | Value |
| --- | --- |
| Vercel project | `coreviasoftware` (`prj_spkz9Ya5piQsVkgjBKX7b72K53RA`) |
| Team | `pobladoaisolution` |
| Git | `danielsernab90/corevia-web` → **`main` is production branch** |
| Domains | `coreviasoftware.vercel.app`, **`corevia-web-iota.vercel.app`**, git-main alias |
| Latest production | SHA `754b93c` (matches local HEAD at checkpoint) |
| Config | No `vercel.json`; Next preset |

Pushing to `main` triggers production. Phase 1 foundation commit is intentional for that path after validation.

## Data dependencies

- Optional SQLite via `better-sqlite3` / Command Station (`COMMAND_STATION_DB_PATH`) — inquiry path only
- Nest `server/` leads DB — **no migrations in Phase 1**
- No database changes required or performed

## Scripts

- `npm run typecheck` → `tsc --noEmit`
- `npm run lint` → `eslint .`
- `npm run build` → `next build --turbopack`
- `npm run validate:portfolio` → asset/registry integrity (added Phase 1)
- No dedicated unit test suite in `package.json`

## Missing resources at locate-time

| Resource | Status |
| --- | --- |
| `reference/redesign-v2/` (expected path) | Did not exist — created |
| Downloads package | Readable by tools; shell `listdir` blocked by macOS sandbox |
| Full HTML with base64 | Not copied into git (3.5MB × 2); stripped analysis copies + JSON/CSS extracted |
| Manifest / README | Copied into `reference/redesign-v2/` |
| Optimized `.webp` from manifest | Prototype names kept; Phase 1 ships `.jpg` via `sips` (no `cwebp` on machine) |
