---
description: "Use when preparing a release version bump. Enforces semver mapping and single source of truth in package.json."
---

# Semver Instruction

## Rules

1. Version source of truth is `package.json`.
2. Do not hardcode version strings in source/docs.
3. Use npm versioning commands for bumps (creates matching tags).

## Bump Mapping

- `fix` → patch
- `feat` → minor
- breaking (`!` or `BREAKING CHANGE`) → major

## Release Commands

```bash
pnpm version patch
pnpm version minor
pnpm version major
git push --follow-tags
```
