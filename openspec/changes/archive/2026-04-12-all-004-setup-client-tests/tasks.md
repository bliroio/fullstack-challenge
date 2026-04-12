## 1. Install Dependencies

- [x] 1.1 Run `npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom fast-check msw` in the `client/` directory

## 2. Configure Vitest

- [x] 2.1 Create `client/vitest.config.ts` with jsdom environment, globals, include pattern for `app/**/*.test.{ts,tsx}`, setupFiles pointing to `./app/__tests__/setup.ts`, and `@shared` alias resolving to `../shared`

## 3. Create Test Setup and Mocks

- [x] 3.1 Create `client/app/__tests__/mocks/handlers.ts` with default MSW handler for `GET http://localhost:3000/api/meetings` returning an empty paginated response
- [x] 3.2 Create `client/app/__tests__/mocks/server.ts` that sets up the MSW Node server with the default handlers
- [x] 3.3 Create `client/app/__tests__/setup.ts` that imports `@testing-library/jest-dom/vitest` and manages MSW server lifecycle (beforeAll/afterEach/afterAll)

## 4. Create Test Helpers

- [x] 4.1 Create `client/app/__tests__/helpers/TestProviders.tsx` wrapping children with MUI `ThemeProvider` (default theme) and `LocalizationProvider` (AdapterDateFns)

## 5. Update package.json Scripts

- [x] 5.1 Add `"test": "vitest run"` script to `client/package.json`
- [x] 5.2 Add `"test:watch": "vitest"` script to `client/package.json`

## 6. Verify

- [x] 6.1 Run `npm test` in `client/` and confirm Vitest loads config and setup without errors (zero exit or "no test files found")
