---
name: internet-research
description: >
  Internet-first research skill. Use this before implementing anything involving
  an external library, API, or framework. Fetches live documentation via Context7
  MCP tools and supplements with web search. Invoke with /internet-research in any prompt.
---

# Internet Research Skill

Use this skill before implementing any code that involves an external library, framework, or API. Always consult live documentation rather than relying on training data.

## When to use this skill

- You are about to use a library or API you haven't verified against current docs.
- The task involves a specific version, config option, or method signature.
- You need to confirm how a feature works in Next.js 15, React 19, or any other dependency in this project.

## Research Steps

1. **List libraries involved** in the current task.

2. **Use Context7 to resolve each library** (if the MCP tool is available):

   ```
   resolve-library-id: <library name>
   ```

   Then fetch its docs:

   ```
   get-library-docs: <resolved-id>, topic: <specific topic>
   ```

3. **Use web search as fallback** (or supplement) for:
   - Release notes and changelogs
   - Migration guides
   - Known bugs or workarounds
   - Anything not in Context7

4. **Summarise before coding**:
   - State what you found
   - Note the correct API signatures or config patterns
   - Flag any gotchas or breaking changes

## Project dependencies to research with Context7

Key libraries in this project:

- `next` (15.x) — App Router, server components, server actions
- `react` (19.x) — hooks, concurrent features
- `sass` — SCSS module usage

## Rules

- Never assume an API works the same as in a previous version without checking.
- If Context7 is unavailable, use web search — always note the source.
- Summarise findings before beginning implementation.
