---
name: figma-design
description: >
  Translates a Figma design into production-ready React components with 1:1 visual fidelity.
  Use when the user provides a Figma URL or asks to implement a Figma design, build from Figma,
  or create UI from Figma specs. Requires the Figma MCP server to be connected.
  Invoke inline with /figma-design in any prompt.
---

# Figma Design Skill

Use this skill to implement a Figma design as React components following this project's conventions. You will need the Figma MCP server connected and a Figma frame URL.

## When to use this skill

- User provides a Figma URL (contains `figma.com/design/`)
- User says "implement this design", "build from Figma", "match this Figma frame"
- You need to translate visual design specs into code

## Step-by-step workflow

### Step 1 — Parse the Figma URL

From `https://figma.com/design/:fileKey/:name?node-id=X-Y`, extract:

- **fileKey**: segment after `/design/`
- **nodeId**: value of the `node-id` query parameter (e.g. `42-15`)

### Step 2 — Fetch design context

```
get_design_context(fileKey="<fileKey>", nodeId="<nodeId>")
```

Gets: layout, typography, colors, design tokens, component structure, spacing.

If response is too large → use `get_metadata` first, then fetch individual child nodes.

### Step 3 — Capture screenshot

```
get_screenshot(fileKey="<fileKey>", nodeId="<nodeId>")
```

This is the **visual source of truth**. Reference it throughout and validate against it at the end.

### Step 4 — Download assets

Use `localhost` asset URLs returned by the MCP server directly. Do not substitute icon packages or placeholders. Place static assets in `public/`.

### Step 5 — Map design tokens to project SCSS

**Colors** (match to `src/styles/variables.scss`):

- Primary blue → `$primaryColor`
- Light blue / info → `$infoColor`
- Success green → `$successColor`
- Warning yellow → `$warningColor`
- Danger red → `$dangerColor`
- Dark inverse → `$inverseColor`
- Body text → `$primaryText` / `$secondaryText`
- Borders → `$dividerColor`

Use exact hex values for colours not in the palette.

**Typography** (match to `src/styles/typography.scss`):

- Serif body → `$serif`
- Sans-serif headings → `$sansSerif`
- Mono → `$monoSpaced`

**Layout**: use `.container` / `.row` / `.col-xs-*` through `.col-lg-*` grid classes.

**Responsive**: use `@include responsive(tablet|laptop|desktop|phablet|mobileonly)`.

### Step 6 — Implement the component

Structure:

```
src/components/<component-name>/
  index.tsx              ← default export, TypeScript, interface ComponentNameProps
  <component-name>.module.scss   ← CSS Modules
```

Rules:

- CSS Modules for all component styles (`className={styles.x}`)
- Global class names (`.container`, `.wrapper`, `.row`, `.col-*`) applied as plain strings
- `"use client"` only if browser APIs or React hooks are needed
- No Tailwind, no inline `style={{}}` props
- Semantic HTML + ARIA attributes

### Step 7 — Validate against the screenshot

Check each item before marking done:

- [ ] Layout (spacing, alignment, sizing)
- [ ] Typography (font, size, weight, line height)
- [ ] Colors (exact match or closest variable)
- [ ] Responsive behaviour at mobile and desktop widths
- [ ] Assets rendered (no placeholders)
- [ ] Interactive states (hover, focus, active) if shown
- [ ] Accessibility (semantic elements, ARIA, keyboard navigation)

Fix any failures before presenting the result.
