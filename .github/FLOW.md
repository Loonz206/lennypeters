# .github Agentic Workflow

This folder contains agent definitions, skills, and instruction files used by Copilot in this repository.

## Pipeline Flow

```mermaid
flowchart TD
    A([User Request]) --> R{Route}

    R -->|Full pipeline| PL[Pipeline Agent]
    R -->|/agent figma-design| FD[Figma Design Agent]
    R -->|/agent write-article| WA[Write Article Agent]
    R -->|/agent research| RA[Research Agent]
    R -->|/agent reflective| RF[Reflective Agent]

    subgraph pipeline [Pipeline — phases run in order]
        PL --> CS[Phase -1: Context Scaffolding\nRead AGENT_LEARNINGS.md]
        CS --> P0[Phase 0: Research]
        P0 --> P1[Phase 1: Coding]
        P1 --> P2[Phase 2: Lint]
        P2 --> P3[Phase 3: Unit Tests]
        P3 --> P4[Phase 4: E2E Tests]
        P4 --> P5[Phase 5: Docs Sync]
        P5 --> DC{.github files\nchanged?}
        DC -->|Yes| DU[Update Docs + FLOW.md]
        DU --> P6[Phase 6: Evaluate & Reflect]
        DC -->|No| P6
        P6 --> P7[Phase 7: Summary]
    end

    subgraph skills [Skills — usable inline in any prompt]
        SK_IR[/internet-research/]
        SK_FG[/figma-design/]
        SK_TS[/testing/]
        SK_WA[/write-article/]
        SK_RF[/reflect/]
    end

    subgraph mcp [MCP Servers]
        MCP_C7[(Context7\nLibrary Docs)]
        MCP_FG[(Figma\nDesign Context)]
    end

    subgraph reflective [Reflective Loop]
        AL[(AGENT_LEARNINGS.md)]
        EV[Evaluator\nLog failure patterns]
        SM[Skill Manager\n3-strikes → extract rule]
        HK[Housekeeping\nPurge resolved >30 days]
        AL -->|Active Rules| CS
        P6 --> EV
        EV --> SM
        SM -->|Count ≥ 3| AL
        SM --> HK
        HK --> AL
    end

    P0 -->|internet-research skill| SK_IR
    SK_IR -->|resolve-library-id\nget-library-docs| MCP_C7

    FD --> SK_FG
    SK_FG -->|get_design_context\nget_screenshot| MCP_FG

    SK_WA --> SK_IR
    SK_RF --> EV

    WA --> SK_WA
    RA --> SK_IR
    RF --> EV
```

## Skills

Skills provide specialized, reusable capabilities invokable inline (`/skill-name`) or called by agents.

| Skill               | File                                | MCP Dependency                   | Purpose                                            |
| ------------------- | ----------------------------------- | -------------------------------- | -------------------------------------------------- |
| `internet-research` | `skills/internet-research/SKILL.md` | Context7                         | Fetch live library docs before coding              |
| `figma-design`      | `skills/figma-design/SKILL.md`      | Figma MCP                        | Translate Figma frames to React components         |
| `testing`           | `skills/testing/SKILL.md`           | —                                | Write/fix Jest + RTL tests                         |
| `write-article`     | `skills/write-article/SKILL.md`     | Context7 (via internet-research) | Research and draft technical articles              |
| `reflect`           | `skills/reflect/SKILL.md`           | —                                | Log failures + extract rules to AGENT_LEARNINGS.md |

## MCP Servers

| Server                                                       | Setup                                 | Used By                                                     |
| ------------------------------------------------------------ | ------------------------------------- | ----------------------------------------------------------- |
| **Context7** (`@upstash/context7-mcp`)                       | `npx -y @upstash/context7-mcp`        | `internet-research` skill, Research Agent, Pipeline Phase 0 |
| **Figma MCP** (`mcp.figma.com/mcp` or `figma-developer-mcp`) | OAuth via `https://mcp.figma.com/mcp` | `figma-design` skill, Figma Design Agent                    |

See [copilot-instructions.md](./copilot-instructions.md) for one-time MCP setup instructions.

## Docs Sync Scope

The docs phase (Phase 5) and Docs Agent update documentation when changes are detected in:

- `.github/agents/**`
- `.github/skills/**`
- `.github/instructions/**`
- `.github/prompts/**`
- `src/app/**`
- `src/components/**`
- `src/data/**`
- `src/lib/**`
- `content/**`
- `.github/AGENT_LEARNINGS.md` (when new rules are extracted by the Reflective Agent)

**When new agents, skills, or MCP servers are added**, the docs phase must also:

1. Add a row to the **Skills** or **MCP Servers** table above.
2. Add a node and edge to the **Pipeline Flow** Mermaid diagram.
3. Update the agent/skill inventory in `copilot-instructions.md` if the entry point or invocation pattern changed.

**When structural source folders change**, the docs phase must also:

1. Update the root `README.md` Project Structure section so it reflects the current directory layout.
