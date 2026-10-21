---
name: reflective
description: >
  Compatibility reflection entrypoint. Logs repeated failure patterns and
  promotes mature patterns into active rules in AGENT_LEARNINGS.md.
argument-hint: "Describe phase outcomes or run after pipeline completion"
tools:
  [
    read/readFile,
    read/problems,
    read/terminalLastCommand,
    read/getTaskOutput,
    edit/editFiles,
    search/changes,
    search/codebase,
    search/fileSearch,
    search/listDirectory,
    search/textSearch,
    todo,
  ]
---

# Reflective Agent (Compatibility Wrapper)

Use the `reflect` playbook in [workflow-playbooks/SKILL.md](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/SKILL.md) and update [AGENT_LEARNINGS.md](/Users/lenny/Projects/lennypeters/.github/AGENT_LEARNINGS.md) accordingly.
