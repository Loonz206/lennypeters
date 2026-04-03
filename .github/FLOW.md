# .github Agentic Workflow

This folder contains agent definitions, skills, and instruction files used by Copilot in this repository.

## Mermaid Flow

```mermaid
flowchart LR
    A[User Request] --> B[Pipeline Agent]
    B --> C[Phase 0: Research]
    C --> D[Phase 1: Coding]
    D --> E[Phase 2: Lint]
    E --> F[Phase 3: Unit Tests]
    F --> G[Phase 4: E2E Tests]
    G --> H[Phase 5: Docs Sync]
    H --> I[Phase 6: Summary]

    H --> J{Agent/Skill/Instruction/Prompt\nFiles Changed?}
    J -->|Yes| K[Update Relevant Docs]
    K --> L[Update This Mermaid Chart]
    L --> I
    J -->|No| I
```

## Docs Sync Scope

The docs phase updates documentation when changes are detected in:

- `.github/agents/**`
- `.github/skills/**`
- `.github/instructions/**`
- `.github/prompts/**`

It also refreshes this Mermaid chart when the agentic flow changes.
