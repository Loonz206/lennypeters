# AI Contributing Standard (Harness-Agnostic)

This document defines the portable contribution contract for AI-assisted work in this repository.

Use this as the canonical standard across OpenAI, Codex, GitHub Copilot, and OpenCode.

## Goals

1. Keep behavior consistent regardless of provider.
2. Keep context and tool use lean.
3. Preserve verification quality and reproducibility.
4. Avoid lock-in to one orchestration harness.

## Canonical Workflow

Use playbooks in [SKILL.md](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/SKILL.md).

Default playbook:

`research -> code -> lint -> unit -> e2e -> docs -> reflect -> summary`

## Required Quality Gates

For code changes:

1. `npm run lint`
2. `npm test -- --ci`
3. `npm run test:e2e` (when UI/user flows are affected)

If a phase is intentionally skipped, explicitly state:
- what was skipped,
- why,
- risk introduced.

## Tool and Context Budget

Use these limits to keep tokens and tool calls lean:

1. Read only files needed for the current phase.
2. Avoid rereading the same file unless content changed.
3. Prefer shared source-of-truth docs over duplicated prose.
4. Use targeted validations before full-suite reruns.
5. Prefer concise structured summaries between phases.

## Provider-Neutral Rules

1. Do not bypass validation by skipping tests or suppressing failures.
2. Do not introduce speculative abstractions.
3. Do not edit unrelated files.
4. Keep fixes surgical and reversible.
5. Log recurrent failure patterns in [AGENT_LEARNINGS.md](/Users/lenny/Projects/lennypeters/.github/AGENT_LEARNINGS.md).

## Output Contract (per task)

Return:

1. Playbook used.
2. Files changed.
3. Checks run and final status.
4. Any skipped phase + rationale.
5. Remaining risks or follow-up actions.

For pull requests, use [pull_request_template.md](/Users/lenny/Projects/lennypeters/.github/pull_request_template.md) and ensure all sections are completed with evidence.

## Adapter Model

Provider-specific behavior belongs in adapter docs only:

- [openai-codex.md](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/adapters/openai-codex.md)
- [github-copilot.md](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/adapters/github-copilot.md)
- [opencode.md](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/adapters/opencode.md)

Adapters must map to this standard and must not redefine workflow policy.
