## ADDED Requirements

### Requirement: Vitest runs client tests with jsdom environment
The client package SHALL have a `vitest.config.ts` that configures Vitest with `globals: true`, `environment: "jsdom"`, and `setupFiles` pointing to the global test setup file. The `include` pattern SHALL cover `app/**/*.test.{ts,tsx}`.

#### Scenario: Vitest starts without config errors
- **WHEN** `npm test` is run in the `client/` directory
- **THEN** Vitest loads the configuration and exits cleanly (zero errors from config or setup imports), even when no test files are present

#### Scenario: shared workspace package resolves in tests
- **WHEN** a test file imports from `"shared"`
- **THEN** the import resolves to the `shared` workspace package via npm workspaces symlink

### Requirement: MSW server lifecycle managed globally
The test setup file SHALL start the MSW server before all tests (`beforeAll`), reset handlers after each test (`afterEach`), and close the server after all tests (`afterAll`).

#### Scenario: MSW server starts before tests
- **WHEN** the Vitest test suite initializes
- **THEN** the MSW Node server is listening and will intercept matching HTTP requests

#### Scenario: Handler overrides are isolated per test
- **WHEN** a test adds a runtime handler override via `server.use()`
- **THEN** that override is active only for that test and is removed by `server.resetHandlers()` after the test completes

### Requirement: Default MSW handler returns empty meetings list
The default handlers SHALL intercept `GET http://localhost:3000/api/meetings` and return a valid paginated empty response with HTTP 200.

#### Scenario: Meetings endpoint returns safe default
- **WHEN** a component makes a GET request to `/api/meetings` during a test without a custom handler override
- **THEN** the MSW server responds with `{ docs: [], totalDocs: 0, limit: 10, page: 1, totalPages: 0, hasPrevPage: false, hasNextPage: false }` and HTTP 200

### Requirement: TestProviders wraps MUI dependencies
The `TestProviders` component SHALL wrap its children with `ThemeProvider` (using a default theme) and `LocalizationProvider` (using `AdapterDateFns`) so that MUI components render without context errors in tests.

#### Scenario: MUI component renders without provider errors
- **WHEN** a MUI component is rendered inside `TestProviders`
- **THEN** no "missing context" or theme errors are thrown

### Requirement: Test and test:watch scripts available
The `client/package.json` SHALL include `"test": "vitest run"` and `"test:watch": "vitest"` scripts.

#### Scenario: npm test runs and exits
- **WHEN** `npm test` is executed in the `client/` directory
- **THEN** Vitest runs in non-interactive mode and exits with a zero or "no tests found" result

#### Scenario: npm run test:watch starts watch mode
- **WHEN** `npm run test:watch` is executed
- **THEN** Vitest starts in watch mode and does not immediately exit
