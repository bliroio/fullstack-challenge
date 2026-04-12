## 1. Update Meeting Model

- [x] 1.1 Remove `import { Document }` from the mongoose import in `server/src/models/meeting.ts`
- [x] 1.2 Remove the `IMeeting` interface export from `server/src/models/meeting.ts`
- [x] 1.3 Add `toJSON` options to `new mongoose.Schema(...)` with `virtuals: true`, `versionKey: false`, and a transform that deletes `ret._id`
- [x] 1.4 Add `validate` on the `endTime` field that rejects `value <= this.startTime` with message "endTime must be after startTime"
- [x] 1.5 Add `MeetingDoc` type alias using `mongoose.InferSchemaType<typeof meetingSchema> & mongoose.Document`
- [x] 1.6 Update `mongoose.model<>()` generic parameters to use `MeetingDoc` instead of `IMeeting`

## 2. Harden Mongoose Security Settings

- [x] 2.1 In `server/src/db.ts`, add `mongoose.set("sanitizeFilter", true)` after `await mongoose.connect(dbUri)`
- [x] 2.2 In `server/src/db.ts`, add `mongoose.set("strictQuery", true)` after the sanitizeFilter line

## 3. Fix Compile Error in meetingService

- [x] 3.1 In `server/src/services/meetingService.ts`, change `import { IMeeting, Meeting }` to `import { Meeting }`
- [x] 3.2 In `server/src/services/meetingService.ts`, change the `listMeetings` return type from `mongoose.PaginateResult<IMeeting>` to `mongoose.PaginateResult<InstanceType<typeof Meeting>>`

## 4. Verify Build

- [x] 4.1 Run `cd server && npm run build` and confirm zero TypeScript errors
