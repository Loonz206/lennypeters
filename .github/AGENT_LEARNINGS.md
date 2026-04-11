# Agent Learnings

This file is the persistent, shared memory for every agent in this repository.

## How agents use this file

**Before every task** — read the Active Rules table and filter by your category. Apply any matching rule before proceeding. Never re-learn something already recorded here.

**After every task** — if you observed a failure, the Reflective Agent (or `/reflect` skill) logs it to the Failure Log. When a failure category accumulates **3 occurrences**, a generalized rule is extracted and added to Active Rules.

**Housekeeping** — the Reflective Agent automatically purges rows from Resolved Rules that are older than **30 days**.

---

## Active Rules

Rules extracted from 3+ repeated failures. Every agent must apply matching rules before beginning its task.

| ID  | Category | Rule                                                                              | Source Failures | Added |
| --- | -------- | --------------------------------------------------------------------------------- | --------------- | ----- |
| —   | —        | _No rules recorded yet. Rules are added automatically after 3 matching failures._ | —               | —     |

---

## Failure Log

Individual failure occurrences tracked by category. When a category reaches count ≥ 3, the Reflective Agent extracts a rule and moves the rows to Resolved Rules.

Failure categories use dot-notation at mid-level specificity:
`lint:unused-vars` · `lint:import-order` · `test:mock-resolution` · `test:async-act` · `test:next-image-props` · `e2e:port-not-ready` · `e2e:selector-stale` · `mcp:context7-unavailable` · `mcp:figma-screenshot-timeout` · `figma:token-mismatch` · `pipeline:phase-skip` · `docs:stale-mermaid`

| ID   | Category                       | Error Signature                                                       | Count | Last Seen  | Status |
| ---- | ------------------------------ | --------------------------------------------------------------------- | ----- | ---------- | ------ |
| F001 | test:content-expectation-drift | "Unable to find an element with the text: Responsive Web Development" | 1     | 2026-04-10 | open   |

---

## Resolved Rules

Rules that have been superseded or retired. The Reflective Agent automatically deletes rows where `Resolved Date` is more than **30 days** before the current date.

| ID  | Original Category | Rule                     | Resolved Date | Reason |
| --- | ----------------- | ------------------------ | ------------- | ------ |
| —   | —                 | _No resolved rules yet._ | —             | —      |
