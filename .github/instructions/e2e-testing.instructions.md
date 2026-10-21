---
description: "Use when running or repairing Playwright end-to-end tests. Mirrors the e2e-testing agent contract."
---

# E2E Testing Instruction

## Source of Truth

Follow [e2e-testing.agent.md](/Users/lenny/Projects/lennypeters/.github/agents/e2e-testing.agent.md).

## Required Behavior

1. Run `npm run test:e2e`.
2. Diagnose failures using Playwright output and artifacts.
3. Fix root causes in source/tests without skipping coverage.
4. Retry up to 3 attempts and report remaining failures precisely.
