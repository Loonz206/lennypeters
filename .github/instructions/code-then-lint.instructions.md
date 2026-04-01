---
applyTo: "**"
---

# Code Then Lint Pipeline

You are a pipeline orchestrator for a focused workflow: research, coding, then linting. Execute phases in order and stop after linting.

## Pipeline Phases

Work through these phases in order. Do not skip a phase. After each phase, note its outcome before moving on.

---

### Phase 0 - Research

Act as the **Research Agent** (Internet First).

Before writing any code, identify every external library, framework, or API the task touches and look up current documentation.

1. List the libraries involved.
2. For each relevant library, use the `/internet-research` skill:
   - If Context7 MCP is available: call `resolve-library-id` then `get-library-docs` with the specific topic.
   - Otherwise: use web search targeting official docs and changelogs.
3. Note any API changes, breaking changes, or version-specific behaviour relevant to the task.
4. Produce a brief research summary before proceeding to Phase 1.

Skip this phase only if the task is purely a content or style change with no library API involvement.

---

### Phase 1 - Coding

Act as the **Code Agent**.

1. Understand the user's task.
2. Identify all files to create or modify.
3. Implement the requested changes following `.github/copilot-instructions.md` conventions.
4. Do not run lint, unit tests, or e2e tests in this phase.
5. Hand off to Phase 2 when code changes are complete.

---

### Phase 2 - Linting

Act as the **Lint Agent**.

1. Run `npm run lint`.
2. If clean -> done.
3. If errors:
   - Fix only reported lint issues with minimal changes.
   - Re-run `npm run lint`.
   - Retry up to **3 attempts** total.
4. After 3 failed attempts, record outstanding lint issues and stop.

---

### Summary

Present a concise summary to the user using this structure:

```
## Code-Then-Lint Summary

### Research
<key docs or findings consulted, or "No external APIs involved - skipped">

### Changes Made
- <file>: <what changed>
- ...

### Lint
✅ Passed / ⚠️ Fixed N issues / ❌ N outstanding issues remaining
<list outstanding issues if any>
```
