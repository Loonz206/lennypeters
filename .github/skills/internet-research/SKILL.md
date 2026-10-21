---
name: internet-research
description: >
  Internet-first dependency research skill. Resolve library IDs and fetch
  version-accurate docs from Context7 before implementing library/API-dependent code.
---

# Internet Research Skill

Use this skill before implementing code that depends on external libraries, frameworks, or APIs.

## Workflow

1. List relevant dependencies.
2. Resolve each library via Context7 `resolve-library-id`.
3. Query focused topics via `get-library-docs`.
4. Supplement with official web docs/changelogs when needed.
5. Summarize implementation-relevant findings before coding.

## Rules

- Do not rely on stale memory for third-party APIs.
- Note version-specific behavior and breaking changes.
- Prefer official sources when Context7 coverage is incomplete.
