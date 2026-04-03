---
name: e2e-testing
description: >
  Write, update, and diagnose Playwright end-to-end tests for this Next.js
  portfolio. Use for spec authoring, browser behavior assertions, route
  verification, and interactive debugging via the Playwright MCP server.
  Invoke inline with /e2e-testing in any prompt.
argument-hint: 'Describe the route or flow to test, expected browser behavior, and any trace or screenshot evidence'
---

# E2E Testing Skill

Use this skill when you need to write, update, or diagnose Playwright end-to-end specs in this repository.

## When to Use

- Writing new Playwright specs for a page or user flow.
- A spec is failing and you need to diagnose the root cause.
- You want to inspect live browser behavior before asserting it in a test.
- A source or routing change broke an existing spec.

## Repo-Specific Conventions

- Spec files live in `e2e/` and use the `.spec.ts` suffix.
- One suite per route or functional area — do not mix routes in a single file.
- Import only from `@playwright/test` — no test helpers or custom fixtures.
- The `playwright.config.ts` sets `baseURL: 'http://localhost:3000'` and starts `npm run dev` automatically if no server is already running.
- Only Chromium is configured in the default `projects` array.

**Current suites:**

| File                    | Route(s) covered               |
| ----------------------- | ------------------------------ |
| `e2e/home.spec.ts`      | `/`                            |
| `e2e/work.spec.ts`      | `/work`                        |
| `e2e/articles.spec.ts`  | `/articles`, `/articles/:slug` |
| `e2e/about.spec.ts`     | `/about`                       |
| `e2e/not-found.spec.ts` | Any unknown route → 404        |

## Writing Specs

Use web-first assertions that auto-retry until the condition is met or timeout occurs. Prefer role-based locators — they are both accessible and stable.

**Navigation + title check:**

```ts
import { test, expect } from '@playwright/test'

test('page loads with correct title', async ({ page }) => {
  await page.goto('/about')

  await expect(page).toHaveURL('/about')
  await expect(page).toHaveTitle(/About — Lenny Peters/)
  await expect(page.getByRole('heading', { name: 'About Me' })).toBeVisible()
})
```

**Click-through to a child route:**

```ts
test('articles index links to a detail page', async ({ page }) => {
  await page.goto('/articles')

  const firstLink = page.getByRole('link', { name: /^Read / }).first()
  await expect(firstLink).toBeVisible()
  await firstLink.click()

  await expect(page).toHaveURL(/\/articles\//)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
```

**404 route:**

```ts
test('unknown route shows 404 page', async ({ page }) => {
  await page.goto('/this-route-does-not-exist')

  await expect(page.getByRole('heading', { name: '404 error' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Return to Mainframe' })).toBeVisible()
})
```

## Running Tests

```bash
# Full suite
npm run test:e2e

# Single spec
npm run test:e2e -- e2e/articles.spec.ts

# Single test by title
npm run test:e2e -- --grep "articles index links"

# Interactive UI mode
npm run test:e2e:ui
```

## Interactive Diagnosis with the Playwright MCP Server

When a spec fails and the failure output alone is not enough, use the Playwright MCP
server for live browser inspection. Load the tools first via `tool_search_tool_regex`
before calling them.

```
tool_search_tool_regex pattern: "^mcp_microsoft_pla"
```

**Common MCP tools and their use:**

| Tool                                         | When to use                                                     |
| -------------------------------------------- | --------------------------------------------------------------- |
| `mcp_microsoft_pla_browser_navigate`         | Open a URL in a live browser session                            |
| `mcp_microsoft_pla_browser_snapshot`         | Get the full accessibility tree of the current page             |
| `mcp_microsoft_pla_browser_take_screenshot`  | Capture a screenshot to verify visual state                     |
| `mcp_microsoft_pla_browser_click`            | Click an element by description to reproduce a user interaction |
| `mcp_microsoft_pla_browser_evaluate`         | Run JavaScript on the page to inspect state                     |
| `mcp_microsoft_pla_browser_console_messages` | Read console output for errors or warnings                      |
| `mcp_microsoft_pla_browser_network_requests` | Inspect in-flight requests to diagnose fetch/API issues         |

**Diagnostic workflow:**

1. Run the failing spec and read the output.
2. If the selector or assertion is unclear, load the MCP tools and navigate to the route.
3. Call `mcp_microsoft_pla_browser_snapshot` to get the live accessibility tree.
4. Identify the correct role, name, or attribute for the locator.
5. Update the spec with the verified locator and re-run the targeted spec.

## Assertions Reference

```ts
// Page-level assertions
await expect(page).toHaveURL('/about')
await expect(page).toHaveTitle(/About — Lenny Peters/)

// Element visibility (preferred)
await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible()
await expect(page.getByRole('link', { name: 'Return to Mainframe' })).toBeVisible()

// Element count
await expect(page.getByRole('article')).toHaveCount(6)

// Text content
await expect(page.getByRole('heading', { level: 1 })).toContainText('About')

// Absence
await expect(page.getByRole('dialog')).not.toBeVisible()
```

## Avoid

- `test.skip` or `test.fixme` as a permanent fix.
- Deleting a failing test to clear the suite.
- Using non-role locators (e.g. CSS selectors) when a role is available.
- Hardcoding specific article titles or slugs — use positional selectors or regex patterns instead.
- Adding `waitForTimeout` calls — use web-first assertions which retry automatically.
