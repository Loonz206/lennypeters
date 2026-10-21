# .github Agentic Workflow

This repository uses a **playbook-first orchestration model**: one primary agent (`pipeline`) plus stable compatibility entry points (`code`, `lint`, `testing`, `e2e-testing`, `docs`, `reflective`, `research`).

## Workflow Flowchart

```mermaid
flowchart TD
    U([User Request]) --> R{Routing}

    R -->|Default coding work| P[/agent pipeline/]
    R -->|Scoped phase request| C{Compatibility entrypoint}
    R -->|Design from Figma| FD[/agent figma-design/]
    R -->|Article generation| WA[/agent write-article/]
    R -->|Runtime investigation| DB[/agent debug/]

    C --> RC[/agent research/]
    C --> CC[/agent code/]
    C --> LC[/agent lint/]
    C --> TC[/agent testing/]
    C --> EC[/agent e2e-testing/]
    C --> DC[/agent docs/]
    C --> RFC[/agent reflective/]
    RC --> P
    CC --> P
    LC --> P
    TC --> P
    EC --> P
    DC --> P
    RFC --> P

    subgraph playbooks [Workflow Playbooks]
      PB1[full]
      PB2[code-lint]
      PB3[lint]
      PB4[unit]
      PB5[e2e]
      PB6[docs]
      PB7[reflect]
    end

    P --> PB1
    P --> PB2
    P --> PB3
    P --> PB4
    P --> PB5
    P --> PB6
    P --> PB7

    subgraph full [full playbook phases]
      S0[Research]
      S1[Code]
      S2[Lint]
      S3[Unit Tests]
      S4[E2E Tests]
      S5[Docs Sync]
      S6[Reflect]
      S7[Summary]
      S0 --> S1 --> S2 --> S3 --> S4 --> S5 --> S6 --> S7
    end

    PB1 --> S0

    subgraph skills [Core Skills]
      SKP[/workflow-playbooks/]
      SKR[/internet-research/]
      SKT[/testing/]
      SKE[/e2e-testing/]
      SKF[/figma-design/]
      SKW[/write-article/]
      SKRF[/reflect/]
      SKI[/impeccable/]
    end

    P --> SKP
    S0 --> SKR
    S3 --> SKT
    S4 --> SKE
    FD --> SKF
    WA --> SKW
    S6 --> SKRF
    DB --> SKI

    subgraph mcp [MCP Integrations]
      C7[(Context7)]
      FG[(Figma MCP)]
      PW[(Playwright MCP)]
    end

    SKR --> C7
    SKF --> FG
    SKE --> PW
    DB --> PW
```

## Skills

| Skill | Location | Purpose |
|---|---|---|
| `workflow-playbooks` | `skills/workflow-playbooks/SKILL.md` | Canonical phase contracts and playbook definitions |
| `internet-research` | `skills/internet-research/SKILL.md` | Dependency and API research before coding |
| `testing` | `skills/testing/SKILL.md` | Jest + RTL unit/component test authoring and repair |
| `e2e-testing` | `skills/e2e-testing/SKILL.md` | Playwright e2e authoring and repair |
| `figma-design` | `skills/figma-design/SKILL.md` | Figma-to-code implementation |
| `write-article` | `skills/write-article/SKILL.md` | Research-backed technical article drafting |
| `pr-publishing` | `skills/pr-publishing/SKILL.md` | PR creation and reviewer-ready description generation |
| `reflect` | `skills/reflect/SKILL.md` | Failure logging and rule extraction |
| `impeccable` | `skills/impeccable/SKILL.md` | Frontend design critique and refinement |

## Compatibility Policy

- Existing entry points remain stable (`/agent lint`, `/agent testing`, etc.).
- Compatibility agents map scoped requests into the pipeline playbook model.
- New orchestration behavior must be defined in `workflow-playbooks` first, then reflected in agents/instructions/docs.
- Cross-provider standard and adapters live in:
  - [AI_CONTRIBUTING.md](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/AI_CONTRIBUTING.md)
  - [openai-codex.md](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/adapters/openai-codex.md)
  - [github-copilot.md](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/adapters/github-copilot.md)
  - [opencode.md](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/adapters/opencode.md)
