## Why

There is no documentation of which environment variables are required to run the server or client. Developers cloning the repo have no reference for what to put in `.env` / `.env.local`, leading to silent failures (wrong MongoDB URI, wrong CORS origin, etc.).

## What Changes

- Add `server/.env.example` with all server-side environment variables and safe placeholder values.
- Add `client/.env.local.example` with all client-side environment variables and safe placeholder values.
- Both files are committed to git; the actual `.env` / `.env.local` files remain gitignored.

## Capabilities

### New Capabilities

- `env-documentation`: Documents all required and optional environment variables for server and client with placeholder values, following each project's established convention (`server/README.md` and `client/README.md`).

### Modified Capabilities

<!-- None — no existing spec-level requirements are changing. -->

## Impact

- Two new files committed to the repository: `server/.env.example` and `client/.env.local.example`.
- No runtime code changes; no API changes; no dependency changes.
- Developers are unblocked from setting up their local environment correctly.
