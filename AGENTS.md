# Lenny Peters Portfolio — Agent Guidelines

## Commands

```bash
npm run dev          # Start dev server (local E2E auto-starts this)
npm run check        # Full CI: lint → jest --ci (no coverage)
npm run lint         # ESLint only
npm test             # Jest watch mode
npm test -- --ci     # Jest single run (CI, excludes src/app/layout.tsx and not-found.tsx)
npm run build        # Production export build
npm run format       # Prettier auto-format
npm run format:check # Prettier check only
```

## E2E Testing

```bash
npm run test:e2e           # Local dev (starts server, uses NEXT_PUBLIC_BASE_PATH='')
npm run test:e2e:ui        # Interactive Playwright UI
npm run test:e2e:prod      # Against https://lennypeters.com via E2E_TEST_URL
E2E_TEST_URL=<url> npm run test:e2e     # Any URL, no local server
```

**Critical**: Local E2E sets `NEXT_PUBLIC_BASE_PATH=''` automatically. CI overrides with `CI=true`. Production tests use `E2E_TEST_URL` to skip local server.

## Git Hooks (Mandatory)

- **pre-commit**: `npx lint-staged` → Prettier + ESLint on staged files
- **pre-push**: `npm run check` → Full CI with coverage required

Pre-push failure blocks commits. Run locally before pushing.

## Structure & Conventions

```
src/
 ├── app/           # Next.js App Router pages (pages/lazy)
 ├── components/    # Isolated component folders
 │                  └── my-comp/
 │                      index.tsx
 │                      my-comp.module.scss
 │                      my-comp.test.tsx
 ├── data/          # Static JSON datasets
 ├── lib/           # Utilities, parsers, helpers
 └── styles/        # Global SCSS partials (variables, mixins, grid)

content/articles/   # Markdown blog posts
e2e/               # Playwright specs per route
```

**Imports**: `@/*` → `./src/*`. Default export from `index.tsx`.
**Styling**: CSS Modules + custom SCSS only. No Tailwind or inline styles.
**Tests**: `.test.tsx` in same folder as source. Prefer `getByRole` queries.

## Key Gotchas

1. **basePath auto-magic**: `next.config.ts` sets `/repo-name` on GitHub Pages, but local E2E uses `NEXT_PUBLIC_BASE_PATH=''`. CI E2E explicitly clears it via env override.

2. **No typecheck command**: TypeScript runs implicitly via ESLint (`npm run lint`).

3. **CI pipeline order**: research → code → lint → unit tests → e2e → docs sync → summary

4. **Images**: Unoptimized remotely (remotePatterns configured for unsplash).

5. **Prettier**: 100 char width, 2-space indent, single quotes, no semicolons. EditorConfig enforces LF + final newline.

6. **SCSS**: Global imports happen once in `layout.tsx`. Use `@include responsive(breakpoint)` for media queries.

## Agents & Skills

Use Copilot hooks to invoke agents before tool use:

- `/pipeline` → Full workflow
- `/research` → Context7 docs lookup (MCP)
- `/code` → Code only, no validation
- `/lint` → Lint + auto-fix
- `/testing` → Jest + RTL tests
- `/e2e-testing` → Playwright + browser diagnosis
- `/figma-design` → Figma → React implementation

Read `.github/AGENT_LEARNINGS.md` first for active rules extracted from past failures.
