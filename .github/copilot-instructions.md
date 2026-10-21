# Copilot Instructions

## Commands

```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build
npm run lint         # Biome lint via biome check
npm test             # Jest unit/component tests (watch: npm run test:watch)
npm test -- -t "name" # Run a single test by name
npm run test:e2e     # Playwright e2e tests (requires dev server or starts it automatically)
npm run test:e2e:ui  # Playwright interactive UI mode
```

## Default Workflow for Coding Requests

> **For any request that involves writing or modifying code, use the pipeline agent as the single orchestrator.**

The pipeline uses standardized playbooks from [`workflow-playbooks`](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/SKILL.md):

- **full**: research → code → lint → unit → e2e → docs → reflect → summary
- **code-lint**: research (if needed) → code → lint → summary
- **lint / unit / e2e / docs / reflect** for phase-scoped requests

Portable cross-provider standard:

- [AI_CONTRIBUTING.md](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/AI_CONTRIBUTING.md)
- [OpenAI/Codex adapter](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/adapters/openai-codex.md)
- [GitHub Copilot adapter](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/adapters/github-copilot.md)
- [OpenCode adapter](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/adapters/opencode.md)

```bash
/agent pipeline
# or
copilot --agent pipeline --prompt "describe your task"
```

**Scoped requests** (pipeline selects the corresponding playbook):

| User intent                              | Use instead          |
| ---------------------------------------- | -------------------- |
| "Just fix the lint errors"               | `/agent lint` (compatibility wrapper)        |
| "Just fix the failing tests"             | `/agent testing` (compatibility wrapper)     |
| "Just fix the failing e2e"               | `/agent e2e-testing` (compatibility wrapper) |
| "Just implement, I'll run checks myself" | `/agent code` (compatibility wrapper)        |

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

## Agent Model (User-Facing)

Use one of these first:

1. **`/agent pipeline`** (default for coding work)
2. **`/agent debug`** (runtime/browser debugging)
3. **`/agent figma-design`** (design-to-code from Figma)
4. **`/agent write-article`** (technical article generation)

Everything else is compatibility-only and maps into pipeline playbooks.

## Compatibility Wrappers (Internal/Legacy)

These remain available for stable existing workflows but are not the primary recommendation:

- `/agent research`
- `/agent code`
- `/agent lint`
- `/agent testing`
- `/agent e2e-testing`
- `/agent docs`
- `/agent reflective`
- `/agent unit-testing` (deprecated alias)

All wrappers route to contracts defined in [workflow-playbooks](/Users/lenny/Projects/lennypeters/.github/skills/workflow-playbooks/SKILL.md).

## Skills

| Skill | Purpose | Example |
|---|---|---|
| `workflow-playbooks` | Canonical phase contracts used by pipeline and wrappers | `/workflow-playbooks full` |
| `internet-research` | Context7-backed dependency/API research | `/internet-research Next.js caching` |
| `testing` | Jest + RTL unit/component test support | `/testing add tests for header` |
| `e2e-testing` | Playwright e2e authoring/repair | `/e2e-testing fix /about flow` |
| `reflect` | Failure logging and rule extraction | `/reflect` |
| `impeccable` | Frontend design critique/refinement | `/impeccable craft hero section` |
| `figma-design` | Figma design implementation workflow | `/figma-design <url>` |
| `write-article` | Research + article drafting workflow | `/write-article` |
| `pr-publishing` | PR creation + description quality workflow | `/pr-publishing` |

Agents and skills should both consume [AGENT_LEARNINGS.md](/Users/lenny/Projects/lennypeters/.github/AGENT_LEARNINGS.md) when applicable.

For article generation, frontend design iteration, and Figma implementation, prefer the specialized user-facing agents listed above (`write-article`, `figma-design`) and their matching skills when you need inline execution.

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

<!-- mermaid-ai-skills:start -->

## Mermaid Diagrams

When the user asks to create, edit, or visualize a diagram, follow the
instructions in `.github/instructions/mermaid.instructions.md`.

<!-- mermaid-ai-skills:end -->
