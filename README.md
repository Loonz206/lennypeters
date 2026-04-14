# Lenny Peters — Personal Portfolio

[![Lighthouse CI](https://github.com/Loonz206/lennypeters/actions/workflows/lhci.yml/badge.svg)](https://github.com/Loonz206/lennypeters/actions/workflows/lhci.yml)

Personal portfolio site for [Lenny Peters](https://lennypeters.com), built with Next.js, React, TypeScript, and custom SCSS.

## Overview

This repository contains the source for a statically exported personal site featuring:

- a home page and supporting content pages
- a work section for selected projects
- long-form articles written in Markdown
- reusable components with colocated tests

## Stack

- Next.js 15 App Router
- React 19
- TypeScript
- SCSS with CSS Modules
- Jest and React Testing Library
- Playwright

## Project Structure

```text
src/
├── app/           # App Router pages
├── components/    # Reusable UI components
├── data/          # Static content and datasets
├── lib/           # Utilities and helpers
└── styles/        # Global SCSS partials
content/
└── articles/      # Markdown articles
```

## Running Tests

### Unit and component tests

```bash
npm test              # Watch mode
npm test -- --ci      # Single run (used in CI)
```

### E2E tests (Playwright)

```bash
npm run test:e2e            # Local dev — auto-starts the dev server
npm run test:e2e:prod       # Against https://lennypeters.com
E2E_TEST_URL=<url> npm run test:e2e:url  # Against any URL
npm run test:e2e:ui         # Interactive UI mode
```

Setting `E2E_TEST_URL` skips local server startup and points all tests at the given domain.

### Lighthouse / performance audit

```bash
# Build the static export, then run the full LHCI audit locally
NEXT_PUBLIC_BASE_PATH='' npm run build
npx @lhci/cli@0.14.x autorun
```

The audit runs automatically on every pull request via the **Lighthouse CI** GitHub Actions workflow.
Performance budgets (LCP, FCP, TBT, CLS, Speed Index, TTI) and minimum Lighthouse scores (≥ 90 for
Performance, Accessibility, Best Practices, and SEO) are defined in `lighthouserc.js`.

## Notes

The site is statically exported and deployed through GitHub Actions. After each successful deploy to `main`, a production E2E job runs automatically against `https://lennypeters.com`. A standalone on-demand job is also available in the Actions tab (`E2E Tests — Production`).
