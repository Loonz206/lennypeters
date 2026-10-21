---
description: "Use when running or fixing Jest/RTL tests. Mirrors the testing agent contract for unit and component coverage."
---

# Unit Testing Instruction

## Source of Truth

Follow [testing.agent.md](/Users/lenny/Projects/lennypeters/.github/agents/testing.agent.md).

## Required Behavior

1. Run `npm test -- --ci`.
2. Diagnose failures and fix source or tests (never skip/delete tests).
3. Re-run focused tests first, then full CI run.
4. Ensure coverage gate expectations from repo config remain satisfied.
