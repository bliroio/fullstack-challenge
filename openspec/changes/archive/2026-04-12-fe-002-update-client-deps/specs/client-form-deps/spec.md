## ADDED Requirements

### Requirement: Client has form validation dependencies installed
The client package.json SHALL include `zod`, `react-hook-form`, and `@hookform/resolvers` as runtime dependencies.

#### Scenario: Dependencies present in package.json
- **WHEN** `client/package.json` is inspected
- **THEN** `zod`, `react-hook-form`, and `@hookform/resolvers` are listed under `dependencies`

#### Scenario: Zod version matches server
- **WHEN** the client and server `zod` version ranges are compared
- **THEN** both specify `^4.0.14` or a compatible range
