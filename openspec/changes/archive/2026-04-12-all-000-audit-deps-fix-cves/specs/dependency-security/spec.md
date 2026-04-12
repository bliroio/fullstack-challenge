## ADDED Requirements

### Requirement: Server dependencies have no HIGH or CRITICAL CVEs
The server npm dependency tree SHALL contain zero HIGH or CRITICAL severity vulnerabilities as reported by `npm audit`.

#### Scenario: Server audit passes clean
- **WHEN** `npm audit` is run in the `server/` directory
- **THEN** the output SHALL report 0 HIGH vulnerabilities and 0 CRITICAL vulnerabilities

#### Scenario: Server TypeScript build succeeds after audit fix
- **WHEN** `npm run build` is executed in the `server/` directory after running `npm audit fix`
- **THEN** the build SHALL complete with zero TypeScript errors

### Requirement: Mongoose version is at least 8.9.5
The resolved mongoose version in `server/node_modules` SHALL be 8.9.5 or later to patch CVE-2025-23061 (query injection via `populate()` match filters, CVSS 9.0) and CVE-2024-53900.

#### Scenario: Mongoose resolves to patched version
- **WHEN** `node -e "console.log(require('mongoose/package.json').version)"` is run in `server/`
- **THEN** the printed version SHALL be 8.9.5 or greater

### Requirement: Client dependencies have no HIGH or CRITICAL CVEs
The client npm dependency tree SHALL contain zero HIGH or CRITICAL severity vulnerabilities as reported by `npm audit`, including CVE-2025-66478 (Next.js RCE, CVSS 10.0) and the axios CVEs.

#### Scenario: Client audit passes clean
- **WHEN** `npm audit` is run in the `client/` directory
- **THEN** the output SHALL report 0 HIGH vulnerabilities and 0 CRITICAL vulnerabilities

#### Scenario: Next.js is patched to 15.5.x or later
- **WHEN** `node -e "console.log(require('next/package.json').version)"` is run in `client/`
- **THEN** the printed version SHALL be 15.5.0 or greater

### Requirement: No application source code is modified during the audit fix
The audit fix process SHALL only update `package-lock.json` files and `node_modules/`. No files under `server/src/` or `client/app/` SHALL be modified.

#### Scenario: Source files are unchanged after audit fix
- **WHEN** `git diff --name-only` is run after completing both `npm audit fix` runs
- **THEN** the output SHALL not include any files under `server/src/` or `client/app/`
