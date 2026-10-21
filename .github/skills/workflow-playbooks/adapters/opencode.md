# OpenCode Adapter

This adapter maps OpenCode usage to [AI_CONTRIBUTING.md](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/AI_CONTRIBUTING.md).

## Recommended Invocation

- Use the same playbook taxonomy as the repository standard:
  - `full`, `code-lint`, `lint`, `unit`, `e2e`, `docs`, `reflect`.

## Capability Profile

| Capability | Guidance |
|---|---|
| CLI/task execution | Use repository scripts as validation truth |
| File operations | Keep edits minimal and phase-scoped |
| External research | Use Context7 when present, official docs fallback otherwise |
| Browser checks | Use Playwright-based checks where available |

## Lean Usage Rules

1. Prefer targeted file reads and scoped searches.
2. Avoid broad context loading of unrelated docs.
3. Emit concise, structured completion summaries.

## Fallbacks

- If a tool is unavailable, choose the nearest deterministic command-line check and document the substitution.
