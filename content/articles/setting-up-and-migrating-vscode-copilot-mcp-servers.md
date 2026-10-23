---
title: 'Setting Up and Migrating VS Code Copilot MCP Servers'
date: '2026-10-23'
excerpt: 'A practical guide to configuring Copilot MCP servers in VS Code, migrating from the older workspace setup, and pairing Context7, Playwright, and browser tools in real workflows.'
tags: ['GitHub Copilot', 'VS Code', 'MCP', 'Developer Tools']
---

## Introduction

A clean GitHub Copilot setup is often less about the model and more about the tools the model can reach. When your agent can inspect the browser, fetch current library docs, and exercise the app through a real browser session, the difference is immediate. Instead of guessing, it can observe. That is the real value of MCP in VS Code.[1][2]

If you are already using Copilot in VS Code, there is a good chance you have seen the older MCP setup pattern. It usually lives in `.vscode/mcp.json` and uses a top-level `servers` object. The newer pattern is more portable and more compatible with Copilot agents: a workspace `.mcp.json` or a profile-level `~/.copilot/mcp-config.json` file using `mcpServers`.[1][2]

This article is a migration guide for that change. It focuses on three practical tools for frontend work: Context7 for current docs, Playwright for browser automation, and Chrome DevTools MCP for live debugging.

## What changed in the config layout

The older setup was editor-first and helped VS Code register custom servers locally. The newer pattern is a portable, Copilot-aware schema intended for broader agent compatibility and easier sharing.[1][2]

The main changes are straightforward:

- Old layout: `.vscode/mcp.json` with `servers`
- New layout: `.mcp.json` or `~/.copilot/mcp-config.json` with `mcpServers`
- Old layout still works in VS Code, but the new layout is the stronger default for a fresh setup or a migration

Here is the classic older structure:

```json
{
  "servers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp"
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

And the newer structure looks like this:

```json
{
  "mcpServers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp"
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

The transport model is the same: HTTP for remote servers like Context7 and stdio for local commands like Playwright. The change is mostly where the config lives and which schema the client expects.[1][2][4]

## A practical tool stack for frontend work

For web development, the most useful MCP setup is often a mix of current docs and runtime visibility.

### Context7: fresh framework docs

Context7 is especially valuable when your model is a little too confident about the version you are actually using. It gives the agent access to up-to-date library docs and helps it fetch version-specific guidance instead of guessing from stale examples.[3]

A typical remote config looks like this:

```json
{
  "mcpServers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp"
    }
  }
}
```

This is a strong fit when you are working on framework migrations, breaking API changes, or anything where documentation drift matters.

### Playwright: browser automation from the model

Playwright MCP gives Copilot browser capabilities through a local stdio server. That means the agent can open pages, click through flows, validate forms, and capture results without manually copying and pasting screenshots or DOM states into the chat.[4]

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

This is ideal when a bug only appears in a browser, not in unit tests. The model can actually exercise the UI, which is a major upgrade over code-only debugging.

### Chrome DevTools MCP: inspecting the running app

Chrome DevTools MCP is a useful companion for browser-specific debugging. It gives the model access to how the page is actually rendering, including console output, network requests, performance traces, and DOM inspection.[5]

A project that combines all three often looks like this:

```json
{
  "mcpServers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp"
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    },
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

That stack covers the usual frontend loop: understand the API, reproduce the issue in a browser, and inspect the runtime state.

## A real workflow: debugging a broken checkout flow

Imagine a storefront page that renders correctly in component tests but fails in the browser during checkout. The old process is a lot of manual guesswork: open the app, click through the flow, inspect the console, and then piece together the root cause.

With MCP enabled, the workflow becomes much more concrete:

1. Ask Copilot to open the app in Playwright and navigate to the checkout page.
2. Ask it to inspect the form state or capture a screenshot of the failure.
3. Ask it to check the browser console or DOM tree for the actual problem.
4. Ask Context7 for current library guidance if the issue is version-related.

This is what makes the setup valuable. The model is not just writing code; it is observing a real implementation and cross-checking against current docs.[3][4][5]

## Migration plan from the older setup

If your workspace already contains `.vscode/mcp.json`, the safest migration is a simple rename and move.

1. Open the existing config and copy each server entry.
2. Decide whether the config should live in the workspace or in your user profile.
3. Create a new `.mcp.json` in the project root or update `~/.copilot/mcp-config.json`.
4. Rename the top-level key from `servers` to `mcpServers`.
5. Keep the same command or URL entries.
6. Remove the old file only after verifying the new one works.

A working migration usually looks like this:

```json
{
  "mcpServers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp"
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

> If the project is team-shared, the workspace file is useful. If the tool is personal, a global config is usually the simpler choice.

## Common mistakes

### Mixing the old and new layouts

The most common issue is leaving both files active and assuming they are equivalent. They are not. The editor and the agent may resolve different config sources, which leads to “it works in one place and not the other” confusion.[1][2]

### Assuming MCP is a replacement for debugging skill

MCP gives the model observations, not wisdom. It can inspect a failing page, but it still needs a good problem statement. A prompt like “fix the checkout bug” is weak; a prompt like “open the checkout page, click the submit action, capture the error state, and inspect the console for the root cause” is much better.[4][5]

### Checking in secrets or environment-specific values

If a server requires an API key or a project-specific path, keep the config local or in a private profile location instead of checking it into the repository. That keeps the setup reproducible without leaking credentials.[2]

## Conclusion

The move from `.vscode/mcp.json` to the portable `mcpServers` layout matters because it makes your MCP config easier to reuse and easier to reason about.[1][2]

For frontend work, the best setup is usually small but powerful: Context7 for fresh framework docs, Playwright for browser automation, and Chrome DevTools MCP for live runtime inspection. That combination gives Copilot a better view into both the code and the application it is modifying.

If you are migrating an older VS Code setup, do not overthink it. Copy the definitions, rename the key, validate the server list, and keep the toolset focused on the problems you actually debug.

## References

1. [VS Code MCP configuration reference](https://code.visualstudio.com/docs/agents/reference/mcp-configuration)
2. [GitHub Docs — Configure MCP servers for your repository](https://docs.github.com/copilot/how-tos/copilot-on-github/customize-copilot/configure-mcp-servers)
3. [Context7 documentation](https://context7.com/docs)
4. [Playwright MCP integration](https://playwright.dev/docs/mcp-integration)
5. [Chrome DevTools MCP repository](https://github.com/ChromeDevTools/chrome-devtools-mcp)
