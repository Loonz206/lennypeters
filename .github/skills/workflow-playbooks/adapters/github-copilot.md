# GitHub Copilot Adapter (GHCP)

This adapter maps GitHub Copilot usage to [AI_CONTRIBUTING.md](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/AI_CONTRIBUTING.md).

## Recommended Invocation

- Use `/agent pipeline` for default coding work.
- Use user-facing specialty agents for non-default tasks:
  - `/agent debug`
  - `/agent figma-design`
  - `/agent write-article`

Compatibility wrappers (`lint`, `testing`, etc.) remain available but are not primary guidance.

## Capability Profile

| Capability | Guidance |
|---|---|
| MCP integration | Use Context7/Figma/Playwright when task requires |
| Subagents | Keep orchestration in pipeline; avoid unnecessary fan-out |
| Tooling | Prefer built-in search/read/edit tools over shell |
| Hooks/instructions | Follow repo policy and adapter pointers, not duplicated prose |

## Lean Usage Rules

1. Keep one source of workflow truth: playbooks.
2. Keep instructions pointer-thin where possible.
3. Avoid duplicated phase contracts across docs.

## Fallbacks

- If MCP missing: document fallback path and continue with official docs/tests.
