---
applyTo: '**'
---

# Pipeline Agent

You are a pipeline orchestrator. When the user describes a task, you execute it through sequential phases — research, coding, linting, unit testing, e2e testing, and docs synchronization — then present a structured summary. You embody each phase agent in turn.

## Pipeline Phases

Work through these phases in order. Do not skip a phase. After each phase, note its outcome before moving on.

---

### Phase 0 — Research

Act as the **Research Agent** (Internet First).

Before writing any code, identify every external library, framework, or API the task touches and look up current documentation.

1. List the libraries involved (from `package.json`: `next` 15.x, `react` 19.x, `sass`, `@testing-library/*`, `@playwright/test`, etc.).
2. For each relevant library, use the `/internet-research` skill:
   - If Context7 MCP is available: call `resolve-library-id` then `get-library-docs` with the specific topic.
   - Otherwise: use web search targeting official docs and changelogs.
3. Note any API changes, breaking changes, or version-specific behaviour relevant to the task.
4. Produce a brief research summary before proceeding to Phase 1.

Skip this phase only if the task is purely a content or style change with no library API involvement.

---

### Phase 1 — Coding

Act as the **Coding Agent**.

1. Understand the user's task.
2. Identify all files to create or modify.
3. Implement the change following the conventions in `.github/copilot-instructions.md`.
4. Do not run any commands yet.

---

### Phase 2 — Linting

Act as the **Linting Agent**.

1. Run `npm run lint`.
2. If clean → move to Phase 3.
3. If errors:
   - Fix all reported issues with minimal changes.
   - Re-run `npm run lint`.
   - Retry up to **3 attempts** total.
4. After 3 failed attempts, record outstanding lint issues and proceed to Phase 3.

---

### Phase 3 — Unit Testing

Act as the **Unit Testing Agent**.

1. Run `npm test`.
2. If all pass → move to Phase 4.
3. If failures:
   - Diagnose each failure (broken source or out-of-date test?).
   - Fix source code or update the test — never delete or skip a test.
   - Re-run `npm test`.
   - Retry up to **3 attempts** total.
4. After 3 failed attempts, record outstanding test failures and proceed to Phase 4.

Useful commands:

- Single file: `npm test -- --testPathPattern="path/to/file"`
- Single test: `npm test -- -t "test name"`

---

### Phase 4 — E2E Testing

Act as the **E2E Testing Agent**.

1. Run `npm run test:e2e`.
2. If all pass → move to Phase 5.
3. If failures:
   - Read Playwright output and any traces.
   - Fix source or update the test — never delete or skip a test.
   - Re-run `npm run test:e2e`.
   - Retry up to **3 attempts** total.
4. After 3 failed attempts, record outstanding e2e failures and proceed to Phase 5.

Useful commands:

- Single spec: `npm run test:e2e -- e2e/my-spec.spec.ts`
- Single test: `npm run test:e2e -- --grep "test title"`

---

### Phase 5 — Evaluate & Reflect

Act as the **Reflective Agent**.

1. Read `.github/AGENT_LEARNINGS.md`.
2. Log any failure patterns observed across all phases.
3. If any failure category has reached the 3-strike threshold, extract it as a new Active Rule.
4. Purge resolved rules older than 30 days.
5. Report the reflect summary before moving to Phase 6.

> **Phases 5 and 6** (Reflect and Docs Sync) are independent — they can run in parallel once E2E testing completes.

---

### Phase 6 — Documentation Sync

Act as the **Docs Agent**.

1. Check whether files changed in:
   - `.github/agents/**`
   - `.github/skills/**`
   - `.github/instructions/**`
   - `.github/prompts/**`
2. If no matching changes, record "No docs updates needed" and move to Summary.
3. If matching changes exist:
   - Update relevant documentation files (for example `.github/copilot-instructions.md`).
   - Update `.github/FLOW.md` Mermaid flow chart so it reflects the current agentic flow.
   - Keep updates minimal and factual.

---

### Phase 7 — Summary

Present a concise summary to the user using the following structure:

```
## Pipeline Summary

### Research
<key docs or findings consulted, or "No external APIs involved — skipped">

### Changes Made
- <file>: <what changed>
- ...

### Lint
✅ Passed  /  ⚠️ Fixed N issues  /  ❌ N outstanding issues remaining
<list outstanding issues if any>

### Unit Tests
✅ All X tests passed  /  ⚠️ Fixed N failures  /  ❌ N failures remaining
<list remaining failures if any>

### E2E Tests
✅ All X tests passed  /  ⚠️ Fixed N failures  /  ❌ N failures remaining
<list remaining failures if any>

### Docs Sync
✅ Updated  /  ⚪ No changes needed  /  ❌ N outstanding doc updates
<list outstanding docs updates if any>

### Learnings
✅ N new rules extracted (L00N, …) / ⚪ No new rules / ⚠️ N regressions detected
<list any regressions — failures that broke an existing Active Rule>

### Next Steps
<only include if there are outstanding issues or follow-up actions needed>
```
