---
title: 'RTK: Cut Your AI Token Costs 60–90% Without Changing Your Workflow'
author: 'Lenny Peters'
date: '2026-06-10'
excerpt: 'RTK (Rust Token Killer) sits between your terminal and your AI agent, compressing verbose CLI output by 60–90% in under 10ms — without changing your workflow.'
tags: ['AI Tooling', 'GitHub Copilot', 'OpenCode', 'Token Optimization', 'DX']
image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80'
imageAlt: 'Scattered coins and bills representing the cost of AI token usage'
---

Every time an AI coding agent runs a shell command — `git status`, `npm run build`, `npx tsc`, `jest` — the full raw output gets injected into the model's context window. Every line. Every ANSI escape code. Every "Counting objects: 100% (5/5), done." from `git push`. The model has to wade through all of it.

This is a plumbing problem, not a model problem. Raw CLI output is designed for humans to scan — not for LLMs to reason over. A typical 30-minute agentic coding session burns through 100,000–150,000 tokens, the majority of which is low-signal terminal noise.

`rtk` (Rust Token Killer) fixes the plumbing. It's a single Rust binary that sits between your terminal and your AI agent, intercepts command output, applies four compression strategies, and returns a semantically equivalent but dramatically smaller result — in under 10ms.[1]

## How RTK Works

`rtk` applies four compression strategies to every command it wraps:

- **Smart Filtering** — strips comments, whitespace, ANSI color codes, boilerplate, and low-signal noise that LLMs don't need to reason effectively
- **Grouping & Aggregation** — groups files by directory, errors by type, and statuses together so the model sees structure, not raw listing
- **Truncation with Context** — preserves the high-value information (the failing test, the error line, the diff hunk) and cuts the rest
- **Deduplication** — collapses repeated log lines into a single counted entry instead of repeating the same string 40 times

The practical difference is dramatic. A `git push` that normally outputs around 200 tokens gets compressed to roughly 10 tokens. Same semantic content. Zero information loss from the AI's perspective.[1]

That 20× reduction compounds across an entire session. 150,000 tokens becomes around 45,000 tokens — the kind of drop that keeps sessions coherent and, for API-key users, immediately measurable in your billing dashboard.

## Installation

```bash
# Install via npm
npm install -g rtk

# Verify installation — confirm it's the Token Killer, not Adobe Type Kit
rtk --version
rtk gain
```

> **Important:** There is an Adobe package also named `rtk`. Always run `rtk gain` after installation. If it doesn't return a "Rust Token Killer" confirmation, you have the wrong package. Check `which rtk` to confirm your install path.

```bash
# Check install path if wrong package is active
which rtk

# rtk installs to ~/.local/bin by default on macOS/Linux
# Add to PATH if not already there:
export PATH="$HOME/.local/bin:$PATH"
```

Once `rtk gain` confirms you have the Token Killer, you're ready.

## Basic Usage

`rtk` works as a command prefix — prepend it to any command:

```bash
rtk git status
rtk git diff
rtk npm run build
rtk npx jest
rtk ls -la
rtk find . -name "*.ts"
```

Your terminal still shows you the full output. The AI sees the compressed version. It's transparent — you don't change your muscle memory, your scripts, or your CI configuration.

## The Auto-Rewrite Hook

Manual prefixing is useful for one-offs, but the real power is the hook. Once activated, it transparently rewrites every Bash tool invocation so the AI automatically receives compressed output — no prefixing required in your workflow.

```bash
rtk hook install
```

After this, every command your AI agent runs through the Bash tool is automatically routed through `rtk`. To remove it:

```bash
rtk hook uninstall
```

> **Scope note:** The hook applies to Bash tool invocations only. It does not intercept built-in agent tools like Read, Grep, or Glob in Claude Code, or file reads via IDE APIs. Those paths aren't compressible by `rtk` — the savings come from the shell command pipeline, which is exactly where the verbose output lives.

## Configuration

For teams or projects with specific requirements, `rtk` supports a config file at `~/.config/rtk/config.toml`:

```toml
[output]
max_lines = 100          # Cap output at 100 lines before truncation kicks in
show_stats = false       # Disable per-command compression stats in output

[filters]
strip_ansi = true        # Always strip ANSI color codes
strip_timestamps = true  # Remove timestamp prefixes from log lines
dedupe_threshold = 3     # Collapse lines repeated 3+ times into a count summary

[telemetry]
enabled = false          # See security section below
```

The defaults are sensible for most workflows. I only reach for the config when working on a project with unusually terse output requirements or when running in a CI environment where I want deterministic compression behavior.

## Using RTK with GitHub Copilot

GitHub Copilot (especially in agent mode) benefits from `rtk` whenever it's running shell commands as part of an agentic task — build verification, test runs, dependency checks, linting.

**Automated setup:**

1. Install `rtk` and run `rtk hook install`
2. The hook activates automatically for any Bash-based tool invocations Copilot makes in VS Code's agent mode

**Manual workflow for Copilot Chat:**

If you're feeding terminal output manually into Copilot Chat — pasting build errors, test results, stack traces — pipe through `rtk` first:

```bash
# Compress before copying into Copilot Chat
npm run build 2>&1 | rtk pipe
npx jest 2>&1 | rtk pipe
```

For flat-rate Copilot subscribers: you hit rate limits faster than you should when the agent is burning context on terminal boilerplate. `rtk` keeps sessions longer and more coherent. I've had agentic sessions that used to stall out at the rate limit now run cleanly to completion on the same task.

## Using RTK with OpenCode

OpenCode's agentic loop runs shell commands heavily — it's one of the highest-value environments for `rtk`.

```bash
# Install rtk and activate the hook
npm install -g rtk
rtk hook install
```

Once the hook is active, OpenCode's Bash tool calls are automatically compressed. No OpenCode configuration changes are needed.

**If you're running local models (LM Studio, Ollama, MLX):**

This is where `rtk` matters most. Local models typically have 8k–32k context windows, compared to the 200k+ of cloud models. A single verbose `npm install` can eat 20% of a local model's entire context. With `rtk`, that same output costs 2–3% of context instead. If you're doing serious work with local inference, `rtk` isn't optional — it's load-bearing infrastructure.

**Verify it's working:**

```bash
# Run a known verbose command and check the output size
rtk npm run build

# Or check rtk's own session stats
rtk stats
```

## Security and Telemetry

`rtk` collects anonymous usage telemetry by default — which commands are compressed, compression ratios, that kind of thing. For developers working on proprietary codebases or in enterprise environments, disable this before use.

**Via config file (recommended — persistent):**

```toml
# ~/.config/rtk/config.toml
[telemetry]
enabled = false
```

**Via environment variable (good for CI/CD pipelines):**

```bash
export RTK_TELEMETRY=false
```

Add to your shell profile to make it permanent:

```bash
# ~/.zshrc or ~/.bashrc
export RTK_TELEMETRY=false
```

**Per-command:**

```bash
RTK_TELEMETRY=false rtk git status
```

> `rtk` processes terminal output locally — it is not sending your code or file contents anywhere. The telemetry is usage analytics only. But for security-conscious teams, even anonymous usage data leaving the machine is a policy concern worth addressing before rollout. I disable it by default on any project I bring `rtk` into.

## Why This Matters Beyond Cost

The argument for `rtk` isn't only about saving money, though the savings are real and calculable — run `rtk stats` after a session to see exact token counts.

The deeper reason is that **context quality affects reasoning quality**. LLM performance degrades when the context window fills with irrelevant noise. A model that spends attention parsing 5,000 tokens of verbose `cargo test` output has measurably less effective reasoning bandwidth for your actual code. This isn't a theoretical concern — it's one of the better-documented failure modes of long agentic sessions.[2]

`rtk` doesn't just save tokens. It makes the tokens that do reach the model more information-dense. That's a different kind of win: fewer hallucinations, better multi-step reasoning, sessions that stay on task longer.

I've measured the difference in my own workflow. The install takes two minutes. The hook setup is one command. The payoff starts immediately and compounds across every session.

Install it, run `rtk gain` to confirm you have the right package, activate the hook, and disable telemetry. That's the full setup.

## References

1. [RTK (Rust Token Killer) — GitHub](https://github.com/rtk-ai/rtk)
2. [RTK AI — Official Site](https://www.rtk-ai.app/)
