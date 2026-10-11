# MASTER.md — Natalie Netania Sulistio · Portfolio design system

Single source of truth. Every colour, font, radius, shadow and duration in `src/` comes from here
(`src/index.css` holds the CSS variables, `tailwind.config.ts` maps them).

## Theses (validated by brief: "feminine-aesthetic modern, like the references")

**Visual.** A light "profile app" built on Natalie's own Canva palette: cream ground `#fff6e5`,
milk-white widget cards, blush surfaces (`#ffd8d1` / `#fdcac6`), one rose accent (`#ef6a85`) for
decoration and a deeper rose (`#b8365a`) wherever text must stay legible. Content sits in large
rounded app-window frames (40px) holding smaller floating widget cards (22–28px), elevated with
soft rose-tinted shadows, never hard borders. Type: **IM Fell English** for headings (the serif
Natalie already chose for her Canva portfolio, carried over for continuity), **Pinyon Script**
only for her name laid over her photo (the calligraphic overlay of the references), **Plus
Jakarta Sans** for all UI and body (an Indonesian-made grotesque, legible at small sizes). Airy
spacing on an 8px base.

**Interaction.** Soft, medium timing (180ms hovers, 320ms state changes, 600–800ms entrances),
one ease-out curve `cubic-bezier(.22,1,.36,1)`. Hover lifts cards 4px and deepens the rose shadow;
images inside scale to 1.03. Sections reveal once on scroll with a short stagger (anime.js).
Forbidden: bounce/elastic, infinite loops on decoration, layout-property animation, scroll-jacking.
`prefers-reduced-motion` shows everything immediately and stops the player autoplay.

**Allowed patterns:** app-window frame with dark icon rail (refs: medical dashboard, Makoto);
script name overlay on the hero photo (ref: Makoto); clay wax-seal and star ornaments (Natalie's
own Canva assets); layered blush cloud band at the hero base (ref: pink "sweet candy" UI);
"now viewing" player widget that really cycles her works (ref: Jazzlyn profile card); social
icon pill bar (ref: Makoto); translucent glass only on the floating nav pill (ref: pink UI).

## Colour tokens

| Token | Hex | Use |
|---|---|---|
| `--background` cream | `#fff6e5` | page ground |
| `--card` milk | `#fffdf9` | widget cards |
| `--foreground` ink | `#4b2833` | body text (11.9:1 on cream) |
| `--muted-foreground` | `#7a5560` | secondary text (5.9:1 on cream, 4.9:1 on blush) |
| `--primary` rose-deep | `#b8365a` | buttons (white text 5.7:1), small accent text (5.3:1 on cream) |
| `--rose` | `#ef6a85` | decoration, large display accents only (2.8:1, never body text) |
| `--blush` | `#ffd8d1` | soft surfaces, active pills |
| `--blush-2` | `#fdcac6` | deeper surface, cloud band |
| `--petal` | `#ffc6c5` | cloud band, chips |
| `--accent-foreground` | `#a8304f` | text on blush (5.0:1) |
| `--border` | `#f3d6cf` | hairline when needed |
| `--ink-rail` | `#4b2833` | dark icon rail |

## Type scale (fluid)

- Display: IM Fell English 400, `clamp(2.6rem, 6vw, 4.75rem)`, line-height 1.02
- H2: IM Fell English 400, `clamp(2.1rem, 4.2vw, 3.25rem)`, line-height 1.08
- H3: IM Fell English 400, 1.5rem
- Script name: Pinyon Script, `clamp(4.5rem, 11vw, 9rem)`
- Body: Plus Jakarta Sans 400, 1rem / 1.7
- Small/label: Plus Jakarta Sans 600, 0.75rem, letter-spacing 0.04em

## Spacing

8px base: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Sections: 96px (mobile 64px) vertical.

## Radii

`--radius-window` 40px · `--radius-card` 28px · `--radius-widget` 22px · `--radius-img` 18px · pill 9999px

## Shadows

- `shadow-soft`: `0 1px 0 rgba(255,255,255,.9) inset, 0 12px 32px -16px rgba(184,54,90,.28)`
- `shadow-lift`: `0 1px 0 rgba(255,255,255,.9) inset, 0 22px 44px -18px rgba(184,54,90,.38)`
- `shadow-window`: `0 40px 90px -40px rgba(184,54,90,.40), 0 2px 0 rgba(255,255,255,.9) inset`

## Motion tokens

- `--dur-fast` 180ms · `--dur-base` 320ms · `--dur-slow` 640ms
- `--ease-out` `cubic-bezier(.22,1,.36,1)`
- stagger 70ms

## Components

- **Button primary**: rose-deep fill, white text, pill, `shadow-soft`; hover darker + lift 2px; focus 3px rose ring offset 2px; disabled 50% opacity.
- **Button soft**: milk fill, ink text, blush ring; hover blush fill.
- **Chip**: blush fill, accent-foreground text, pill, 12px semibold.
- **Widget card**: milk fill, `radius-widget`, `shadow-soft`, 20–24px padding.
- **Window**: milk 80% + white border, `radius-window`, `shadow-window`.
