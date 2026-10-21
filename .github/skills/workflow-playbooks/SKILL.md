---
name: workflow-playbooks
description: >
  Canonical playbook library for repository workflows. Defines phase contracts
  for full pipeline and scoped variants used by the pipeline and compatibility agents.
---

# Workflow Playbooks Skill

This is the single source of truth for orchestration behavior.

## Portable Standard

Cross-provider contribution policy is defined in [AI_CONTRIBUTING.md](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/AI_CONTRIBUTING.md).

Provider adapters:

- [OpenAI/Codex](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/adapters/openai-codex.md)
- [GitHub Copilot](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/adapters/github-copilot.md)
- [OpenCode](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/adapters/opencode.md)

## Playbooks

### full

`research -> code -> lint -> unit -> e2e -> docs -> reflect -> summary`

Use for default coding tasks.

### code-lint

`research (if needed) -> code -> lint -> summary`

Use when user explicitly requests implementation plus lint only.

### lint

`lint -> summary`

Use for lint-only requests.

### unit

`unit -> summary`

Use for Jest/RTL-only requests.

### e2e

`e2e -> summary`

Use for Playwright-only requests.

### docs

`docs -> summary`

Use to synchronize orchestration docs after workflow surface changes.

### reflect

`reflect -> summary`

Use to update [AGENT_LEARNINGS.md](/Users/lenny/Projects/lennypeters/.github/AGENT_LEARNINGS.md) with outcomes and recurrent failures.

## Phase Contracts

### research

1. Identify external libraries/APIs involved.
2. Query Context7 (`resolve-library-id`, `get-library-docs`) for each dependency.
3. Add official web docs/changelog checks when needed.
4. Produce concise implementation notes.

### code

1. Implement complete requested source changes.
2. Follow [copilot-instructions.md](/Users/lenny/Projects/lennypeters/.github/copilot-instructions.md) conventions.
3. Do not run lint/tests in this phase.

### lint

1. Run `npm run lint`.
2. Fix only lint findings.
3. Retry up to 3 times.
4. Report unresolved lint errors.

### unit

1. Run `npm test -- --ci`.
2. Fix source/tests safely (never skip tests).
3. Re-run focused then full tests.
4. Verify coverage gate expectations configured by the repo.

### e2e

1. Run `npm run test:e2e`.
2. Diagnose failures from output/artifacts.
3. Fix smallest safe source/test issue.
4. Retry up to 3 times and report unresolved failures.

### docs

1. If `.github/agents/**`, `.github/instructions/**`, `.github/skills/**`, or `.github/prompts/**` changed, sync docs.
2. Update [copilot-instructions.md](/Users/lenny/Projects/lennypeters/.github/copilot-instructions.md) and [FLOW.md](/Users/lenny/Projects/lennypeters/.github/FLOW.md) when orchestration behavior changes.
3. Keep updates minimal and factual.

### reflect

1. Review [AGENT_LEARNINGS.md](/Users/lenny/Projects/lennypeters/.github/AGENT_LEARNINGS.md).
2. Log new failure patterns.
3. Promote repeated categories (>=3) into active rules.
4. Purge resolved entries older than 30 days.
