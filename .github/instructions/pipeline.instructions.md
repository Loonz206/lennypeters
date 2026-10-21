---
description: "Default full workflow for coding tasks: research → code → lint → unit tests → e2e → docs sync → reflect → summary."
---

# Pipeline Instruction

## Source of Truth

Follow [pipeline.agent.md](/Users/lenny/Projects/lennypeters/.github/agents/pipeline.agent.md) as the canonical orchestration contract.

## Required Phases

1. Research
2. Coding
3. Lint
4. Unit tests
5. E2E tests
6. Docs sync
7. Reflect
8. Summary

## Non-Negotiables

- Do not skip validation phases unless the user explicitly requests a scoped phase-only task.
- Do not silence failing tests to make green status.
- Report unresolved issues explicitly when retries are exhausted.
