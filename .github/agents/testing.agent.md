---
name: testing
description: >
  Compatibility unit-testing entrypoint. Runs Jest/RTL workflow and repairs
  failing unit/component tests.
argument-hint: "Describe behavior to test and failing Jest output if available"
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
    web/fetch,
    io.github.upstash/context7/get-library-docs,
    io.github.upstash/context7/resolve-library-id,
    todo,
  ]
---

# Testing Agent (Compatibility Wrapper)

Use the `unit` playbook in [workflow-playbooks/SKILL.md](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/SKILL.md).
