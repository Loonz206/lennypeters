---
applyTo: '**'
description: 'Semver rules: single source of truth, bump mapping, no hardcoded versions.'
---

# Semver Instructions

Follow [semver.org](https://semver.org): `MAJOR.MINOR.PATCH`.

## Source of truth

- `package.json` `version` is the only version number. Never hardcode a version
  string in components, styles, docs, or tests.
- The site displays it via `NEXT_PUBLIC_APP_VERSION`, injected at build time in
  `next.config.ts`. Bumping `package.json` auto-updates the UI on next build.
- The README version badge reads `package.json` live from `main` via shields.io —
  it needs no manual updates.

## How to release

Use the built-in npm semver client, which bumps `package.json` and creates a git tag:

```bash
pnpm version patch   # backwards-compatible bug fixes  (fix:)
pnpm version minor   # new backwards-compatible features (feat:)
pnpm version major   # breaking changes (feat!/fix! or BREAKING CHANGE:)
git push --follow-tags
```

Never edit the version field by hand — hand edits skip tag creation and break
the version ↔ tag correspondence.

## Bump mapping (from Conventional Commits)

| Commit types | Bump |
| ------------ | ---- |
| `fix:` | patch |
| `feat:` | minor |
| `!` or `BREAKING CHANGE:` footer | major |
| `docs:/style:/refactor:/perf:/test:/chore:/ci:` | no release (no bump) |

When a change set mixes types, take the highest bump. Pre-`1.0.0` rules do not
apply — this repo is `>= 1.0.0` and live in production.

## Rules for AI agents

1. Never write a literal version (e.g. `v4.2.1`) into source, tests, or docs.
2. Every user-facing version bump goes through `pnpm version <patch|minor|major>`.
3. One bump per release, even if several commits qualify — use the highest required.
4. After bumping, confirm the UI reads `process.env.NEXT_PUBLIC_APP_VERSION`
   (no new plumbing needed) and that `git tag` matches `package.json`.
