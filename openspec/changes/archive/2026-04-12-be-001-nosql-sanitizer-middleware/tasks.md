## 1. Test File (TDD Red)

- [x] 1.1 Create `server/src/middleware/__tests__/sanitize.test.ts` with unit tests covering: stripping `$`-prefixed keys, stripping dot-notation keys, array traversal, primitive passthrough, and deeply nested objects

## 2. Core Implementation

- [x] 2.1 Create `server/src/middleware/sanitize.ts` with exported `sanitize<T>(value: T): T` utility that recursively strips `$`-prefixed and dot-notation keys from objects and traverses arrays
- [x] 2.2 Add exported `mongoSanitize()` Express middleware factory to `server/src/middleware/sanitize.ts` that applies `sanitize()` to `req.body`, `req.query`, and `req.params` then calls `next()`

## 3. Wire Middleware

- [x] 3.1 Add `import { mongoSanitize } from "./middleware/sanitize"` to `server/src/app.ts`
- [x] 3.2 Add `app.use(mongoSanitize())` in `server/src/app.ts` after `app.use(express.json())` and before `app.use("/api/meetings", meetingRoutes)`

## 4. Verification

- [x] 4.1 Run `npx vitest run server/src/middleware/__tests__/sanitize.test.ts` — all 5 tests pass
- [x] 4.2 Run `cd server && npm run build` — TypeScript compiles with no errors
- [x] 4.3 Confirm `express-mongo-sanitize` is NOT present in `server/package.json`
