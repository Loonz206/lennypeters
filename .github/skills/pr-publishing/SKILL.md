---
name: pr-publishing
description: >
  Create and publish GitHub pull requests with clear descriptions, validation evidence,
  and reviewer-ready checklists. Use when asked to open/push a PR, write PR descriptions,
  or finalize contribution metadata.
argument-hint: "Describe branch, base branch, PR title intent, and key changes to include"
---

# PR Publishing Skill

Use this skill to standardize pull request creation and PR description quality.

## Prerequisites

1. Branch is pushed to remote.
2. Validation status is known (`lint`, `unit`, `e2e` as applicable).
3. You have a concise summary of changed files and rationale.

## Workflow

1. Confirm git branch and remote status.
2. Build PR body using [pull_request_template.md](/Users/lenny/Projects/lennypeters/.github/pull_request_template.md).
3. Include:
   - summary,
   - playbook used,
   - validation commands and outcomes,
   - skipped phases and risk.
4. Create or update PR using `gh` CLI.
5. Verify PR body renders correctly in GitHub.

## Recommended Commands

```bash
gh pr create --base <base> --head <branch> --title "<title>" --body-file <file>
gh pr edit <number> --title "<title>" --body-file <file>
gh pr view <number> --web
```

## Rules

- Do not claim checks passed unless they actually ran.
- Do not leave validation sections blank.
- Keep descriptions reviewer-oriented and evidence-based.
