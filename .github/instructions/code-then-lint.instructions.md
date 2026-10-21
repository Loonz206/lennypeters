---
description: "Use when the user explicitly requests implementation followed by lint only (no testing phases)."
---

# Code-Then-Lint Instruction

## Purpose

Run a focused two-phase workflow for tasks where full validation is not requested.

## Phase Order

1. **Research (if external APIs/libraries are involved)**
   - Use [internet-research skill](/Users/lenny/Projects/lennypeters/.github/skills/internet-research/SKILL.md) first.
2. **Coding**
   - Follow [code.agent.md](/Users/lenny/Projects/lennypeters/.github/agents/code.agent.md).
3. **Lint**
   - Follow [lint.agent.md](/Users/lenny/Projects/lennypeters/.github/agents/lint.agent.md).

## Output

Return:
- research summary (or skipped reason),
- changed files,
- final lint status.
