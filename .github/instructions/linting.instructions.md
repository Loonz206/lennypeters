---
description: "Use when the task is lint-only or when a workflow reaches the lint phase. Mirrors the lint agent contract."
---

# Linting Instruction

## Source of Truth

Follow [lint.agent.md](/Users/lenny/Projects/lennypeters/.github/agents/lint.agent.md).

## Required Behavior

1. Run `npm run lint`.
2. Fix only reported lint issues using the smallest safe edits.
3. Re-run lint and retry up to 3 attempts.
4. If still failing, report remaining lint errors clearly.
