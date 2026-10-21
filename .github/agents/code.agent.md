---
name: code
description: >
  Compatibility coding entrypoint. Implements source changes only and then hands
  off to lint/testing through the pipeline playbook model.
tools:
  [
    read/getNotebookSummary,
    read/problems,
    read/readFile,
    read/viewImage,
    read/terminalSelection,
    read/terminalLastCommand,
    read/getTaskOutput,
    edit/createDirectory,
    edit/createFile,
    edit/createJupyterNotebook,
    edit/editFiles,
    edit/editNotebook,
    edit/rename,
    search/changes,
    search/codebase,
    search/fileSearch,
    search/listDirectory,
    search/searchResults,
    search/textSearch,
    search/usages,
    web/fetch,
    web/githubRepo,
    todo,
  ]
---

# Code Agent (Compatibility Wrapper)

Use the `code` phase contract from [workflow-playbooks/SKILL.md](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/SKILL.md).

## Contract

1. Implement complete requested code changes.
2. Do not run lint/tests in this agent.
3. Preserve repository conventions in [copilot-instructions.md](/Users/lenny/Projects/lennypeters/.github/copilot-instructions.md).
