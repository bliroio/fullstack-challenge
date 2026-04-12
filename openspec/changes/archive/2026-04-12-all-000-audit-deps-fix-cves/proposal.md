## Why

Three critical/high CVEs are present in the project's current dependencies, including CVE-2025-66478 (CVSS 10.0) — an unauthenticated Remote Code Execution vulnerability in Next.js via the React Server Components protocol. These must be patched before any feature work to prevent vulnerable transitive dependencies from propagating into new installs.

## What Changes

- **Server**: Run `npm audit fix` to patch express (4.18→4.22), mongoose (^8.0.1→8.9.5+), js-yaml, minimatch, and validator
- **Client**: Run `npm audit fix` to patch next (15.4.4→15.5.x, fixes CVE-2025-66478), axios (1.6.2→1.15.0), and yaml
- No application source code changes — only `package-lock.json` files are modified
- No new dependencies added

## Capabilities

### New Capabilities

- `dependency-security`: Ensures all server and client npm dependencies are free of known HIGH and CRITICAL CVEs, with audit passing clean after fix

### Modified Capabilities

<!-- No existing spec-level capabilities are changing — this task modifies infrastructure only -->

## Impact

- `server/package-lock.json`: Updated by `npm audit fix`
- `client/package-lock.json`: Updated by `npm audit fix`
- Server TypeScript build must remain error-free after dependency bump
- Client build is expected to fail due to a pre-existing layout.tsx issue (tracked in FE-000), unrelated to this change
- No API surface changes, no runtime behavior changes
