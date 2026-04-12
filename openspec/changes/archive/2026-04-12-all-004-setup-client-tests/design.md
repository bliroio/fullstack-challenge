## Context

The client is a Next.js 15 application using React 18 and MUI v5. It currently has no test runner, no test helpers, and no mock server. All subsequent UI tasks (form tests, page integration tests, property-based component tests) require a working test harness before they can be written.

The server-side test infrastructure (ALL-003) established Vitest as the project-wide test runner. Consistency between server and client runners simplifies the mental model and toolchain.

## Goals / Non-Goals

**Goals:**
- Install and configure Vitest with jsdom so component tests can run headlessly
- Wire React Testing Library for rendering and user-event interaction
- Set up MSW (Node adapter) for intercepting HTTP calls in tests without a live server
- Provide a `TestProviders` wrapper for MUI-dependent components
- Add `test` and `test:watch` npm scripts
- Resolve the `@shared` path alias so future tests can import shared Zod schemas

**Non-Goals:**
- Writing any actual component or integration tests (those are separate tasks)
- Configuring Playwright, Cypress, or any browser-based end-to-end runner
- Sharing a single vitest config between client and server (they are separate packages with different environments)

## Decisions

### Vitest over Jest
Vitest is used on the server already and is natively compatible with the Vite ecosystem. `@vitejs/plugin-react` handles JSX transform without additional Babel config. Jest would require a separate transformer setup and doesn't share config patterns with the server.

### jsdom environment (not happy-dom)
jsdom is the more battle-tested DOM emulation for React Testing Library. happy-dom has edge cases with form element behavior. The plan explicitly specifies jsdom.

### MSW Node adapter (not browser service worker)
Tests run in Node via Vitest; the browser service worker adapter cannot be used in Node. `msw/node` `setupServer` intercepts requests at the undici/node-fetch layer, which is what Axios uses in the test environment.

### Separate `vitest.config.ts` (not inside `next.config`)
Next.js has its own compilation pipeline. A standalone `vitest.config.ts` using `@vitejs/plugin-react` is the standard pattern recommended by Vitest docs for Next.js projects. It does not interfere with the Next.js build.

### `@shared` alias resolved from `__dirname`
The shared Zod schemas live at `../shared` relative to the `client/` directory. Resolving via `path.resolve(__dirname, "../shared")` in `vitest.config.ts` makes this available inside tests without modifying `tsconfig.json`.

## Risks / Trade-offs

- [Risk] MSW 2.x API (`http`, `HttpResponse`) differs from MSW 1.x (`rest`). → Mitigation: The plan and handlers already use the MSW 2.x API. Pinning to `msw` (latest) which is 2.x.
- [Risk] `@testing-library/jest-dom/vitest` import path may differ across versions. → Mitigation: The plan targets the stable import path; `@testing-library/jest-dom` >= 6.x exports `/vitest` entrypoint.
- [Risk] `fast-check` is installed but no tests use it yet. → No risk; unused dev dependency.
