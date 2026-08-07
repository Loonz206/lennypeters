# Lenny Peters — Personal Portfolio

[![Build Status](https://img.shields.io/github/actions/workflow/status/Loonz206/lennypeters/ci.yml?branch=main&style=flat-square&logo=github)](https://github.com/Loonz206/lennypeters/actions?query=workflow%3Aci)
[![codecov](https://codecov.io/gh/Loonz206/lennypeters/branch/main/graph/badge.svg)](https://codecov.io/gh/Loonz206/lennypeters)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Snyk](https://img.shields.io/badge/Snyk-monitored-brightgreen?style=flat-square&logo=snyk)](https://app.snyk.io/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4?style=flat-square)](https://github.com/prettier/prettier)

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

## Notes

The site is statically exported and deployed through GitHub Actions. After each successful deploy to `main`, a production E2E job runs automatically against `https://lennypeters.com`. A standalone on-demand job is also available in the Actions tab (`E2E Tests — Production`).

## Dependency Updates (Renovate)

This repository uses Renovate for automated dependency update PRs with a zero-cost setup.

### Enable Renovate (free)

1. Install the hosted Renovate GitHub App from https://github.com/apps/renovate
2. Select this repository during app installation
3. Review and merge the `Configure Renovate` onboarding PR

### Optional self-hosted fallback (free)

If you prefer not to use the hosted app, this repository now includes a self-hosted workflow at `.github/workflows/renovate.yml`.

1. Create a repository secret named `RENOVATE_TOKEN` with a GitHub token that can open branches and pull requests in this repo
2. Run the `Renovate (Self-Hosted)` workflow manually once from the Actions tab
3. Keep the scheduled run enabled to process updates automatically on weekdays

For security, use a least-privilege token. For fine-grained tokens, grant access only to this repository with `Contents` (read/write), `Pull requests` (read/write), `Issues` (read/write), and `Metadata` (read-only).

### Policy used in this repository

- Base preset: `config:best-practices`
- Dependency Dashboard enabled for triage and approvals
- No automerge during initial stabilization
- Major updates require dashboard approval
- Non-major `devDependencies` are grouped weekly to reduce PR noise

### Review order

1. Security updates
2. Patch updates
3. Minor updates
4. Major updates

### Branch protection recommendation

Require the CI workflow checks from `.github/workflows/ci.yml` before merging Renovate PRs.
