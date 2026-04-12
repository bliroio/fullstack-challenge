## Why

`meetingService.ts` currently passes raw user input directly into MongoDB regex queries via `new RegExp(filters.title, "i")`, enabling ReDoS attacks, match-all bypasses, and regex injection. The dangerous spread pattern (`...filters`) also passes all unknown query params through to MongoDB as filters, which is a data exfiltration risk. With BE-001 (NoSQL injection sanitizer) and BE-002 (Zod validation middleware) already in place, the service now receives clean, typed data and can be simplified and hardened accordingly.

## What Changes

- **CREATE** `server/src/utils/escapeRegExp.ts` — a reusable utility that escapes all 12 regex metacharacters so user input is treated as a literal substring match inside `$regex`
- **CREATE** `server/src/utils/__tests__/escapeRegExp.test.ts` — unit tests covering all metacharacters, ReDoS patterns, match-all bypass, and edge cases (TDD approach)
- **EDIT** `server/src/services/meetingService.ts`:
  - Replace `query: any` with a typed `ListMeetingsQuery` interface
  - Remove redundant `parseInt()` calls (Zod coercion already handles this upstream)
  - Replace dangerous spread `...filters` with explicit destructuring of `title` only
  - Replace `new RegExp(filters.title, "i")` with `escapeRegExp(title)` passed to `$regex` operator
  - Build an explicit `filters` object with only known, safe fields

## Capabilities

### New Capabilities
- `regex-escape-utility`: A reusable `escapeRegExp` utility function with unit tests, used by the service layer to safely construct MongoDB regex queries from user input

### Modified Capabilities
- `meeting-title-search`: The server-side title search now escapes regex metacharacters before passing user input to MongoDB, preventing ReDoS and regex injection while preserving case-insensitive substring matching behavior

## Impact

- **`server/src/services/meetingService.ts`**: Simplified and hardened; parameter type changes from `any` to `ListMeetingsQuery`
- **`server/src/controllers/meetingController.ts`**: May need a temporary `as any` cast on `req.query` until BE-005 wires Zod validation to GET requests
- **`server/src/utils/escapeRegExp.ts`**: New file (no external dependency added — utility is inlined)
- **`server/src/utils/__tests__/escapeRegExp.test.ts`**: New test file; run with `npx vitest run server/src/utils/__tests__/escapeRegExp.test.ts`
- No API contract changes — external behavior is identical (title search still works, just safely)
