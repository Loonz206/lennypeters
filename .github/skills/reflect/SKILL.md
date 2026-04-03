---
name: reflect
description: >
  Inline reflection skill. Evaluates a completed session or phase, logs failure
  patterns to AGENT_LEARNINGS.md, and extracts rules when the 3-strike threshold
  is reached. Use after any phase that produced failures, or at the end of a
  multi-phase pipeline run. Invoke inline with /reflect in any prompt.
---

# Reflect Skill

Use this skill to close the feedback loop after completing a task. It reads accumulated failure signals, updates the persistent learning file, and extracts actionable rules when patterns repeat.

## When to use this skill

- At the end of any pipeline run that encountered failures (lint errors, test failures, MCP errors, coverage misses)
- After a phase that hit its retry limit
- When asked to "evaluate this session", "log what went wrong", or "update learnings"
- When the Reflective Agent is not invoked as a full standalone agent but you still need to capture outcomes

## Process

### Step 1 — Load

Read `.github/AGENT_LEARNINGS.md` in full.

- Note all Active Rules and their categories.
- Note Failure Log entries with counts ≥ 2 (one strike away from rule extraction).

### Step 2 — Evaluate & Log

For each failure that occurred during this session:

1. Determine the mid-level category using dot-notation:
   - `lint:unused-vars` · `lint:import-order` · `lint:no-explicit-any`
   - `test:mock-resolution` · `test:async-act` · `test:next-image-props`
   - `e2e:port-not-ready` · `e2e:selector-stale`
   - `mcp:context7-unavailable` · `mcp:figma-screenshot-timeout`
   - `figma:token-mismatch` · `pipeline:phase-skip` · `docs:stale-mermaid`

2. Write the **Error Signature** as a short, canonical expression of the error (not a full stack trace). Examples:
   - `"Received true for a non-boolean attribute fill"`
   - `"Cannot find module '@/components/foo'"`
   - `"context7 resolve-library-id returned no results"`

3. Update the Failure Log table:
   - Existing row → increment `Count`, update `Last Seen`
   - New failure → new row, `Count: 1`, `Status: open`

### Step 3 — Extract Rules & Housekeeping

After logging:

1. Check for any Failure Log row with `Count ≥ 3` and `Status: open`.
2. If found → invoke the full rule extraction process (see `reflective.agent.md` Phase 4).
3. Run the 30-day purge on Resolved Rules (see `reflective.agent.md` Phase 5).

## Output

After completing, report:

```
### Reflect Summary
- Failures logged: N
- Rules extracted: N (IDs: L00N, …)
- Resolved rules purged: N
- Regressions detected: N (categories that broke an existing rule)
```

If nothing changed: `No failures to log. AGENT_LEARNINGS.md unchanged.`
