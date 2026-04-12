## 1. TDD — Write Tests First (Red Phase)

- [x] 1.1 Create `server/src/__tests__/meetings.get.test.ts` with the full test suite (property-based tests for page >= 1 and limit <= 100, default pagination test, and title filter test)

## 2. Implementation

- [x] 2.1 In `server/src/routes/meetingRoutes.ts`, add `listQuerySchema` to the import from `shared/schemas/meeting`
- [x] 2.2 In `server/src/routes/meetingRoutes.ts`, replace `router.get("/", listMeetings)` with `router.get("/", validate(listQuerySchema, "query"), listMeetings)`

## 3. Build Verification

- [x] 3.1 Run `cd server && npm run build` and confirm zero TypeScript errors
