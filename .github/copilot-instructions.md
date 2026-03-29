# Copilot Instructions

## Commands

```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build
npm run lint         # ESLint via next lint
npm test             # Jest unit/component tests (watch: npm run test:watch)
npm test -- -t "name" # Run a single test by name
npm run test:e2e     # Playwright e2e tests (requires dev server or starts it automatically)
npm run test:e2e:ui  # Playwright interactive UI mode
```

## Architecture

Next.js 15 (App Router) with React 19. No external UI library — styling is done entirely with custom SCSS.

**Page layout** is defined in `src/app/layout.tsx` and wraps all pages in `<Header> → <Main> → {children} → <Footer>`. Pages live in `src/app/` following App Router conventions.

**Components** are server components by default. Use `"use client"` only when browser APIs or React hooks are needed (e.g., `usePathname` in the Header for active link detection).

**Global styles** (`src/styles/`) are imported once in `layout.tsx`. They are structured as SCSS partials: `variables`, `mixins`, `typography`, `grid`, `layout`, `normalize`, `print`.

## Testing

### Unit / component tests (Jest + React Testing Library)
Test files live alongside components in a `__tests__/` folder and use the `.test.tsx` extension:
```
src/components/my-component/__tests__/my-component.test.tsx
```
Use `render` + `screen` queries from `@testing-library/react`. Prefer queries by role (`getByRole`) over test IDs. `@testing-library/jest-dom` matchers (e.g. `toBeInTheDocument`) are available globally via `jest.setup.ts`.

### E2e tests (Playwright)
E2e tests live in `e2e/` and use the `.spec.ts` extension. The `playwright.config.ts` points to `http://localhost:3000` and auto-starts `npm run dev` if no server is already running. Only Chromium is configured by default.



### Component structure
Each component gets its own folder with two files:
```
src/components/my-component/
  index.tsx
  my-component.module.scss
```
Export the component as the default export from `index.tsx`. Import with `@/components/my-component`.

### Styling
- **Component-scoped styles**: use CSS Modules (`.module.scss`), imported as `styles` and applied via `className={styles.myClass}`
- **Global/layout styles**: use plain class names from `src/styles/layout.scss` (e.g., `className="wrapper"`)
- **Never use inline styles or Tailwind** — this project uses SCSS only

### SCSS variables and mixins (available globally via `src/styles/global.scss`)
Key variables:
```scss
$primaryColor, $accentColor, $infoColor, $dangerColor, $warningColor, $successColor, $inverseColor
$primaryText, $secondaryText, $dividerColor
$serif, $sansSerif, $monoSpaced  // font stacks
```

Responsive mixin — use named breakpoints:
```scss
@include responsive(desktop)  // min-width: 70em
@include responsive(laptop)   // min-width: 64em
@include responsive(tablet)   // min-width: 50em
@include responsive(phablet)  // min-width: 37.5em
@include responsive(mobileonly) // max-width: 37.5em
```

### Grid system
A custom Bootstrap-style flexbox grid is available globally. Use `.container`, `.row`, and `.col-xs-*` / `.col-sm-*` / `.col-md-*` / `.col-lg-*` classes (1–12 columns).

### TypeScript
Define prop interfaces inline above the component using `interface ComponentNameProps`. Use `readonly` for props that shouldn't be mutated.

### Path alias
Use `@/` for all imports from `src/` (configured in `tsconfig.json`).
