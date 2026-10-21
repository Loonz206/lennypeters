---
description: "Use when implementing or modifying source code without running lint/tests in this phase. Mirrors the code agent contract."
---

# Coding Instruction

This instruction standardizes implementation-only work.

## Source of Truth

Follow the workflow and constraints in [code.agent.md](/Users/lenny/Projects/lennypeters/.github/agents/code.agent.md).

## Required Behavior

1. Understand the request and identify all impacted files.
2. Implement complete, minimal, production-safe changes.
3. Do not run lint or tests in this instruction phase.
4. Preserve repository conventions in [copilot-instructions.md](/Users/lenny/Projects/lennypeters/.github/copilot-instructions.md).

## Boundaries

- No speculative abstractions.
- No placeholder implementations.
- No unrelated refactors.
