---
name: docs
description: >
  Compatibility docs-sync entrypoint. Updates orchestration docs and workflow
  maps when agent/instruction/skill behavior changes.
argument-hint: "Describe changed orchestration surfaces to sync in docs"
tools:
  [
    read/getNotebookSummary,
    read/problems,
    read/readFile,
    read/viewImage,
    read/terminalSelection,
    read/terminalLastCommand,
    read/getTaskOutput,
    execute/runInTerminal,
    search/changes,
    search/codebase,
    search/fileSearch,
    search/listDirectory,
    search/searchResults,
    search/textSearch,
    search/usages,
    edit/createDirectory,
    edit/createFile,
    edit/editFiles,
    edit/rename,
    todo,
  ]
---

# Docs Agent (Compatibility Wrapper)

Use the `docs` playbook in [workflow-playbooks/SKILL.md](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/SKILL.md).
