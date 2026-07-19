---
title: 'Configuring MCP Servers for OpenCode'
author: 'Lenny Peters'
date: '2026-07-19'
excerpt: 'A practical guide to wiring MCP servers into OpenCode, using Chrome DevTools MCP as a hands-on example, with a clear breakdown of context and token costs.'
tags: ['MCP', 'OpenCode', 'Developer Tools', 'AI']
image: 'https://images.unsplash.com/photo-1517637382994-f02da38c6728?auto=format&fit=crop&w=1600&q=80'
imageAlt: 'Silhouette of a martial artist in a kung-fu training stance at dusk'
---

AI coding tools operate on the context made available to them. By default, that context comes from what you explicitly provide — source code, file contents, and typed instructions. When a model lacks direct visibility into runtime behavior — what the browser is actually doing, what the network actually returned — it works from inference rather than observation.

MCP servers extend that boundary.

This article covers how to configure a real MCP server inside OpenCode, using Chrome DevTools MCP as the concrete example. It also covers how to invoke MCP tools via prompt and what token and context costs look like once you start adding tool results to a session.

## What MCP gives you

MCP (Model Context Protocol) is an open standard for connecting AI apps to external tools and data sources.[1] In practical terms, it gives the model a set of callable functions — things like take a screenshot, list network errors, or inspect the accessibility tree — that run against live systems and return results the model can reason over.

Without MCP, the model only knows what you typed. With MCP, it can observe the running state of your application. For browser work, that difference is enormous.

The three pillars of MCP are tools (model-callable actions), resources (contextual data the client can read), and prompts (reusable instruction templates).[1] For OpenCode sessions, tools are the most immediately useful. Every tool invocation sends a request to the MCP server, gets a response, and appends that result to the session context.

## OpenCode MCP configuration

OpenCode stores its configuration in a JSON file at `~/.config/opencode/opencode.json`. If the file does not exist, create it. The schema is available at `https://opencode.ai/config.json` and provides validation in editors that support JSON schema.[2]

MCP servers live under a top-level `mcp` key. Each entry is keyed by the name you want to give the server. A `local` type server runs a subprocess via a command array; a `remote` type connects to an already-running HTTP endpoint.

Here is the minimal valid structure:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "my-server": {
      "type": "local",
      "command": ["npx", "-y", "some-mcp-server@latest"]
    }
  }
}
```

You can define as many servers as you need. Each one runs as its own subprocess and exposes its tool list to the model for the duration of your session.

## Adding Chrome DevTools MCP

Chrome DevTools MCP is a Google-maintained MCP server that gives your agent access to a live Chrome instance for debugging, performance analysis, and reliable browser automation.[3] Under the hood it uses Puppeteer and the Chrome DevTools Protocol (CDP) to execute tool calls and return structured results.

Add it to your `~/.config/opencode/opencode.json` file:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "chrome-devtools": {
      "type": "local",
      "command": ["npx", "-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

After saving, restart OpenCode. On the next session start, it will launch the server subprocess and discover available tools via the MCP `tools/list` handshake.[1]

### What tools are available

Once connected, the model has access to tools in several categories:[3]

- **Debugging**: take screenshots, capture console logs with source-mapped stack traces, inspect network requests and responses
- **Performance**: record DevTools traces, extract actionable performance insights, fetch real-user data via CrUX
- **Automation**: navigate to URLs, click elements, fill forms, wait for page states using Puppeteer
- **Inspection**: inspect the accessibility tree, check DOM state, measure element layout

Using `--slim` mode limits the server to a smaller, faster subset of tools. Use it when you only need basic browser tasks:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "chrome-devtools": {
      "type": "local",
      "command": ["npx", "-y", "chrome-devtools-mcp@latest", "--slim", "--headless"]
    }
  }
}
```

### Privacy consideration

Chrome DevTools MCP exposes the full content of your browser instance to the MCP client. Avoid running it against tabs with sensitive data — banking sessions, private credentials, anything you would not paste into a chat window.[3]

## Using MCP tools via prompt

Once the server is running, you do not need to invoke tools directly. The model discovers them automatically and calls them based on your natural language instructions.

Here is what a real debugging exchange looks like. You type:

```
Take a screenshot of localhost:3000, then check the browser console for errors.
```

The model resolves this to two sequential tool calls: `screenshot` (which returns a base64 image), then `get_console_messages` (which returns a structured list of log entries). Both results are added to context and the model synthesizes a response.

For a performance investigation:

```
Record a trace of the homepage load and tell me what is causing the long task.
```

The model calls `record_performance_trace`, receives the trace data, and explains the bottleneck — without you ever opening DevTools manually.

For automation:

```
Navigate to the checkout page, fill in the test card number, and take a screenshot of the result.
```

The model chains `navigate`, `type`, `click`, and `screenshot` calls, handling each step sequentially.

> The key habit to develop: treat your MCP-connected session as a conversation with someone who can actually look at the browser. Ask observational questions, not just code questions.

## Context cost and token cost

This is the part that often goes unexamined until a session context blows up or a bill arrives unexpectedly.

Every MCP tool result gets appended to the session context as an assistant turn. That means large tool results — a full accessibility tree, a network waterfall, a performance trace — can consume significant context window space fast.

### Token cost breakdown

Tokens are the fundamental billing unit for most AI models. A rough rule of thumb is 1 token per 4 characters of English text, though this varies by model and tokenizer.[4] For Chrome DevTools MCP:

- A screenshot result: the base64 encoding of an image can be 50,000 to 500,000 characters depending on resolution, translating to tens of thousands of tokens
- A console log dump: typically 500 to 5,000 tokens depending on output volume
- A performance trace: can be very large — traces include frame timings, task breakdowns, and source positions
- An accessibility tree: mid-sized pages can produce 2,000 to 10,000 tokens

### Context window cost

Context window is the total amount of text a model can hold in active memory at once — your system prompt, conversation history, and all tool results combined.[4] Each tool call adds to this running total. Once you hit the limit the model either truncates history, errors out, or in some clients rolls over to a new context automatically.

For OpenCode sessions with Chrome DevTools MCP, I recommend a few habits:

1. **Scope your questions** — ask about a specific route or component, not the whole app
2. **Use `--slim` mode** when you only need navigation and screenshots — it significantly reduces result size
3. **Clear context between investigations** — each new debug session should start fresh, not accumulate state from three previous pages
4. **Avoid full-trace requests unless necessary** — performance traces are expensive; prefer targeted network or console inspection first

### Monetary cost

If you are using a paid model like Claude 3.5, GPT-4o, or Gemini 1.5 Pro, large context windows translate directly to API cost. At \$15 per million input tokens, a 100,000-token session with several screenshot tool results could cost \$1.50 just for that session.

This is not a reason to avoid MCP — it is a reason to use it intentionally. The investigation that takes you four hours manually might take 20 minutes with Chrome DevTools MCP active, making the token cost a good trade. The session where you let the model take screenshots of every page just to check is where cost accumulates for no benefit.

## A real workflow: debugging a broken layout

Here is a concrete end-to-end example. You are debugging a CSS layout regression that only appears in the browser — your component tests pass, but the card grid looks broken in the actual page.

Start by asking for a visual snapshot:

```
Screenshot localhost:3000/products and describe what you see in the card grid.
```

The model reports misaligned cards in the third row. You follow up:

```
Inspect the accessibility tree for the .card-grid element and tell me if the grid structure looks correct.
```

The model calls `get_accessibility_snapshot` and identifies that the third row has an unexpected extra container element. You now have a precise lead — not just something is wrong in CSS, but there is a structural DOM anomaly in row three.

```
Navigate to the products page, take a screenshot focused on the third card row, and check the console for any layout-related warnings.
```

The model returns a cropped screenshot and finds a React hydration warning in the console pointing to the component. You now have both the visual evidence and the root cause — in three prompts, without opening a browser manually.

## Common mistakes

**Mistake 1: Adding every MCP server at once**

More servers mean more tools in the model context, which increases context usage on every turn even when you are not using them. Start with one server that directly addresses your current task. Add others when you have a concrete need.

**Mistake 2: Expecting MCP to replace debugging knowledge**

MCP gives the model _observations_. The model still needs good debugging questions from you. A vague prompt like "Something is broken, fix it" produces worse results than a focused one like "Take a screenshot of the error state, check the console, and identify the component throwing the error."

**Mistake 3: Not scoping the config by project**

OpenCode supports per-project configuration overrides. If Chrome DevTools MCP is only relevant to your frontend work, add it to a project-level `opencode.json` in the project root rather than the global config. This keeps server startup fast for projects that do not need it.[2]

## Conclusion

MCP servers are the upgrade path from the model can read code to the model can observe your running application. For browser work, Chrome DevTools MCP is the most practical starting point — it is maintained by the Chrome DevTools team, installs in one config block, and exposes tools that map directly to what you would do manually in DevTools.

The configuration overhead is low. The token cost is real but manageable if you develop a habit of scoping your questions. The productivity gain — especially for debugging tasks that normally require manual context assembly across console, network, and DOM panels — is significant.

Wire it in, pick a bug you have been putting off, and ask the model to look at it directly.

## References

1. [Model Context Protocol Specification — Introduction](https://modelcontextprotocol.io/introduction)
2. [OpenCode Documentation — MCP Servers](https://opencode.ai/docs/mcp-servers)
3. [GitHub — ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp)
4. [OpenAI Cookbook — How to count tokens with tiktoken](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb)
