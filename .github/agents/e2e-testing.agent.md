---
name: e2e-testing
description: >
  Compatibility end-to-end entrypoint. Runs Playwright workflow and repairs e2e
  regressions without skipping tests.
argument-hint: "Describe failing route or flow and expected browser behavior"
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
    mcp/microsoft.com/playwright/browser_navigate,
    mcp/microsoft.com/playwright/browser_snapshot,
    mcp/microsoft.com/playwright/browser_take_screenshot,
    mcp/microsoft.com/playwright/browser_click,
    mcp/microsoft.com/playwright/browser_evaluate,
    mcp/microsoft.com/playwright/browser_console_messages,
    mcp/microsoft.com/playwright/browser_network_requests,
    todo,
  ]
---

# E2E Testing Agent (Compatibility Wrapper)

Use the `e2e` playbook in [workflow-playbooks/SKILL.md](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/SKILL.md).
