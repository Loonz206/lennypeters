---
name: commit-message
description: >
  Generate compliant, professional commit messages following the Commitizen (Conventional Commits) format.
  This ensures a clean, searchable, and machine-parsable project history.
---

# Commit Message Skill

Use this skill to generate structured commit messages for any code changes, refactors, or configuration updates. It enforces the **Conventional Commits** standard commonly used by tools like Commitizen.

## Supported Types

The following types are recommended for consistent versioning and categorization:

- `feat`: A new feature (estimated impact: high)
- `fix`: A bug fix (must include a description of the fix)
- `docs`: Documentation changes only
- `style`: Formatting, linting, or UI tweaks that do not affect logic
- `refactor`: Code changes that neither fix bugs nor add features (cleaner code)
- `perf`: Changes specifically for performance improvements
- `test`: Adding or modifying tests
- `chore`: Build tasks, dependencies, or tooling updates
- `ci`: Continuous Integration configuration (GitHub Actions, etc.)
- `revert`: Reverting a previous commit

## Usage

Provide a brief description of the changes you made. The skill will format it into a compliant message.

**Example Input:**

> I fixed the bug where the button wouldn't show on mobile and cleaned up some messy code in the header component.

**Example Output:**

```text
fix(ui): resolve mobile visibility issue for buttons
refactor(header): clean up legacy logic
```

## Best Practices

1.  **Subject Line**: Keep it under 50 characters if possible. Use the imperative mood (e.g., "add" instead of "added").
2.  **Scope**: Optional. Add a scope in parentheses (e.g., `feat(api):`) to narrow down which part of the system changed.
3.  **Body**: For complex changes, include a blank line after the subject and then describe _why_ the change was made and any side effects.
4.  **Breaking Changes**: If a change breaks backward compatibility, include `BREAKING CHANGE:` in the footer or add an `!` after the type/scope (e.g., `feat(auth)!: remove v1 endpoint`).

## Integration with Code Agent

This skill is designed to work in tandem with the **Code Agent**. When performing refactors or bug fixes, use this tool to ensure that the final commit description matches the actual changes implemented.
