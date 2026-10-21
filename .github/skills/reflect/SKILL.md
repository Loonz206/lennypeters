---
name: reflect
description: >
  Post-run reflection skill that logs failures into AGENT_LEARNINGS.md and
  extracts reusable active rules from repeated patterns.
---

# Reflect Skill

Use this skill after pipeline or phase completion.

## Workflow

1. Read [AGENT_LEARNINGS.md](/Users/lenny/Projects/lennypeters/.github/AGENT_LEARNINGS.md).
2. Log new failures by category and signature.
3. Promote categories with 3+ repeated occurrences into active rules.
4. Purge resolved rule entries older than 30 days.

## Output

- failures logged
- rules extracted
- regressions against existing active rules
