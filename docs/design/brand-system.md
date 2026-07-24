# Corevia Brand System

Single source of truth for Corevia’s visual identity across the marketing site and future product surfaces (including platforms like DanielOS).

Implementation lives in:

- `styles/globals.css` — CSS tokens, gradients, elevation, utilities
- `lib/design-tokens.ts` — TypeScript reference map
- `lib/motion.ts` — motion variants
- `lib/icons.ts` — Lucide defaults
- `components/ui/*` and `components/layout/section.tsx` — consuming primitives

---

## Brand philosophy

Corevia builds technology businesses rely on. The brand should feel:

| We are | We are not |
| --- | --- |
| Professional, premium, calm | Generic agency templates |
| Intelligent and precise | AI-hype neon / crypto energy |
| Minimal and spacious | Marketing clutter |
| Enterprise-ready | Overly playful startup |

Design rule of thumb: **clarity over decoration**. Every color, type size, and motion should help someone understand the product faster.

---

## Color palette

| Token | Light | Role |
| --- | --- | --- |
| `primary` | `#1E4FFF` | Brand actions, links, focus rings |
| `secondary` | `#0F172A` | Strong contrast surfaces / secondary buttons |
| `accent` | `#5AA9FF` | Highlights, charts, soft emphasis |
| `background` | `#FFFFFF` | Page canvas |
| `surface` | `#F8FAFC` | Alternate bands, subtle panels |
| `border` | `#E2E8F0` | Dividers, input borders |
| `muted-foreground` | `#64748B` | Supporting copy |
| `success` | `#22C55E` | Positive status |
| `warning` | `#F59E0B` | Caution status |
| `error` | `#EF4444` | Destructive / errors |

### Usage rules

- Prefer semantic tokens (`bg-primary`, `text-muted-foreground`) — never paste hex into components.
- Dark mode remaps the same roles; do not invent one-off dark colors in components.
- Keep large brand blue areas intentional (CTAs, accents). Do not flood the page with primary.

### Gradients (reusable utilities)

| Utility | Definition | Use |
| --- | --- | --- |
| `bg-gradient-primary` | `#1E4FFF → #5AA9FF` | Rare emphasis (badges, special CTAs) |
| `bg-gradient-surface` | `#FFFFFF → #F8FAFC` | Soft section washes |
| `bg-hero-glow` | `rgba(30,79,255,.15)` radial | Hero atmosphere |
| `text-gradient-primary` | same as primary gradient | Sparse typographic accent |

---

## Typography

Font: **Geist** (already installed via `next/font`). Geometric, modern, enterprise-clean.

| Token | Class | Role |
| --- | --- | --- |
| Hero | `text-hero` | Homepage / campaign lead |
| Display | `text-display` | Large marketing titles |
| H1 | `text-h1` | Page titles |
| H2 | `text-h2` | Section titles |
| H3 | `text-h3` | Subsections / cards |
| Body Large | `text-body-lg` | Lead paragraphs |
| Body | `text-body` | Default copy |
| Caption | `text-caption` | Meta, helpers |
| Label | `text-label` | Eyebrows, field labels (uppercase tracking) |

Sizes use `clamp()` for responsive scaling. Prefer `<Heading />` and `<Text />` over raw classes when possible.

---

## Spacing

Semantic scale (also available as Tailwind spacing keys):

| Token | Value | Typical use |
| --- | --- | --- |
| `xs` | 0.25rem | Tight icon gaps |
| `sm` | 0.5rem | Compact stacks |
| `md` | 1rem | Default stack |
| `lg` | 1.5rem | Component padding |
| `xl` | 2rem | Group separation |
| `2xl` | 3rem | Block separation |
| `3xl` | 4rem | Large rhythm |
| `4xl` | 6rem | Major breaks |
| `section` / `section-sm` / `section-lg` | 6 / 4 / 8rem | Section vertical padding |
| `gutter` / `gutter-lg` | 1.5 / 2rem | Horizontal page gutters |

Sections should feel **spacious**. Prefer `Section` spacing variants over arbitrary `py-*`.

---

## Border radius

| Token | Value | Use |
| --- | --- | --- |
| `sm` | 0.375rem | Inputs, small chips |
| `md` | 0.5rem | Compact controls |
| `lg` | 0.75rem | Buttons, default cards |
| `xl` | 1rem | Large panels |
| `pill` | 9999px | Language switcher only (rare) |

Premium, not bubble-like. Avoid rounding everything to pill.

---

## Elevation

Apple-soft shadows — low contrast, large blur, no Material stacking.

| Utility | Use |
| --- | --- |
| `elevation-sm` | Resting cards / dashboard previews |
| `elevation-md` | Feature cards |
| `elevation-lg` | Rare modal / prominent panels |
| `elevation-hover` | Hover lift companion |

---

## Buttons

Defined in `components/ui/button.tsx`.

### Variants

| Variant | When to use |
| --- | --- |
| `default` (Primary) | Main conversion actions |
| `secondary` | Strong alternate (navy) when primary is already present nearby |
| `outline` | Secondary path beside a primary CTA |
| `ghost` | Header utilities, icon toolbars |
| `link` | Inline textual actions |
| `gradient` | Sparing marketing emphasis |
| `destructive` | Dangerous actions |

### Sizes

| Size | When to use |
| --- | --- |
| `xs` / `sm` / `default` / `lg` | App chrome & forms |
| `cta` | Hero and closing-band conversion buttons |

Example:

```tsx
<Button size="cta">Book a Free Consultation</Button>
<Button variant="outline" size="cta">Explore Our Work</Button>
```

---

## Cards

Defined in `components/ui/card.tsx`.

| Variant | When to use |
| --- | --- |
| `default` | Standard content container |
| `feature` | Marketing feature blocks |
| `glass` | Over gradients / hero atmospheres |
| `dashboard` | Product UI previews |
| `hover` | Clickable tiles that lift |

```tsx
<Card variant="feature">
  <CardHeader>
    <CardTitle>…</CardTitle>
    <CardDescription>…</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
</Card>
```

---

## Icons

- Library: **Lucide React only**
- Style: outlined
- Stroke: `1.5` (enforced via `svg.lucide` + `lib/icons.ts` `coreviaIconProps`)
- Prefer outline icons; filled only for tiny status dots if needed

```tsx
import { Check } from "lucide-react";
import { coreviaIconProps } from "@/lib/icons";

<Check {...coreviaIconProps} aria-hidden />
```

---

## Animations

Defined in `lib/motion.ts`, wrappers in `components/shared/motion.tsx`.

| Variant / helper | Intent |
| --- | --- |
| `heroFade` / `<HeroFade>` | Hero entrance |
| `sectionReveal` / `<SectionReveal>` | Band enter-on-scroll |
| `staggerGrid` / `<StaggerGrid>` | Feature / logo grids |
| `cardHover` / `<CardHover>` | Soft card lift |
| `buttonHover` / `<MotionButton>` | CTA micro-interaction |
| `imageFloat` / `<ImageFloat>` | Decorative float |
| `glowPulse` / `<GlowPulse>` | Status / accent pulse |

Keep motion subtle. No bounce, no flashy loops on primary content.

---

## Section backgrounds

`Section` `tone` prop:

| Tone | Surface |
| --- | --- |
| `default` | Transparent |
| `white` | Background |
| `surface` | Surface gray |
| `muted` | Muted |
| `gradient` | `bg-gradient-surface` |
| `dark` | Secondary navy |
| `accent` | Primary blue (use sparingly) |
| `hero` | Background + pair with `bg-hero-glow` overlays |

```tsx
<Section tone="surface" spacing="lg">…</Section>
```

---

## Accessibility rules

1. Visible focus rings via `ring` token — never remove focus styles.
2. Color is not the only signal (pair status color with icon/text).
3. Maintain contrast: primary on white, white on primary/secondary.
4. Motion should respect user preference when adding new loops; keep decorative motion optional.
5. All user-facing strings go through `next-intl` — brand docs do not replace i18n.

---

## Component usage checklist

Before shipping UI:

- [ ] Colors from tokens only
- [ ] Spacing from scale / Section variants
- [ ] Type via Heading/Text or type tokens
- [ ] Shadows via `elevation-*`
- [ ] Gradients via brand utilities
- [ ] Icons Lucide outlined @ 1.5
- [ ] Motion from `lib/motion` helpers
- [ ] Copy from translation files

---

## Scaling to a product platform (DanielOS and beyond)

This system is intentionally **role-based**, not page-based:

1. **Shared tokens** (`styles/globals.css`) stay identical across marketing and product shells.
2. **Marketing** consumes spacious Section / Hero / Feature card patterns.
3. **Product UI** (DanielOS, dashboards) reuses the same primary/secondary/surface/border tokens with denser spacing (`sm`/`md`) and `Card variant="dashboard"`.
4. New products add **features**, not new palettes — extend components, don’t fork colors.
5. If a product needs a unique accent, add a **namespaced token** (e.g. `--danielos-accent`) that still maps into the Corevia blue family, documented here before use.

That keeps Corevia recognizable whether someone lands on the website or opens a platform product.
