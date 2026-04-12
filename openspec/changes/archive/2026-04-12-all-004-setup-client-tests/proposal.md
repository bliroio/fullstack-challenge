## Why

The client has no test infrastructure, making it impossible to write component or integration tests for subsequent UI tasks. Setting up Vitest + React Testing Library + MSW now provides the foundation all future client test tasks depend on.

## What Changes

- Install Vitest, React Testing Library, MSW, and fast-check as client dev dependencies
- Add `test` and `test:watch` npm scripts to `client/package.json`
- Create `client/vitest.config.ts` configured for jsdom environment with `@shared` alias
- Create a global test setup file that starts/resets/stops the MSW server lifecycle
- Create a `TestProviders` helper wrapping MUI's ThemeProvider and LocalizationProvider
- Create default MSW request handlers returning safe empty responses for `/api/meetings`
- Create the MSW Node server wired to the default handlers

## Capabilities

### New Capabilities

- `client-test-infrastructure`: Vitest + React Testing Library + MSW configuration and shared helpers enabling component and integration tests for the client application

### Modified Capabilities

<!-- None — no existing spec-level behavior changes -->

## Impact

- `client/package.json`: new devDependencies and two new scripts
- `client/vitest.config.ts`: new file (does not affect Next.js build — Vitest config is separate from `next.config`)
- `client/app/__tests__/`: new directory tree with setup, helpers, and mocks
- No runtime dependencies added; all changes are dev/test only
- No breaking changes
