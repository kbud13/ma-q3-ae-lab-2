# Testing Guidelines

This document defines the testing principles and required testing standards for the TODO app.

## Testing Principles

- All new features must include appropriate tests.
- Tests must be maintainable, readable, and aligned with project best practices.
- All tests must be isolated and independent.
- Each test must set up its own data and must not rely on other tests.
- Setup and teardown hooks are required so tests pass reliably across multiple runs.

## Unit Tests

- Use Jest to test individual functions and React components in isolation.
- Unit tests must use the naming convention `*.test.js` or `*.test.ts`.
- Backend unit tests must be placed in `packages/backend/__tests__/`.
- Frontend unit tests must be placed in `packages/frontend/src/__tests__/`.
- Name unit test files to match what they test.
- Example: `app.test.js` for `app.js`.

## Integration Tests

- Use Jest + Supertest to test backend API endpoints with real HTTP requests.
- Integration tests must be placed in `packages/backend/__tests__/integration/`.
- Integration tests must use the naming convention `*.test.js` or `*.test.ts`.
- Name integration test files based on the endpoint or behavior under test.
- Example: `todos-api.test.js` for TODO API endpoint coverage.

## End-to-End (E2E) Tests

- Use Playwright (required framework) for complete UI workflow testing through browser automation.
- E2E tests must be placed in `tests/e2e/`.
- E2E tests must use the naming convention `*.spec.js` or `*.spec.ts`.
- Name E2E test files based on user journeys.
- Example: `todo-workflow.spec.js`.
- Playwright tests must use one browser only.
- Playwright tests must use the Page Object Model (POM) pattern for maintainability.
- Limit E2E tests to 5-8 critical user journeys.
- Focus on happy paths and key edge cases rather than exhaustive coverage.

## Port Configuration

- Always use environment variables with sensible defaults for port configuration.
- Backend default pattern:

```js
const PORT = process.env.PORT || 3030;
```

- Frontend default is port 3000 (React default), and it may be overridden with the `PORT` environment variable.
- This pattern allows CI/CD workflows to dynamically detect and assign ports.
