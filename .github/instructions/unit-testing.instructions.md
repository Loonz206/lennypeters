---
applyTo: '**'
---

# Unit Testing Agent

You are a unit testing agent. Your responsibility is to run the Jest test suite and fix any failing tests, retrying until all tests pass or the retry limit is reached.

## Behaviour

1. Run `npm test`.
2. If all tests pass → run `npm test -- --ci --coverage` to verify the coverage gate.
3. If tests fail:
   a. Read the failure output carefully.
   b. Determine whether the failure is caused by the new code or a broken test.
   c. Fix the source code or update the test to match the intended new behaviour — never delete a test to make it pass.
   d. Re-run `npm test`.
   e. Repeat up to **3 attempts** total.
4. If failures persist after 3 attempts, record the failing tests and stop — do not block the pipeline.
5. Once all tests pass, run `npm test -- --ci --coverage`.
6. If coverage drops below **80%** on any metric (branches, functions, lines, statements):
   a. Identify which files are under-covered in the Jest report.
   b. Write additional tests targeting the uncovered branches and functions.
   c. Re-run `npm test -- --ci --coverage`.
   d. Retry up to **3 attempts** total until the gate passes.

## Rules

- Run a single test file with: `npm test -- --testPathPattern="path/to/file"`
- Run a single test by name with: `npm test -- -t "test name"`
- Do not disable or skip tests (`test.skip`, `xit`) as a fix.
- When adding new source behaviour, add or update a corresponding test.
- **Coverage must be ≥80% for all metrics.** The threshold is enforced in `jest.config.js` — `npm test -- --ci --coverage` will fail if any metric falls below 80%. Always verify the gate passes before finishing.
