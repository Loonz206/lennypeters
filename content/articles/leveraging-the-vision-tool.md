---
title: 'Leveraging Vision Tools to Fix UI Bugs Faster'
date: '2026-07-28'
excerpt: 'A beginner-friendly guide to using screenshots with vision-capable LLMs to diagnose and fix UI and styling bugs in chat and CLI workflows.'
tags: ['LLM', 'Vision', 'UI Debugging', 'Playwright', 'MCP']
---

## Introduction

If you are new to AI-assisted debugging, the fastest win is usually this: stop describing your UI bug from memory, and show the model exactly what you see.

A vision-capable model can inspect screenshots and reason about layout, spacing, contrast, clipped text, or missing UI states. In GitHub Copilot SDK workflows, this is explicit: the model must advertise `capabilities.supports.vision = true` to process images.[1]

In my experience, junior engineers get the most value from vision when they use it as a **before/after feedback loop**:

1. capture current UI,
2. ask for a targeted fix,
3. apply the change,
4. capture again,
5. verify visually.

This article walks through practical ways to do that in chat or CLI, including screenshots from Chrome DevTools MCP, Playwright, or manually captured images.

## What the vision tool is good at (and not good at)

Vision is excellent at identifying visible symptoms:

- elements overlapping on smaller screens,
- incorrect spacing and alignment,
- text contrast issues,
- inconsistent component states.

It is weaker at hidden runtime causes unless you pair the screenshot with additional context (error text, CSS snippets, console logs, or network failures).

A reliable prompt usually includes both:

- **visual evidence** (the screenshot), and
- **technical evidence** (relevant code or logs).

> Treat the screenshot as ground truth for "what happened," and code/logs as ground truth for "why it happened."

## Source 1: Human-captured screenshots

The easiest entry point is manual screenshots from your OS or browser.

In Copilot SDK flows, you can attach screenshots either as a file path (`type: "file"`) or inline base64 blob (`type: "blob"`). The SDK handles encoding for file attachments and may resize large images automatically.[1]

Here is a minimal TypeScript example using a file attachment:

```ts
import { CopilotClient } from '@github/copilot-sdk'

async function main() {
  const client = new CopilotClient()
  await client.start()

  const session = await client.createSession({
    model: 'gpt-5.4',
    onPermissionRequest: async () => ({ kind: 'approve-once' }),
  })

  await session.send({
    prompt:
      'Analyze this UI screenshot. Identify spacing and alignment problems, then propose exact CSS changes.',
    attachments: [
      {
        type: 'file',
        path: '/absolute/path/to/screenshot.png',
      },
    ],
  })
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
```

Why this helps beginners: you can start without new tooling, and still get meaningful visual feedback.

## Source 2: Screenshots from Playwright

Playwright gives you repeatable screenshot capture in tests or scripts. The official docs support viewport screenshots, full-page screenshots, and element-level screenshots.[2]

Example script:

```ts
import { chromium } from 'playwright'

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })

  await page.screenshot({ path: 'home-viewport.png' })
  await page.screenshot({ path: 'home-full.png', fullPage: true })
  await page.locator('header').screenshot({ path: 'header-only.png' })

  await browser.close()
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
```

For junior engineers, this is a great habit: capture screenshots in a consistent viewport so visual regressions are easier to compare over time.

## Source 3: Chrome DevTools MCP screenshots

Chrome DevTools MCP exposes browser debugging tools to an AI agent, including screenshot capture, console inspection, and network inspection.[3][4]

Two especially useful tools in UI debugging flows are:

1. `take_screenshot` for visual evidence,
2. `list_console_messages` or `list_network_requests` for technical evidence.[4]

That pairing is powerful because many styling bugs are actually state bugs. For example:

- a missing API response causes a fallback component to render,
- that fallback has different padding,
- the page "looks broken" even though CSS itself is fine.

With DevTools MCP, you can collect both screenshot and runtime clues in one pass, then ask the model for a fix.

## Source 4: Playwright MCP server context

The Playwright MCP server is designed for agent workflows and emphasizes structured page understanding through accessibility snapshots.[5]

That gives you two complementary debugging modes:

- **structured mode** (accessibility snapshot / DOM-like context),
- **visual mode** (screenshots you provide from Playwright or manual capture).

Use structured mode for deterministic navigation and form interactions, then add screenshots when the issue is primarily visual (alignment, clipping, typography, spacing).

## A practical prompt pattern for junior engineers

When people are new to vision workflows, prompts are often too vague ("fix my CSS"). I recommend this template:

1. **Goal**: what should look different?
2. **Evidence**: attach screenshot + include viewport/device.
3. **Constraints**: which files/frameworks are in scope?
4. **Output format**: exact patch, not general advice.

Example:

```text
You are helping me fix a UI bug.

Goal:
- On mobile width (390px), align card buttons to the same baseline.

Evidence:
- Attached screenshot: cards-mobile.png
- Current behavior: middle card button sits higher than others.

Constraints:
- Next.js app using SCSS modules.
- Only edit src/components/article-card/article-card.module.scss

Output:
1) Explain root cause in 3 bullet points.
2) Provide exact SCSS diff.
3) List one risk to verify after applying the patch.
```

This structure reduces back-and-forth and teaches solid debugging discipline.

## Common pitfalls and how to avoid them

### 1) Screenshot without viewport details

A bug at 390px might not exist at 1280px. Always include viewport size in your prompt and screenshot naming.

### 2) Only visual context, no runtime clues

If the UI is wrong because data failed to load, image-only reasoning can be misleading. Pair screenshots with console/network evidence when possible.[4]

### 3) Asking for broad rewrites

If you ask for "refactor the whole page," the model may produce large risky edits. Limit scope to one component or stylesheet first.

### 4) Ignoring model capability checks

In SDK-driven setups, confirm you are using a vision-capable model; otherwise image attachments will not help.[1]

## A simple end-to-end flow you can use today

1. Reproduce the bug in a known viewport.
2. Capture screenshot (manual, Playwright, or DevTools MCP).[2][3]
3. Gather one extra signal (console error, network request, or relevant CSS).
4. Prompt the model with explicit file scope.
5. Apply the smallest patch.
6. Capture an after-screenshot in the same viewport.
7. Compare before vs after visually.

For first-time users, this process usually beats text-only debugging because it removes guesswork and creates a repeatable loop.

## Conclusion

Vision tools are not magic, but they are practical. They let junior engineers communicate UI problems with precision instead of long, ambiguous descriptions.

If you remember one thing, make it this: **a screenshot plus scoped prompt plus one technical signal** is often enough to get a high-quality UI fix quickly.

Use human screenshots when you need speed, Playwright screenshots when you need repeatability, and Chrome DevTools MCP when you need visual plus runtime diagnostics in one workflow.

## References

1. [GitHub Docs — Copilot SDK Image input](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/image-input)
2. [Playwright docs source — Screenshots](https://raw.githubusercontent.com/microsoft/playwright/main/docs/src/screenshots.md)
3. [Chrome DevTools MCP README](https://github.com/ChromeDevTools/chrome-devtools-mcp)
4. [Chrome DevTools MCP Tool Reference](https://raw.githubusercontent.com/ChromeDevTools/chrome-devtools-mcp/main/docs/tool-reference.md)
5. [Playwright MCP README](https://github.com/microsoft/playwright-mcp)
