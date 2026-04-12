## Context

The Express server currently passes raw `req.body`, `req.query`, and `req.params` into MongoDB query logic with no sanitization. An attacker can craft requests with MongoDB operator keys (`$gt`, `$regex`, `$where`, etc.) or dot-notation keys to manipulate queries. The `express-mongo-sanitize` package that would typically address this is unmaintained (last publish pre-2025), making an internal implementation preferable. The sanitization logic is ~20 lines — simple enough to own with full test coverage.

This middleware is the outermost layer of a defense-in-depth stack:
1. **Sanitizer middleware** (this task) — strips `$`/`.` keys before any route handler sees them
2. **Zod `.strict()` validation** — rejects unknown keys at the schema boundary
3. **Explicit filter construction** — only known fields passed to MongoDB filters
4. **`sanitizeFilter: true` / `strictQuery: true`** — Mongoose-level protection

## Goals / Non-Goals

**Goals:**
- Strip keys starting with `$` or containing `.` from `req.body`, `req.query`, and `req.params` recursively
- Export a pure `sanitize()` function separately from the Express middleware for isolated unit testing
- Zero new npm dependencies
- Wire the middleware into `app.ts` after `express.json()` and before all route handlers

**Non-Goals:**
- Sanitizing response data
- Handling URL-encoded bodies (out of scope for this task — `express.json()` is the only body parser in use)
- Replacing any of the other defense layers (Zod, Mongoose settings)

## Decisions

### Decision: Internal implementation over `express-mongo-sanitize`

The `express-mongo-sanitize` package is unmaintained and the sanitization logic is trivial (~20 lines). Writing it internally gives full test coverage, eliminates a dependency on an unmaintained package, and keeps the logic visible and auditable in the codebase.

**Alternatives considered:**
- Use `express-mongo-sanitize`: Rejected — unmaintained, adds an external dependency for trivial logic.
- Use a different sanitize package: No maintained alternatives with an equivalent API surface.

### Decision: Place middleware after `express.json()`, before routes

`req.body` is only populated after `express.json()` parses the request. Placing the sanitizer before the body parser would leave `req.body` undefined. `req.query` and `req.params` are available earlier, but splitting the middleware placement provides no benefit and increases complexity.

### Decision: Export `sanitize()` separately from `mongoSanitize()`

The `sanitize()` utility is a pure function that can be unit-tested without Express machinery. The `mongoSanitize()` factory wraps it for Express integration. This separation keeps tests simple and the core logic reusable.

### Decision: Recursive traversal strips both objects and arrays

Attackers may nest injection keys inside arrays or deeply nested objects. Recursive traversal ensures no injection key survives regardless of nesting depth.

## Risks / Trade-offs

- **[Risk] Legitimate keys stripped**: A valid field named `$currency` or `a.b` would be stripped. Mitigation: The Zod schemas (ALL-006) define the accepted shape — no legitimate Meeting field uses `$`-prefix or dot-notation, so no valid request data is lost.
- **[Risk] Performance on large bodies**: Deep recursion on extremely large request bodies could be slow. Mitigation: The API enforces a JSON body size limit via Express defaults; deeply nested Meeting data is not a realistic payload shape.
- **[Risk] Future routes bypass sanitizer**: A route added after `app.use(mongoSanitize())` in `app.ts` would still be sanitized. Routes added before would not. Mitigation: The middleware is placed globally before all route registrations, not per-router.
