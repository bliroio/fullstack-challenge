## 1. Test File (TDD Red)

- [x] 1.1 Create `server/src/middleware/__tests__/validate.test.ts` with property-based tests using `fast-check` covering: valid query input calls `next()` and coerces types; invalid query input returns 400 with structured errors; invalid body input returns 400 with structured errors

## 2. Middleware Implementation

- [x] 2.1 Create `server/src/middleware/validate.ts` exporting a `validate(schema, source)` factory function that calls `schema.safeParse(req[source])`, returns 400 with `{ message: "Validation failed", errors: fieldErrors }` on failure, or replaces `req[source]` with parsed data and calls `next()` on success

## 3. Verification

- [x] 3.1 Run `cd server && npx tsc --noEmit` to confirm TypeScript compiles with no errors
- [x] 3.2 Run `npx vitest run server/src/middleware/__tests__/validate.test.ts` to confirm all tests pass
