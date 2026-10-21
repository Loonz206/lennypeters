---
name: research
description: >
  Compatibility research entrypoint. Performs internet-first dependency/API
  research using Context7 before implementation.
argument-hint: "Describe topic and libraries to research"
tools:
  [
    read/getNotebookSummary,
    read/problems,
    read/readFile,
    read/viewImage,
    read/terminalSelection,
    read/terminalLastCommand,
    read/getTaskOutput,
    agent/runSubagent,
    search/changes,
    search/codebase,
    search/fileSearch,
    search/listDirectory,
    search/searchResults,
    search/textSearch,
    search/usages,
    web/fetch,
    web/githubRepo,
    io.github.upstash/context7/get-library-docs,
    io.github.upstash/context7/resolve-library-id,
  ]
---

# Research Agent (Compatibility Wrapper)

Use the `research` phase contract from [workflow-playbooks/SKILL.md](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/SKILL.md).
