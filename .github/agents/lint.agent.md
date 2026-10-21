---
name: lint
description: >
  Compatibility lint entrypoint. Runs lint-only workflow and fixes lint issues
  with minimal safe changes.
tools:
  [
    execute/runTask,
    execute/createAndRunTask,
    execute/runInTerminal,
    execute/getTerminalOutput,
    execute/awaitTerminal,
    execute/killTerminal,
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
    todo,
  ]
---

# Lint Agent (Compatibility Wrapper)

Use the `lint` playbook in [workflow-playbooks/SKILL.md](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/SKILL.md).
