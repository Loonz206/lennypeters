# OpenAI/Codex Adapter

This adapter maps OpenAI/Codex usage to the canonical standard in [AI_CONTRIBUTING.md](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/AI_CONTRIBUTING.md).

## Recommended Invocation

- Default: run through pipeline playbook.
- Scoped: choose `code-lint`, `lint`, `unit`, `e2e`, `docs`, or `reflect`.

## Capability Profile

| Capability | Guidance |
|---|---|
| Tool calling | Use structured tool calls; avoid shell when built-in tools are available |
| Multi-step orchestration | Use playbook phase boundaries for deterministic behavior |
| Web/library research | Prefer Context7, fallback to official web docs |
| Browser validation | Use Playwright/DevTools tools when available |

## Lean Usage Rules

1. Prefer `rg`/targeted reads over broad file dumps.
2. Validate smallest affected scope first.
3. Use concise phase summaries instead of repeated long narration.

## Fallbacks

- If Context7 unavailable: use official docs/changelog links.
- If browser tools unavailable: run test output + source-based diagnosis.
