# Approved HTML V2 — Prototype Analysis

Visual source of truth (not application architecture):

- `reference/redesign-v2/corevia-homepage-v2.stripped.html`
- `reference/redesign-v2/corevia-our-work-v2.stripped.html`
- Full self-contained originals remain in `~/Downloads/corevia-five-project-html-prototypes-v2/` (~3.5MB each with embedded media)

## Layout & section hierarchy

### Homepage

1. Sticky dark navy header (logo, Home / Our Work / Approach / Contact, Start Your Project CTA)
2. Dark gradient hero (overline, serif display headline with brand-blue accent line, supporting copy, dual CTAs)
3. Soft section: “Our Work” split heading + **flagship** Summit & Stone feature (copy + browser-chrome visual + thumbnail strip)
4. Two-column project cards for remaining four projects
5. Approach / capability section
6. Closing consultation CTA
7. Dark footer

### Our Work

1. Same sticky header
2. Hero introducing portfolio
3. Category filter pills: All / Websites / Business Software / Ordering & Commerce
4. Two-column portfolio grid
5. Case-study detail panel (tabs per screenshot group, main shot, thumbs, demo CTAs)
6. Full-screen lightbox modal (prev/next/Esc)
7. Closing CTA

## Design tokens (prototype)

| Token | Value |
| --- | --- |
| Brand blue | `#00AEEF` |
| Navy | `#07121e` / `#0d1c2b` |
| Ink | `#13232e` |
| Muted | `#718391` |
| Cream | `#f5f6f4` |
| Line | `#dfe5e8` |
| Page bg | `#f7f9fa` |

**Note:** Live site currently uses `#007CFD`. Aligning to `#00AEEF` is a Phase 2 visual change — do not flip tokens casually mid-flight.

## Typography

- Display / headlines: Georgia / Times New Roman serif (`.display`)
- UI / body: Inter system stack in the prototype
- Overlines: uppercase, wide tracking, brand blue
- Live site uses Geist — Phase 2 should decide whether to add a serif display face or map `.display` to an approved font

## Buttons

- Primary: filled `#00AEEF`, dark text, ~9px radius, lift on hover
- Outline: transparent + light border (on dark surfaces)
- Ink: `#14232d` fill for secondary project CTAs
- Filter pills: rounded-full; active = brand blue fill

## Cards & galleries

- Project cards: white, 1px border, 17–18px radius, image `aspect-ratio ≈ 1.94`, `object-position: top`
- Flagship visual: faux browser chrome + main shot + horizontal thumbs
- Case study: dark detail header, group tabs, main shot `object-fit: contain` for dashboards, thumb strip
- Lightbox: full-viewport dark overlay, contain-fit image, circular controls

## Spacing & responsive

- Container max-width `1260px`, side padding `34px` → `19px` on small screens
- Section padding `100px` → `65px` ≤900px
- ≤900px: single-column feature/grid; hide desktop nav links
- ≤600px: tighter type and nav; slightly taller image aspect (`1.65`)

## Portfolio behavior to preserve in Phase 2

- Category filters driven by `category` tags
- Screenshot groups as tabs (Business Website / Construction OS / …)
- Thumb selection updates main shot
- Click main shot → lightbox; keyboard arrows + Escape
- Dual CTAs: Explore / case study + Live Demo (external verified URL)
- Demo status disclaimers under CTAs
- Mobile: collapse nav links (reuse existing `MobileMenu` rather than prototype-only hide)

## Motion

- Button / card: `translateY(-2px/-4px)` + brightness / soft shadow (~200ms)
- No cinematic video in prototypes — **keep existing CoreVia cinematic intro**

## Project CTA placement

- Flagship: Try Live Demo + Explore Case Study
- Cards / grid: Explore Project + Live Demo
- Detail header: Try Live Demo + Open Website (same verified URL in Phase 1)
- Closing band: Start Your Project → existing book-consultation route
