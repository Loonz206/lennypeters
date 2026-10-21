---
name: testing
description: >
  Write, update, and repair Jest + React Testing Library unit/component tests
  using this repo's colocated .test.tsx conventions and accessibility-first assertions.
argument-hint: "Describe the component/behavior and any failing Jest output"
---

# Testing Skill

Use this skill for unit/component test authoring and repair.

## Conventions (Repository-Accurate)

- Test files are colocated with source and end with `.test.tsx`.
- Do not require a `__tests__` subfolder unless an existing feature already uses one.
- Prefer `getByRole`/`findByRole` over test IDs.
- Use `@testing-library/jest-dom` matchers.

## Workflow

1. Read the source component/page behavior.
2. Add or update colocated `.test.tsx` coverage.
3. Run focused tests first, then full CI test run.
4. Keep mocks minimal and local.
5. Never skip/delete tests to force pass.
