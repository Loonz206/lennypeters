---
title: 'Migrating to OpenCode v2'
date: '2026-10-20'
excerpt: 'A practical migration guide from OpenCode v1 to v2, including MCP server setup, local model configuration, and the settings changes that make the upgrade feel smooth instead of disruptive.'
tags: ['OpenCode', 'MCP', 'LLM', 'Developer Tools']
image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?fit=crop&w=1600&q=80'
imageAlt: 'Developer reviewing code and migration changes across multiple screens'
---

If you have been using OpenCode for a while, the v2 move is the kind of upgrade that looks small on paper but changes how your agent talks to tools, providers, and the local machine. The most important thing is not to treat it as a cosmetic version bump. It is a configuration migration.

This guide walks through a practical migration path: what changed, how to move your MCP configuration, how to point OpenCode at local models, and what I keep in my config so the upgrade is painless.

## Why v2 feels different

The biggest shift in OpenCode v2 is that the client assumes a richer configuration surface. You are no longer just setting a model and a project context. You are also defining:

- which MCP servers are available
- which model providers the agent can use
- whether local inference should be preferred or used as a fallback
- which tools are exposed in a given project

That is a good change because it makes the system more predictable. It also means a small migration can break your workflow if you carry over old assumptions from v1.

If you are upgrading from v1, the standard pattern is:

1. Back up your existing config
2. Compare the v1 schema against the v2 config shape
3. Re-register your MCP servers
4. Add your local models explicitly
5. Validate one tool call and one model call before you rely on the setup

## Start by exporting the old config

Before changing anything, copy the current OpenCode config and inspect it. In most installations, the config lives under `~/.config/opencode/`.

```bash
ls -la ~/.config/opencode
cp ~/.config/opencode/opencode.json ~/.config/opencode/opencode.v1.backup.json
```

This is a little step that prevents a common mistake: updating the wrong file while the agent is still trying to use the old schema.

## The MCP migration pattern

MCP configuration is the first thing I migrate because it is where a lot of “it still works, but only partly” issues show up. The pattern is simple: define a stable server name, choose the correct transport, and make sure the command starts cleanly.

A common v1-to-v2 migration looks like this:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "chrome-devtools": {
      "type": "local",
      "command": ["npx", "-y", "chrome-devtools-mcp@latest", "--slim"]
    },
    "filesystem": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-filesystem", "/Users/you/projects"]
    }
  }
}
```

If you had a v1 config that only listed a server name and a command, this is the shape I would port forward into v2. The key migration rules are:

- keep server names stable
- prefer explicit command arrays
- test the tool list before relying on new prompts
- do not attach too many servers at once

A good habit is to keep only the MCP servers you use for the current project enabled. You can always add more later, but every extra tool increases context and decision overhead.

## Common MCP migration mistakes

### Mistake 1: reusing stale server names

If an old config used a server called `devtools` and the new project expects `chrome-devtools`, the model may discover the tool under a different name and your prompts silently stop invoking it.

Use explicit names and keep them stable across upgrades.

### Mistake 2: assuming remote MCP servers are equivalent to local ones

Remote servers may need network access, auth headers, or a different startup lifecycle. Local servers often behave more predictably in a developer environment and are simpler to debug.

### Mistake 3: not validating startup

The new config may parse, but the server may still fail at runtime. Always run a tool discovery or a simple prompt that requires the server before using it for real work.

A reliable validation step is:

```bash
opencode
# then ask: "List the available MCP tools and summarize the currently connected servers."
```

If the server is not discoverable, the config is not ready.

## Configuring local LLMs in v2

OpenCode v2 is a good fit for local LLM workflows. Instead of assuming every session should talk to a hosted model, you can explicitly register a local provider and point the config at a local OpenAI-compatible endpoint.

A common setup for Ollama looks like this:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "providers": {
    "ollama": {
      "type": "openai",
      "baseURL": "http://localhost:11434/v1",
      "apiKey": "ollama"
    }
  },
  "model": "ollama/qwen3:14b"
}
```

For LM Studio, the pattern is the same, but the endpoint changes:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "providers": {
    "lmstudio": {
      "type": "openai",
      "baseURL": "http://localhost:1234/v1",
      "apiKey": "lm-studio"
    }
  },
  "model": "lmstudio/Local-Model"
}
```

This is where upgrades trip people up. If you are migrating from a v1 workflow that implicitly inferred the model, you now need to be explicit about:

- provider name
- model identifier
- endpoint base URL
- API key placeholder, if applicable

## My migration checklist

This is the checklist I use when moving a project to OpenCode v2:

```bash
# 1. Back up the current config
cp ~/.config/opencode/opencode.json ~/.config/opencode/opencode.v1.backup.json

# 2. Create the new config if needed
mkdir -p ~/.config/opencode

# 3. Add the MCP servers you actually need
# 4. Add local model providers
# 5. Validate discovery
# 6. Run one real prompt that uses the tools
```

The goal is not “copy the old config and hope for the best.” The goal is to create a small, obvious config that the agent can reason about reliably.

## Recommended project-level setup

For most developer machines, I prefer a split between project-level and global settings:

- global config: shared model defaults and common providers
- project config: MCP server list and project-specific tools

A project-level config works especially well for browser debugging or frontend local tooling. It keeps the agent from starting with a huge toolset in unrelated repos.

Example:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "chrome-devtools": {
      "type": "local",
      "command": ["npx", "-y", "chrome-devtools-mcp@latest", "--slim"]
    }
  },
  "providers": {
    "ollama": {
      "type": "openai",
      "baseURL": "http://localhost:11434/v1",
      "apiKey": "ollama"
    }
  },
  "model": "ollama/qwen3:14b"
}
```

This configuration is small, clear, and easy to reason about when a session starts.

## How to validate the migration

Once the config is in place, validate it in the smallest possible way. Do not ask the agent to do an entire project refactor on day one. First, confirm:

1. the model starts successfully
2. the MCP server list is available
3. a local model can respond
4. one simple tool call works

A practical test prompt is:

```text
List the connected MCP servers and explain which ones are currently available to this session. Then tell me which model provider is selected and whether it is a local or hosted model.
```

That single prompt tells you whether your config has really loaded, not just whether the file exists.

## Why this upgrade pays off

The real value of OpenCode v2 is not that it changed the config format. It is that it makes the model environment explicit. Once your toolset and model provider are declared clearly, your agent becomes much easier to reason about, debug, and reproduce.

That matters for real engineering work:

- MCP tools become easier to trust
- local model setups become repeatable
- project-specific context stays lean
- debugging sessions are more consistent across machines

The migration is worth doing once and then keeping lean.

## Final advice

If you are moving to OpenCode v2, treat the upgrade as a setup project, not a code refactor. Keep the config readable, keep the toolset narrow, and validate each provider and server before relying on it for product work.

The most stable setup I have found is:

- one or two MCP servers per project
- one local provider for offline work
- one hosted provider for cloud/inference-heavy tasks
- explicit `model` selection instead of implicit defaults

That keeps the environment predictable and gives you a migration path that is easy to maintain.

## References

1. [OpenCode Configuration Reference](https://opencode.ai/configuration)
2. [Model Context Protocol Overview](https://modelcontextprotocol.io/introduction)
3. [Ollama API Documentation](https://github.com/ollama/ollama/blob/main/docs/api.md)
4. [LM Studio Local Server Guide](https://lmstudio.ai/docs/local-server)
