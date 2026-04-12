## Why

The Express server accepts raw user input in `req.body`, `req.query`, and `req.params` which are passed into MongoDB queries without any sanitization, leaving the API vulnerable to NoSQL injection attacks (e.g., `$gt`, `$regex`, `$where` operators injected via query strings or request bodies). A zero-dependency internal sanitizer middleware provides the first layer in a defense-in-depth stack, stripping dangerous keys before they reach any route handler.

## What Changes

- **New file** `server/src/middleware/sanitize.ts`: exports a `sanitize()` utility function and a `mongoSanitize()` Express middleware factory that strips keys starting with `$` or containing `.` from `req.body`, `req.query`, and `req.params`.
- **New file** `server/src/middleware/__tests__/sanitize.test.ts`: unit tests covering primitive passthrough, `$`-key stripping, `.`-key stripping, array traversal, and deeply nested objects.
- **Edit** `server/src/app.ts`: wire `app.use(mongoSanitize())` after `express.json()` and before route handlers.

## Capabilities

### New Capabilities

- `nosql-injection-prevention`: Middleware layer that recursively sanitizes all incoming request data by stripping MongoDB operator keys (`$`-prefixed) and dot-notation keys before they reach route handlers.

### Modified Capabilities

<!-- No existing spec-level requirement changes -->

## Impact

- **Files**: `server/src/middleware/sanitize.ts` (new), `server/src/middleware/__tests__/sanitize.test.ts` (new), `server/src/app.ts` (edit)
- **Dependencies**: Zero new npm dependencies — pure TypeScript, uses only Express types already installed
- **APIs**: No API contract changes — sanitization is transparent to valid clients
- **Security**: Closes NoSQL injection vector as the outermost defense layer; works in concert with Zod `.strict()` validation, explicit filter construction, and Mongoose `sanitizeFilter`/`strictQuery` settings
