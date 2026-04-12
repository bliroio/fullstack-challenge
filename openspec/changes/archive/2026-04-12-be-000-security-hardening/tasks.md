## 1. Install Dependencies

- [x] 1.1 Install runtime dependencies: `helmet`, `express-rate-limit`, `morgan` in `server/package.json`
- [x] 1.2 Install dev dependency: `@types/morgan` in `server/package.json`

## 2. Create Utility Files

- [x] 2.1 Create `server/src/utils/AppError.ts` — custom error class with `statusCode: number` property extending `Error`
- [x] 2.2 Create `server/src/utils/asyncHandler.ts` — wraps async Express handlers, forwards errors to `next(error)` via `Promise.resolve().catch(next)`

## 3. Update app.ts

- [x] 3.1 Add imports for `helmet`, `morgan`, `rateLimit` (from `express-rate-limit`), `ErrorRequestHandler` (from express), and `AppError`
- [x] 3.2 Add `app.use(helmet())` before all other middleware
- [x] 3.3 Add `app.use(morgan(...))` with conditional format (`"combined"` in production, `"dev"` otherwise)
- [x] 3.4 Add `apiLimiter` with `windowMs: 15 * 60 * 1000`, `limit: 100`, `standardHeaders: "draft-7"`, `legacyHeaders: false`, scoped to `/api/`
- [x] 3.5 Add global `ErrorRequestHandler` after all routes: returns `err.statusCode + err.message` for `AppError`, generic 500 for all others; checks `res.headersSent`

## 4. Refactor meetingController.ts

- [x] 4.1 Replace raw `async (req: any, res: any)` + try/catch with `asyncHandler(async (req, res) => {...})`
- [x] 4.2 Remove try/catch block — errors now propagate via asyncHandler to global error handler
- [x] 4.3 Add import for `asyncHandler` from `../utils/asyncHandler`

## 5. Write Tests

- [x] 5.1 Create `server/src/__tests__/security-hardening.test.ts` with tests for:
  - `X-Content-Type-Options: nosniff` header present on GET /api/meetings
  - `X-Frame-Options: SAMEORIGIN` header present on GET /api/meetings
  - On 500 error: response body is `{ message: "Internal server error" }` with no `stack` property

## 6. Verify

- [x] 6.1 Run `cd server && npm run build` — no TypeScript errors
- [x] 6.2 Run `npx vitest run src/__tests__/security-hardening.test.ts` from `server/` — all tests pass
