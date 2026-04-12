## ADDED Requirements

### Requirement: Server environment variables are documented
The project SHALL provide a `server/.env.example` file that documents every environment variable consumed by the server with a safe placeholder or default value. This file SHALL be committed to git and SHALL NOT be listed in `.gitignore`.

#### Scenario: Developer copies the example file to set up locally
- **WHEN** a developer runs `cp server/.env.example server/.env`
- **THEN** they have a valid starting-point `.env` with all required variable names present and safe placeholder values

#### Scenario: File covers all server process.env references
- **WHEN** a developer searches `server/src/**` for `process.env.*`
- **THEN** every variable found has a corresponding entry in `server/.env.example`

#### Scenario: MONGODB_URI placeholder is clearly non-functional
- **WHEN** a developer reads `server/.env.example`
- **THEN** the `MONGODB_URI` value SHALL be `[MY_PERSONAL_ACCESS_KEY]` to signal that a real key must be supplied

### Requirement: Client environment variables are documented
The project SHALL provide a `client/.env.local.example` file that documents every environment variable consumed by the Next.js client with a safe placeholder or default value. This file SHALL be committed to git and SHALL NOT be listed in `.gitignore`.

#### Scenario: Developer copies the example file to set up locally
- **WHEN** a developer runs `cp client/.env.local.example client/.env.local`
- **THEN** they have a valid starting-point `.env.local` with all required variable names present

#### Scenario: NEXT_PUBLIC_ prefix is used for browser-exposed variables
- **WHEN** a developer reads `client/.env.local.example`
- **THEN** all variables intended for browser use SHALL use the `NEXT_PUBLIC_` prefix as required by Next.js
