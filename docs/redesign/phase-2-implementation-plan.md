# Phase 2 — Recommended Implementation Plan

Do **not** start Phase 2 automatically. This is the handoff from Phase 1 foundation.

## Goals

Replace homepage featured-work presentation and `/work` portfolio UX to match approved V2 prototypes, while preserving cinematic intro, booking/inquiry flows, i18n routing, and official logos.

## Reuse vs replace

| Surface | Recommendation |
| --- | --- |
| `CinematicIntro` / preload | **Reuse as-is** |
| `Header` / `Footer` / `Logo` / `LanguageSwitcher` / `ThemeToggle` | **Reuse**; restyle tokens/spacing to prototype navy + `#00AEEF` |
| `MobileMenu` | **Reuse** (prototype hides links ≤900px — wire to existing drawer) |
| `Button` / `Container` / `Section` | **Reuse** with token updates; avoid one-off HTML classes |
| `Hero` + `hero-*` | **Replace layout/copy** to match prototype hierarchy; keep booking CTAs wired |
| `FeaturedWork` + `lib/featured-work.ts` | **Replace** with flagship + card grid fed by `lib/portfolio` |
| `WorkExperience` / `WorkCases` / `WorkHero` / `lib/work.ts` | **Replace** case grid with filtered portfolio + detail panel; keep route `/work` |
| Booking shell / consultation modal | **Reuse** |
| About / Company / Services / Contact | **Defer** visual pass; keep routes; optional CTA alignment only |
| Legacy work images under `public/images/work-*` | Keep files; stop featuring once new registry is live |

## Suggested component boundaries

```text
components/sections/portfolio/
  portfolio-hero.tsx          # Our Work / homepage work intro
  featured-flagship.tsx       # Summit & Stone browser chrome + thumbs
  project-card-grid.tsx       # Non-flagship cards (home) / filter grid (work)
  project-filters.tsx         # Category pills (all/websites/software/commerce)
  project-case-study.tsx      # Detail header, group tabs, CTAs
  project-gallery.tsx         # Main shot + thumb strip
  project-lightbox.tsx        # Full-screen gallery (focus trap, arrows, Esc)
  demo-cta.tsx                # Live demo + disclaimer
  portfolio-closing-cta.tsx   # Start Your Project → book-consultation

components/sections/hero/     # Refactored homepage hero matching prototype
```

Data: import only from `lib/portfolio` (and next-intl for labels).

## Implementation sequence

1. **Tokens:** migrate CSS primary `#007CFD` → `#00AEEF`; soft tints/gradients; document serif display font choice
2. **i18n:** add `Portfolio.*` (and Home flagship) keys EN+ES — translate carefully; do not machine-invent case claims
3. **Lightbox + gallery primitives** (accessible, keyboard)
4. **`/work` redesign** using registry filters + case study panel
5. **Homepage** flagship + four cards; retire old FeaturedWork media mapping
6. **Demo CTAs** open verified `demo.url` only; show `disclaimer`
7. **Visual QA** against stripped HTML + owner screenshots; mobile nav
8. **SEO** metadata for work/project anchors if deep-links added

## Explicit non-goals (Phase 2)

- Inventing dashboard-only URLs or production metrics
- Embedding prototype HTML or base64 images
- Removing cinematic intro
- Database migrations
- Changing logo artwork

## Risks carried into Phase 2

- Brand blue mismatch until tokens update (live `#007CFD` vs approved `#00AEEF`)
- Prototype uses Inter + Georgia; live uses Geist — font decision needed
- Legacy portfolio copy in `messages/*.json` (`Work.cases.*`) becomes unused — clean up after cutover
- JPEG screenshots vs manifest `.webp` names — optional later convert with `cwebp`/`sharp`
- Large LCP images: use `next/image`, priority only on covers, `object-position: top` for UI shots
