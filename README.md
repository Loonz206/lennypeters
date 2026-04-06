# Lenny Peters — Personal Portfolio

[![CI](https://github.com/Loonz206/lennypeters/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Loonz206/lennypeters/actions/workflows/ci.yml)
[![coverage: ≥80%](https://img.shields.io/badge/coverage-%E2%89%A580%25-brightgreen)](https://github.com/Loonz206/lennypeters/actions/workflows/ci.yml)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Personal portfolio site for [Lenny Peters](https://lennypeters.com) — Senior Software Engineer. Built with Next.js 15 App Router, statically exported, and deployed to the edge.

---

## Tech Stack

| Layer      | Technology                                                                       |
| ---------- | -------------------------------------------------------------------------------- |
| Framework  | [Next.js 15](https://nextjs.org) (App Router, `output: 'export'`)                |
| UI         | [React 19](https://react.dev) + TypeScript                                       |
| Styling    | Custom SCSS (CSS Modules, no Tailwind)                                           |
| Unit Tests | [Jest](https://jestjs.io) + [React Testing Library](https://testing-library.com) |
| E2E Tests  | [Playwright](https://playwright.dev) (Chromium)                                  |
| Linting    | ESLint (`next/core-web-vitals`)                                                  |
| Formatting | [Prettier](https://prettier.io) via lint-staged                                  |

---

## Getting Started

```bash
npm install
npm run dev        # Start dev server at http://localhost:3000
```

---

## Commands

```bash
npm run dev          # Development server (hot reload)
npm run build        # Production build → static export to out/
npm run lint         # ESLint
npm test             # Jest unit + component tests (watch mode)
npm run test:e2e     # Playwright e2e tests (auto-starts dev server)
npm run format       # Prettier — format all files
npm run format:check # Prettier — check without writing
```

---

## CI/CD

Three parallel jobs run on every push and pull request, and a deploy job publishes to GitHub Pages from `main` after they pass:

| Job            | What it does                                                               |
| -------------- | -------------------------------------------------------------------------- |
| **Lint**       | `npm run lint`                                                             |
| **Unit Tests** | `npm test -- --ci --coverage` — enforces ≥ 80% coverage across all metrics |
| **E2E Tests**  | Builds a static export, serves it with `npx serve`, runs Playwright        |
| **Deploy**     | Builds `out/` and deploys it to GitHub Pages when `main` passes CI         |

Coverage threshold is enforced in `jest.config.js` — the `Unit Tests` job fails if any metric (statements, branches, functions, lines) drops below **80%**.

To enable GitHub Pages for this repository:

1. Go to **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push to `main` and wait for the `Deploy GitHub Pages` job to publish the site.

This repository is configured for a user or organization Pages site. The Next.js export uses `trailingSlash: true`, which emits folder-based routes like `/about/index.html` for reliable deep-linking on GitHub Pages.

### Preparing lennypeters.com (custom domain)

When you are ready to move this site to `lennypeters.com`, use this order:

1. Verify `lennypeters.com` in your GitHub account Pages settings (domain verification TXT record).
2. In repository **Settings -> Secrets and variables -> Actions -> Variables**, set:
   - `NEXT_PUBLIC_SITE_URL=https://lennypeters.com`
3. Keep **Settings -> Pages -> Source** set to **GitHub Actions**, then set **Custom domain** to `lennypeters.com`.
4. Configure DNS at your registrar:
   - Apex (`@`): `A` records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Optional IPv6: `AAAA` records to `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - `www`: `CNAME` to `Loonz206.github.io`
5. After DNS propagation, enable **Enforce HTTPS** in Pages settings.

Notes:

- The CI workflow automatically sets `NEXT_PUBLIC_BASE_PATH` to empty when `NEXT_PUBLIC_SITE_URL` is configured, so your custom domain serves from root (`/`) instead of `/lennypeters`.
- Avoid wildcard DNS records (for example `*.lennypeters.com`) to reduce domain takeover risk.

---

## Git Hooks

[Husky](https://typicode.github.io/husky/) hooks run automatically:

- **pre-commit** — [lint-staged](https://github.com/lint-staged/lint-staged) runs Prettier + ESLint on staged files
- **pre-push** — `npm run lint && npm test -- --ci`

---

## Project Structure

```text
src/
├── app/           # Next.js App Router pages
├── components/    # Reusable UI components (typically with a CSS Module; tests are colocated when present)
├── data/          # Static data (experience, projects, skills)
├── lib/           # Utilities (articles markdown pipeline)
└── styles/        # Global SCSS partials
content/
└── articles/      # Markdown articles
```
