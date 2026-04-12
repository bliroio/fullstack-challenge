## 1. Test File (TDD Red)

- [x] 1.1 Create `server/src/__tests__/meetings.post.test.ts` with supertest + fast-check integration tests for POST /api/meetings (property-based valid input, missing title 400, endTime before startTime 400, invalid datetime 400)

## 2. Service Layer

- [x] 2.1 Add `import { CreateMeetingInput } from "shared/schemas/meeting"` to `server/src/services/meetingService.ts`
- [x] 2.2 Add `createMeeting(data: CreateMeetingInput)` function to `server/src/services/meetingService.ts` that calls `Meeting.create(data)` and returns the persisted document

## 3. Controller Layer

- [x] 3.1 Add `createMeeting` controller to `server/src/controllers/meetingController.ts` using `asyncHandler`, calls `meetingService.createMeeting(req.body)`, responds with HTTP 201 and the created document

## 4. Route Layer

- [x] 4.1 Update imports in `server/src/routes/meetingRoutes.ts` to include `createMeeting` from the controller, `validate` from the middleware, and `createMeetingSchema` from `shared/schemas/meeting`
- [x] 4.2 Add `router.post("/", validate(createMeetingSchema), createMeeting)` with full `@openapi` JSDoc block to `server/src/routes/meetingRoutes.ts`

## 5. Verification

- [x] 5.1 Run `cd server && npm run build` and confirm zero TypeScript errors
- [x] 5.2 Run `npx vitest run server/src/__tests__/meetings.post.test.ts` and confirm all tests pass (green)
