## Context

`meetingService.ts` was written before any validation or sanitization infrastructure existed. BE-001 added a NoSQL sanitizer middleware (strips `$`-prefixed keys) and BE-002 added Zod validation middleware (coerces `page`/`limit` to numbers, trims `title`). Despite these upstream guards, the service still:

1. Passes raw user input directly into `new RegExp(filters.title, "i")` — enabling ReDoS and regex injection
2. Uses the spread pattern `...filters` to pass all unknown query params through to MongoDB
3. Re-parses `page` and `limit` via `parseInt()` even though Zod has already coerced them to numbers
4. Types `query` as `any`, losing all type safety

## Goals / Non-Goals

**Goals:**
- Escape all regex metacharacters in user-supplied title searches using a reusable, tested utility
- Replace the dangerous `...filters` spread with explicit destructuring of known fields only
- Replace `query: any` with a typed `ListMeetingsQuery` interface
- Remove redundant `parseInt()` calls superseded by Zod middleware
- Provide unit tests covering all 12 metacharacters, ReDoS patterns, and edge cases

**Non-Goals:**
- Adding new query parameters or API fields (that is BE-004/BE-005 scope)
- Replacing `req.query` typing in the controller (requires BE-005 Zod wiring on GET)
- Changing the external API contract — title search behavior is identical, just safely implemented

## Decisions

### Decision: Inline `escapeRegExp` rather than add a dependency

**Chosen:** Inline a one-liner `str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")` in `server/src/utils/escapeRegExp.ts`.

**Alternatives considered:**
- `escape-string-regexp` v5: ESM-only — incompatible with our CommonJS server without additional tooling
- `escape-string-regexp` v4: Works but unmaintained since 2021
- Native `RegExp.escape()` (ES2025/TC39 Stage 4): Available in Node 24+, but not yet the minimum target

**Rationale:** The logic is a single well-understood `replace()` call, identical to what `escape-string-regexp` ships. Inlining avoids a dependency for trivial code and is forward-compatible — the file can be deleted and replaced with `RegExp.escape()` when Node 24+ is the minimum.

### Decision: Use native `RegExp` object (not `$regex` string operator)

**Chosen:** Pass `new RegExp(escapeRegExp(title), "i")` to Mongoose as the filter value.

**Alternatives considered:**
- `{ $regex: escapeRegExp(title), $options: "i" }`: The MongoDB string operator form. While the sanitizer only strips `$`-prefixed keys from request input (not server-constructed objects), `mongoose-paginate-v2` does not recognize this object form — it attempts to cast the entire `{ $regex, $options }` object as a string for the `title` field, causing a `CastError`.

**Rationale:** Mongoose and `mongoose-paginate-v2` natively understand `RegExp` objects in filter conditions. Using `new RegExp(escapeRegExp(title), "i")` works correctly with the paginate plugin and is the standard Mongoose pattern for regex filters.

### Decision: Typed interface at the service boundary

**Chosen:** Introduce `ListMeetingsQuery { page: number; limit: number; title?: string }` in `meetingService.ts`.

**Rationale:** The controller calls the service with `req.query as any` as a temporary cast until BE-005 replaces `req.query` with Zod-parsed output. The interface documents the expected shape and catches misuse at compile time when the cast is eventually removed.

## Risks / Trade-offs

- **Controller type cast**: After this change, `req.query` (type `ParsedQs`) is not assignable to `ListMeetingsQuery`. A temporary `as any` cast in the controller is required. This is tracked in BE-005. Risk is low — the cast is localized and explicit.
- **Regex behavior change (intended)**: `title=stand.up` previously matched "stand" + any character + "up"; after this change it matches only the literal string "stand.up". This is the desired hardening behavior.
- **No external dependency added**: The inlined utility has no automatic updates. If a bug is found in the regex metacharacter set, it must be patched manually. Mitigation: the function is well-tested and the metacharacter set is stable (standardized in TC39 proposal).
