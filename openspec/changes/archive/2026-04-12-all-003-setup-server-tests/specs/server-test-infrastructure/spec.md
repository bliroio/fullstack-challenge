## ADDED Requirements

### Requirement: App module is importable without side-effects
The system SHALL export the Express app from `server/src/app.ts` as a default export with no DB connection or port listener started as a side-effect of import.

#### Scenario: Importing app does not start a listener
- **WHEN** a test file imports `app` from `./app`
- **THEN** no TCP port is bound and no MongoDB connection is attempted

#### Scenario: App module exports the Express instance
- **WHEN** `app` is imported from `server/src/app`
- **THEN** the exported value is an Express application instance that handles registered routes

### Requirement: Server entry point connects DB and listens
The system SHALL provide `server/src/server.ts` as the runtime entry point that calls `connectDB()` and `app.listen()`.

#### Scenario: Server starts and prints connection messages
- **WHEN** `node dist/server.js` is executed with a valid `MONGODB_URI`
- **THEN** the process logs `MongoDB connected...` followed by `Server running on http://localhost:<port>`

#### Scenario: Server respects PORT environment variable
- **WHEN** `PORT=4000` is set and `node dist/server.js` is executed
- **THEN** the server listens on port 4000

### Requirement: Test runner is configured and operational
The system SHALL have Vitest configured as the test runner in `server/` such that `npm test` exits with code 0.

#### Scenario: npm test passes with no test files
- **WHEN** `npm test` is run in `server/` and no `*.test.ts` files exist
- **THEN** the command exits with code 0 and reports no failures

#### Scenario: Test files in src/ are discovered automatically
- **WHEN** a file matching `src/**/*.test.ts` exists
- **THEN** Vitest discovers and runs it without additional configuration

### Requirement: Test dependencies are available
The system SHALL have `vitest`, `supertest`, `@types/supertest`, and `fast-check` installed as dev dependencies in `server/package.json`.

#### Scenario: supertest can wrap the app
- **WHEN** a test imports `supertest` and wraps the exported `app`
- **THEN** HTTP requests can be made against the app without binding a real port

#### Scenario: fast-check is available for property tests
- **WHEN** a test imports `fast-check`
- **THEN** arbitraries and `fc.assert` are available for property-based testing
