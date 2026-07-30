---
name: Lenny Peters Portfolio
description: Senior Software Engineer II - AI systems, React, TypeScript, Next.js
colors:
  cyber-teal: '#00f0ff'
  neon-green: '#30f802'
  neon-magenta: '#ff00ff'
  wave-blue: '#3057f8'
  void-black: '#0e0e0e'
  surface-deep: '#1c1b1b'
  surface-mid: '#333232'
  signal-white: '#f6f6f6'
  signal-muted: '#c3c3c3'
typography:
  display:
    fontFamily: "'SF Mono', 'Fira Code', 'JetBrains Mono', Monaco, monospace"
    fontSize: 'clamp(1rem, 2vw, 1.25rem)'
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: '0.12em'
  headline:
    fontFamily: "'SF Mono', 'Fira Code', 'JetBrains Mono', Monaco, monospace"
    fontSize: '1.1rem'
    fontWeight: 700
    letterSpacing: '0.05em'
  body:
    fontFamily: 'Georgia, Times, serif'
    fontSize: '1rem'
    lineHeight: 1.6
    letterSpacing: 'normal'
  label:
    fontFamily: "'SF Mono', 'Fira Code', Monaco, monospace"
    fontSize: '0.7rem'
    fontWeight: 700
    letterSpacing: '0.15em'
rounded:
  sharp: '2px'
  card: '6px'
spacing:
  xs: '4px'
  sm: '8px'
  md: '16px'
  lg: '24px'
  xl: '32px'
  xxl: '48px'
  section: '64px'
components:
  button-primary:
    backgroundColor: '{colors.cyber-teal}'
    textColor: '{colors.void-black}'
    rounded: '{rounded.sharp}'
    padding: '8px 24px'
  button-primary-hover:
    backgroundColor: '#1af3ff'
    textColor: '{colors.void-black}'
  button-secondary:
    backgroundColor: 'transparent'
    textColor: '{colors.signal-white}'
    rounded: '{rounded.sharp}'
    padding: '8px 24px'
  button-secondary-hover:
    backgroundColor: 'transparent'
    textColor: '{colors.cyber-teal}'
  tag-chip:
    backgroundColor: 'transparent'
    textColor: '{colors.signal-muted}'
    rounded: '{rounded.sharp}'
    padding: '4px 8px'
  skill-badge:
    backgroundColor: 'rgba(0, 240, 255, 0.06)'
    textColor: '{colors.cyber-teal}'
    rounded: '{rounded.sharp}'
    padding: '4px 16px'
  card-surface:
    backgroundColor: '{colors.surface-deep}'
    textColor: '{colors.signal-white}'
    rounded: '0'
    padding: '24px'
---

# Design System: Lenny Peters Portfolio

## 1. Overview

**Creative North Star: "The Ghost in the Machine"**

This is a developer portfolio that proves its owner by being what it talks about. The aesthetic is a precision cyberpunk terminal -- not retro-kitsch, not sci-fi decoration, but the literal environment of someone who builds AI-to-production systems. Every interface choice reads as an engineering decision: the near-black void background is a terminal canvas, the neon teal is an active signal, the monospace type is the medium of the work itself.

The density is deliberate. Sections carry information efficiently -- the scanline overlay, HUD corner brackets, and glow tokens are atmosphere, not ornament. Motion earns its place (typewriter sequences, cursor blink, status-dot pulse) or does not exist. The register is brand: design IS the product. A CTO scanning this for 10 seconds should leave with a specific impression of how Lenny builds, not a generic "senior engineer" impression.

**What this system explicitly rejects:** corporate LinkedIn professionalism (buttoned-up, safe, zero POV), generic skill-list resume layouts (no personality, no evidence of craft), and over-engineered agency showpieces (scroll-jacking, motion as demo, substance-free).

**Key Characteristics:**

- Near-black canvas with a neon teal signal color -- committed palette, not restrained
- Monospace type everywhere it matters; serif body for prose; sans for taglines
- Structural glow: neon box-shadow is the primary depth signal
- Scanline overlays, glitch-on-hover, HUD corner brackets as environmental atmosphere
- 8-point grid throughout with deliberate variation for rhythm

## 2. Colors: The Void and Signal Palette

Three categories: void (the canvas), signal (active, interactive, branded), and atmosphere (muted tones that keep the darkness legible).

### Primary

- **Cyber Teal** (`#00f0ff`): The signal. All interactive elements, glowing borders, active state indicators, cursor, section headings. Applied with neon-glow text-shadow at three opacity layers (4px, 12px, 24px spread).

### Secondary

- **Neon Green** (`#30f802`): Shell command prompts (`$` character), success states, status dot. Commands in green, output in teal -- the classic terminal split.

### Tertiary

- **Neon Magenta** (`#ff00ff`): Reserved for glitch animation contrast only. Never used as a UI color at rest.
- **Wave Blue** (`#3057f8`): Info color for alerts or callouts only.

### Neutral

- **Void Black** (`#0e0e0e`): Page background. Near-black with a 3% opacity cyan grid overlay at 8px intervals.
- **Surface Deep** (`#1c1b1b`): Card and panel background. One tier lighter than the void; contrast creates depth without shadows.
- **Surface Mid** (`#333232`): Borders, dividers, inactive separators. Never as standalone text on the void -- fails WCAG AA.
- **Signal White** (`#f6f6f6`): Primary text. Off-white to reduce harshness against the dark canvas.
- **Signal Muted** (`#c3c3c3`): Secondary text -- descriptions, excerpts, metadata. 13:1+ contrast on void black.

### Named Rules

**The One Signal Rule.** Cyber Teal appears on no more than 15% of any screen surface area. Its rarity is the point.

**The Gray-On-Dark Prohibition.** Never use Surface Mid as standalone text on the void -- it fails WCAG AA. Use `rgba(signal-white, 0.35-0.45)` instead.

## 3. Typography

**Display/UI Font:** SF Mono / Fira Code / JetBrains Mono / Monaco / Cascadia Code / Courier New (monospace)
**Body Font:** Georgia / Times / Times New Roman (serif)
**Tagline Font:** Helvetica Neue / Helvetica / Arial (sans-serif)

**Character:** The mono stack is the voice of the system -- used for all section headings, UI labels, terminal content, tags, and interactive elements. It is not costume; it is the native language of the work. Serif appears only for prose body text. Sans-serif for taglines and marketing copy. Three families with clear roles, zero overlap.

### Hierarchy

- **Display** (700 weight, mono, 0.12em tracking, uppercase, 1rem): Section headings like `SELECTED_WORK`, `ARTICLES`, `EXPERTISE`. Small, precise, treated like terminal labels.
- **Headline** (700 weight, mono, 0.05em tracking, uppercase, 1.1rem): Card titles and project names.
- **Title** (400 weight, sans-serif, 1.15-1.25rem fluid): Taglines and hero descriptors.
- **Body** (400 weight, serif, 1rem, 1.6 line-height): Article content and prose. Max line length 65ch.
- **Label** (700 weight, mono, 0.1-0.2em tracking, uppercase, 0.65-0.75rem): Tags, chips, badges, metadata, pagination.

### Named Rules

**The Mono-First Rule.** When in doubt, use monospace. The system is a terminal environment. Serif and sans-serif are guests; mono is the host.

**The Uppercase Lock.** All monospace text above the Body tier uses `text-transform: uppercase`. Lowercase mono reads as raw code; uppercase mono reads as interface.

## 4. Elevation

This system does not use traditional box shadows for depth. Depth is conveyed through tonal layering (void-black to surface-deep to surface-mid) and structural glow (neon box-shadow as active-state signal). The darker the surface, the more a glowing border stands out -- depth is earned by proximity to the void.

### Shadow Vocabulary

- **Idle glow** (`0 0 0 1px rgba(#00f0ff, 0.08), 0 0 20px rgba(#00f0ff, 0.08), 0 4px 24px rgba(0,0,0,0.6)`): Default state on interactive containers. Barely perceptible -- presence without demand.
- **Active glow** (`0 0 0 1px rgba(#00f0ff, 0.20), 0 0 30px rgba(#00f0ff, 0.15), 0 4px 32px rgba(0,0,0,0.7)`): Hover state. The container announces itself.
- **Button glow** (`0 0 12px rgba(#00f0ff, 0.6), 0 0 30px rgba(#00f0ff, 0.3), 0 0 60px rgba(#00f0ff, 0.15)`): Primary button hover only. Most intense glow in the system.
- **Text glow** (neon-glow mixin: `text-shadow 0 0 4px / 12px / 24px rgba`): Section titles, active nav, prompt characters.

### Named Rules

**The Glow-Earns-Its-Place Rule.** Glow is a response to interaction, not decoration at rest. Idle glow is imperceptible; active glow is unmissable.

## 5. Components

### Buttons

Monospace type, 2px border-radius (square-cornered), uppercase tracked text. Two variants.

- **Primary:** Cyber Teal fill, Void Black text, `8px 24px` padding, 0.08em tracking, uppercase. Hover: lightened teal (`#1af3ff`), three-layer button glow at 60px max spread.
- **Secondary:** Transparent background, Signal White text at rest, `border: 1px solid rgba(#00f0ff, 0.3)`. Hover: border promotes to full teal, text shifts to teal, neon-border activates.

### Cards / Containers

Three tiers: terminal window (deepest), panel card (articles/projects), profile card.

- **Terminal Window:** `background: rgba(#0e0e0e, 0.9)`, `border: 1px solid rgba(#00f0ff, 0.25)`, `border-radius: 6px`, idle and active glow, chrome bar with macOS-style dots.
- **Panel Card:** `background: #1c1b1b`, `border: 1px solid rgba(#00f0ff, 0.15)`, `border-radius: 0`. HUD corner brackets (14px, 1px cyber-teal, top-left and bottom-right only). Hover: border opacity to 40% with neon-border glow.

### Tags / Chips

- **Tech tag:** `border: 1px solid #333232`, transparent background, Signal Muted text, 0.65rem mono, uppercase, sharp corners.
- **Expertise badge:** `rgba(#00f0ff, 0.06)` tinted bg, `border: 1px solid rgba(#00f0ff, 0.25)`, Cyber Teal text, 0.75rem mono, `gap: 8px` between `>` chevron and label.

### Section Headers

Repeating structural pattern: `[TITLE] ---- [decorative line] ---- [counter]`

- Title: 1rem mono, 700 weight, 0.12em tracking, uppercase, Cyber Teal, neon-glow, glitch-on-hover.
- Line: `flex: 1`, 1px, `linear-gradient(90deg, rgba(#00f0ff, 0.4), transparent)`.
- Counter: 0.7rem mono, Signal Muted, bracket notation: `[02_TOTAL_ENTRIES]`.

### Navigation

0.85rem mono, 0.04em tracking, uppercase. Active: `border-bottom: 1px solid cyber-teal`, teal text, neon-glow. Hover: teal text + glow, no background fill.

## 6. Do's and Don'ts

**Do:**

- Use Cyber Teal as the singular signal color -- interactive, active, highlighted elements only
- Apply neon glow in three layers (tight, mid, spread) for both text-shadow and box-shadow
- Use HUD corner brackets on panel cards for environmental authenticity
- Keep section heading `font-size` at `1rem` -- section titles are labels, not structural headings
- Cancel animations under `prefers-reduced-motion: reduce` while keeping elements fully visible
- Apply scanline overlays at 0.02-0.05 opacity only
- Use `gap: 8px` between the `>` chevron and skill label in expertise badges

**Don't:**

- Use thick `border-left` colored stripes as card accents -- use full borders and tinted backgrounds
- Apply gradient text (`background-clip: text`) -- use solid teal or solid white only
- Use Surface Mid as standalone text on the void -- fails WCAG AA
- Add accent colors outside the established palette
- Apply glow at rest on non-interactive elements -- glow is earned through interaction
- Use uppercase mono for body prose -- uppercase lock applies to UI labels only
- Exceed `border-radius: 6px` -- the terminal register demands square-cornered geometry
