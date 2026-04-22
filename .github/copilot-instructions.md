# Copilot Instructions

## Commands

```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build
npm run lint         # ESLint via next lint
npm test             # Jest unit/component tests (watch: npm run test:watch)
npm test -- -t "name" # Run a single test by name
npm run test:e2e     # Playwright e2e tests (requires dev server or starts it automatically)
npm run test:e2e:ui  # Playwright interactive UI mode
```

## Default Workflow for Coding Requests

> **For any request that involves writing or modifying code, always use the pipeline agent.**

The pipeline runs: **research → coding → lint → unit test → e2e → docs sync → summary**

```bash
/agent pipeline
# or
copilot --agent pipeline --prompt "describe your task"
```

**When to bypass the pipeline** (only when the user explicitly asks for a single phase):

| User intent                              | Use instead          |
| ---------------------------------------- | -------------------- |
| "Just fix the lint errors"               | `/agent lint`        |
| "Just fix the failing tests"             | `/agent testing`     |
| "Just fix the failing e2e"               | `/agent e2e-testing` |
| "Just implement, I'll run checks myself" | `/agent code`        |

Do **not** implement code changes directly (outside an agent) unless the user has explicitly opted out of pipeline validation.

## Architecture

Next.js 15 (App Router) with React 19. No external UI library — styling is done entirely with custom SCSS.

**Page layout** is defined in `src/app/layout.tsx` and wraps all pages in `<Header> → <Main> → {children} → <Footer>`. Pages live in `src/app/` following App Router conventions.

**Components** are server components by default. Use `"use client"` only when browser APIs or React hooks are needed (e.g., `usePathname` in the Header for active link detection).

**Global styles** (`src/styles/`) are imported once in `layout.tsx`. They are structured as SCSS partials: `variables`, `mixins`, `typography`, `grid`, `layout`, `normalize`, `print`.

## Testing

### Unit / component tests (Jest + React Testing Library)

Test files live **alongside** their source file in the same folder, using the `.test.tsx` extension:

```
src/components/my-component/my-component.test.tsx
src/components/my-component/my-component.module.scss
src/components/my-component/index.tsx
```

Use `render` + `screen` queries from `@testing-library/react`. Prefer queries by role (`getByRole`) over test IDs. `@testing-library/jest-dom` matchers (e.g. `toBeInTheDocument`) are available globally via `jest.setup.ts`.

### E2e tests (Playwright)

E2e tests live in `e2e/` and use the `.spec.ts` extension, one suite per route. The `playwright.config.ts` defaults to `http://localhost:3000` and auto-starts `npm run dev` if no server is already running. Set `E2E_TEST_URL` to point all tests at any external URL instead (no local server is started when this var is set). Only Chromium is configured by default.

## Custom Agents

Specialized instruction files live in `.github/instructions/`. Each can be activated individually or used together as a full pipeline via `/instructions` in the CLI.

| Agent file                       | Purpose                                                                 |
| -------------------------------- | ----------------------------------------------------------------------- |
| `coding.instructions.md`         | Implements code changes only — no validation                            |
| `code-then-lint.instructions.md` | Focused mini-pipeline: research → code → lint                           |
| `linting.instructions.md`        | Runs `npm run lint`, auto-fixes, retries up to 3×                       |
| `unit-testing.instructions.md`   | Runs `npm test`, auto-fixes failures, retries up to 3×                  |
| `e2e-testing.instructions.md`    | Runs `npm run test:e2e`, auto-fixes failures, retries up to 3×          |
| `pipeline.instructions.md`       | **Full pipeline**: research → coding → lint → unit test → e2e → summary |

**Research agent** (`.github/agents/research.agent.md`) can also be invoked standalone:

```
/agent research
# or
copilot --agent research --prompt "How does useOptimistic work in React 19?"
```

**Code agent** (`.github/agents/code.agent.md`) implements changes only, then hands off to linting:

```
/agent code
# or
copilot --agent code --prompt "Implement feature X"
```

**Lint agent** (`.github/agents/lint.agent.md`) runs lint and auto-fixes reported issues:

```
/agent lint
# or
copilot --agent lint --prompt "Lint and fix current changes"
```

**Testing agent** (`.github/agents/testing.agent.md`) writes or repairs Jest and React Testing Library coverage after linting. Replaces the former unit-testing agent:

```
/agent testing
# or
copilot --agent testing --prompt "Add unit tests for the selected-work component"
```

**E2E-testing agent** (`.github/agents/e2e-testing.agent.md`) runs Playwright after unit testing and repairs failing browser flows without skipping specs. Can use the Playwright MCP server for live browser diagnosis:

```
/agent e2e-testing
# or
copilot --agent e2e-testing --prompt "Fix the failing home page Playwright spec"
```

**Pipeline agent** (`.github/agents/pipeline.agent.md`) runs the full repo workflow from research through docs sync:

```
/agent pipeline
# or
copilot --agent pipeline --prompt "Implement feature X and carry it through verification"
```

**Docs agent** (`.github/agents/docs.agent.md`) updates `.github` documentation when orchestration files change:

```bash
/agent docs
# or
copilot --agent docs --prompt "Sync docs after updating pipeline and skills"
```

**Reflective agent** (`.github/agents/reflective.agent.md`) evaluates task outcomes, logs failure patterns, extracts rules when a failure category hits 3 occurrences, and purges resolved rules older than 30 days:

```
/agent reflective
# or
copilot --agent reflective --prompt "Evaluate this pipeline run and update learnings"
```

**Reflect skill** can be used inline at the end of any prompt to log failures and extract rules without invoking the full agent:

```
Use /reflect to evaluate this session and update AGENT_LEARNINGS.md.
```

Every agent reads `.github/AGENT_LEARNINGS.md` before starting — Active Rules in this file encode lessons from past failures and are applied automatically.

**Write-article agent** (`.github/agents/write-article.agent.md`) researches a topic and writes a markdown article:

```
/agent write-article
# or
copilot --agent write-article --prompt "Write about React Server Components streaming patterns"
```

**Write-article skill** can be used inline in any prompt:

```
Use /write-article to write an article about TypeScript discriminated unions.
```

A GitHub Action (`.github/workflows/write-article.yml`) also auto-generates articles when a GitHub Issue is labeled `article`. Use the issue template at `.github/ISSUE_TEMPLATE/article-request.yml`.

**Research skill** can be used inline in any prompt:

```
Use /internet-research to look up the Next.js 15 caching API, then implement server-side caching for the blog page.
```

**Testing skill** can be used inline in any prompt:

```
Use /testing to write or fix Jest and React Testing Library coverage for a component.
```

**E2E-testing skill** can be used inline in any prompt:

```
Use /e2e-testing to write or fix Playwright specs, or to diagnose a failing browser flow using the Playwright MCP server.
```

### Setting up Context7 MCP (one-time, per machine)

Context7 provides live, version-accurate library documentation to the research agent. Add it to your Copilot CLI MCP config:

```bash
# In a Copilot CLI session:
/mcp add

# Fill in:
#   Name:    context7
#   Command: npx
#   Args:    -y @upstash/context7-mcp
```

Or edit `~/.copilot/mcp-config.json` directly:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

Context7 tools available after setup: `resolve-library-id`, `get-library-docs`.

## Figma Design

**Figma agent** (`.github/agents/figma-design.agent.md`) — full 7-step design-to-code workflow:

```
/agent figma-design
# or
copilot --agent figma-design --prompt "Implement https://figma.com/design/..."
```

**Figma skill** — inline in any prompt:

```
Use /figma-design to implement https://figma.com/design/abc123/MyApp?node-id=42-15
```

The agent/skill will: parse the URL → fetch design context → capture a screenshot → map design tokens to project SCSS variables → implement as CSS Module components → validate against the screenshot.

### Setting up Figma MCP (one-time, per machine)

**Option 1 — Remote server (preferred, broadest features):**

```bash
# In a Copilot CLI session:
/mcp add

# Fill in:
#   Name: figma
#   Type: http
#   URL:  https://mcp.figma.com/mcp
```

Authentication is handled via OAuth when you first use a Figma tool.

**Option 2 — npm package (API key auth):**

```bash
/mcp add

# Fill in:
#   Name:    figma
#   Command: npx
#   Args:    -y figma-developer-mcp --stdio
#   Env:     FIGMA_API_KEY=<your-personal-access-token>
```

Or edit `~/.copilot/mcp-config.json` directly:

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--stdio"],
      "env": { "FIGMA_API_KEY": "your-token-here" }
    }
  }
}
```

Get a Figma personal access token at: **Figma → Account Settings → Security → Personal access tokens**

Figma MCP tools available after setup: `get_design_context`, `get_screenshot`, `get_metadata`.

## Conventions

Each component gets its own folder with two files:

```
src/components/my-component/
  index.tsx
  my-component.module.scss
```

Export the component as the default export from `index.tsx`. Import with `@/components/my-component`.

### Styling

- **Component-scoped styles**: use CSS Modules (`.module.scss`), imported as `styles` and applied via `className={styles.myClass}`
- **Global/layout styles**: use plain class names from `src/styles/layout.scss` (e.g., `className="wrapper"`)
- **Never use inline styles or Tailwind** — this project uses SCSS only

### SCSS variables and mixins (available globally via `src/styles/global.scss`)

Key variables:

```scss
$primaryColor, $accentColor, $infoColor, $dangerColor, $warningColor, $successColor, $inverseColor
$primaryText, $secondaryText, $dividerColor
$serif, $sansSerif, $monoSpaced  // font stacks
```

Responsive mixin — use named breakpoints:

```scss
@include responsive(widescreen) // min-width: 120em  (1920px)
  @include responsive(desktop) // min-width: 70em
  @include responsive(laptop) // min-width: 64em
  @include responsive(tablet) // min-width: 50em
  @include responsive(phablet) // min-width: 37.5em
  @include responsive(mobileonly); // max-width: 37.5em
```

### Grid system

A custom Bootstrap-style flexbox grid is available globally. Use `.container`, `.row`, and `.col-xs-*` / `.col-sm-*` / `.col-md-*` / `.col-lg-*` / `.col-xl-*` classes (1–12 columns). The XL tier activates at `min-width: 120em` (1920px) with wider gutters (24px) and outer margin (48px).

### TypeScript

Define prop interfaces inline above the component using `interface ComponentNameProps`. Use `readonly` for props that shouldn't be mutated.

### Path alias

Use `@/` for all imports from `src/` (configured in `tsconfig.json`).

## Hook Enforcement

> Instructions describe **intent**. Hooks enforce **hard limits** before any tool call executes.

Repo-scoped Copilot hooks live in `.github/hooks/copilot-hooks.json`. They apply to both the GitHub Copilot cloud agent and local Copilot CLI sessions run from this repo's root. The hooks file must be on the default branch to be active for cloud agent sessions.

The active hook is `preToolUse` — it runs before every tool call and can deny execution by outputting a JSON decision. The policy script is `.github/hooks/scripts/pre-tool-policy.js` (Node 22, no dependencies).

### What the policy blocks

**Shell commands (`bash` tool):**

| Category                | Examples blocked                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------- |
| Privilege escalation    | `sudo`, `su`, `runas`                                                                                   |
| Root-destructive delete | `rm -rf /`, `rm -rf ~/`, `rm -rf *` at root                                                             |
| System storage ops      | `mkfs`, `diskutil erase`, `dd of=/dev/*`, `format`                                                      |
| Download-and-execute    | `curl … \| bash`, `wget … \| sh`, PowerShell `iex`+`irm`                                                |
| Destructive git         | `git reset --hard`, `git checkout -- .`, `git clean -f*`, `git push --force` (not `--force-with-lease`) |

**File write operations (`edit` / `create` tools):**

| Always denied                               | Reason                                        |
| ------------------------------------------- | --------------------------------------------- |
| `.github/workflows/**`                      | CI/CD workflow changes require manual review  |
| `.env`, `.env.*`, `*.env`                   | May contain secrets                           |
| `certificates/**`                           | Certificate material                          |
| `*.pem`, `*.key`, `*.crt`, `*.p12`, `*.pfx` | Private key / cert files anywhere in the tree |
| `.husky/**`                                 | Git hook scripts                              |

Anything outside the approved write paths is also denied. Approved paths are: `src/`, `content/articles/`, `e2e/`, `public/`, `.github/agents/`, `.github/instructions/`, `.github/skills/`, `.github/prompts/`, `.github/hooks/`, `.github/ISSUE_TEMPLATE/`, the main `.github/` governance docs (`FLOW.md`, `copilot-instructions.md`, `AGENT_LEARNINGS.md`), and root-level config files (`package.json`, `jest.config.js`, `tsconfig.json`, etc.).

### Policy design principles

- **Fail open on malformed input** — if the hook payload cannot be parsed, the tool call is allowed rather than permanently blocked by a configuration issue.
- **`--force-with-lease` is allowed** — it is the safer git force mechanism; `--force` / `-f` are denied.
- **No audit logging in v1** — logging will be added in a later phase once normal usage patterns are established.
- **Extend by editing the script** — to expand or relax the policy, edit `.github/hooks/scripts/pre-tool-policy.js`. The deny rules are grouped into `SHELL_DENY_RULES`, `GIT_DENY_RULES`, `WRITE_DENY_RULES`, `ALLOWED_PREFIXES`, and `ALLOWED_EXACT` arrays at the top of the file.
