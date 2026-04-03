---
name: testing
description: >
  Write, update, and fix Jest and React Testing Library tests for this Next.js
  portfolio. Use for unit tests, component tests, accessible assertions,
  colocated __tests__ files, and repo-specific testing patterns.
argument-hint: 'Describe the component or behavior to test and any failing Jest output'
---

# Testing Skill

Use this skill when you need to write, update, or repair Jest and React Testing Library coverage in this repository.

## When to Use

- The user asks for unit tests or component tests.
- A Jest failure needs to be diagnosed and fixed.
- A React or Next.js component needs accessible assertions.
- A test needs to follow this repo's colocated `__tests__` structure.

## Repo-Specific Conventions

- Test files live alongside components in a `__tests__/` folder.
- Test filenames use the `.test.tsx` suffix.
- Jest matches `src/**/*.test.{ts,tsx}`.
- `@testing-library/jest-dom` is already loaded via `jest.setup.ts`.
- Prefer `render` and `screen` from `@testing-library/react`.
- Prefer queries by role or accessible name over test IDs.

Example:

```tsx
import { render, screen } from '@testing-library/react'
import ExampleComponent from '../index'

describe('ExampleComponent', () => {
  it('renders the name prop as a heading', () => {
    render(<ExampleComponent name="Web Engineer" />)
    expect(screen.getByRole('heading', { name: 'Web Engineer' })).toBeInTheDocument()
  })
})
```

## Procedure

1. Identify the source file and the closest colocated test file.
2. Read the component or page to determine the user-visible behavior to assert.
3. Reuse existing patterns before introducing mocks or helpers.
4. Write tests around rendered output and accessible behavior:
   - headings, links, buttons, lists, landmarks, and text visible to the user
   - state transitions the user can observe
   - data-driven rendering with realistic props or fixture values
5. Add mocks only when necessary:
   - mock framework hooks such as `next/navigation` only for components that depend on them
   - keep mocks narrow and local to the test file
6. Run the narrowest useful test scope first, then the full Jest suite:
   - `npm test -- --testPathPattern="path/to/file"`
   - `npm test -- -t "test name"`
   - `npm test`

## Preferred Patterns

- Prefer one clear assertion path per behavior.
- Use `getByRole` for synchronous required UI.
- Use `findByRole` or `findByText` for async UI.
- Use `queryByRole` only for absence assertions.
- Keep test names behavior-focused and user-facing.

## Avoid

- Asserting implementation details when the rendered output is enough.
- Over-mocking child components unless they block the test.
- Using `test.skip`, `xit`, or weakening assertions to make failures disappear.
- Creating test-only abstractions unless repeated patterns justify them.

## Common Targets In This Repo

- Presentational components in `src/components/*`
- App Router pages in `src/app/*`
- Navigation-aware components that may need `next/navigation` mocks
- Data-backed rendering that pulls from `src/data/*`

## Checklist

- [ ] Test file is colocated in `__tests__/`
- [ ] Filename ends with `.test.tsx`
- [ ] Assertions use accessible queries where possible
- [ ] Mocks are minimal and local
- [ ] Focused Jest run passes before full suite run
