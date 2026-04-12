## 1. Create escapeRegExp Utility (TDD - Write Tests First)

- [x] 1.1 Create `server/src/utils/__tests__/escapeRegExp.test.ts` with unit tests covering all 12 metacharacters, ReDoS patterns, match-all bypass, empty string, and literal match in RegExp constructor
- [x] 1.2 Verify tests fail (red) before implementation: `npx vitest run server/src/utils/__tests__/escapeRegExp.test.ts`

## 2. Implement escapeRegExp Utility

- [x] 2.1 Create `server/src/utils/escapeRegExp.ts` exporting `escapeRegExp(str: string): string` using `str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")`
- [x] 2.2 Verify all unit tests pass (green): `npx vitest run server/src/utils/__tests__/escapeRegExp.test.ts`

## 3. Harden meetingService.ts

- [x] 3.1 Add `import { escapeRegExp } from "../utils/escapeRegExp"` to `server/src/services/meetingService.ts`
- [x] 3.2 Add `ListMeetingsQuery` interface (`{ page: number; limit: number; title?: string }`) to `meetingService.ts`
- [x] 3.3 Replace `query: any` parameter type with `query: ListMeetingsQuery`
- [x] 3.4 Replace spread destructuring `const { page = 1, limit = 10, ...filters } = query` with explicit `const { page = 1, limit = 10, title } = query`
- [x] 3.5 Remove `parseInt()` calls — use `page` and `limit` directly as numbers in `options`
- [x] 3.6 Build explicit `filters: Record<string, unknown> = {}` object and set `filters.title = new RegExp(escapeRegExp(title), "i")` when title is present
- [x] 3.7 Update `Meeting.paginate(filters, options)` call to use the new explicit `filters` object

## 4. Fix Controller Type Cast

- [x] 4.1 In `server/src/controllers/meetingController.ts`, update the `listMeetings` call to cast `req.query as any` to satisfy the new typed interface until BE-005 wires Zod on GET

## 5. Build Verification

- [x] 5.1 Run `cd server && npm run build` and confirm zero TypeScript errors
- [x] 5.2 Run `npx vitest run server/src/utils/__tests__/escapeRegExp.test.ts` and confirm all tests pass
