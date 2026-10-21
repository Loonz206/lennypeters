---
name: e2e-testing
description: >
  Write, update, and diagnose Playwright end-to-end specs for this Next.js app,
  including locator fixes and browser-flow verification.
argument-hint: "Describe route/flow, expected behavior, and failing Playwright output"
---

# E2E Testing Skill

Use this skill for Playwright test authoring and repair.

## Conventions

- Specs live in `e2e/` and use `.spec.ts`.
- Prefer role-based locators and web-first assertions.
- Do not use `test.skip` as a fix.

## Workflow

1. Reproduce failure via targeted spec or grep.
2. Fix source/test with smallest safe change.
3. Re-run targeted spec, then full e2e suite.
4. Report unresolved failures explicitly after retries.
