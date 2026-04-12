## Why

The meeting model currently exposes raw MongoDB internals (`_id` as ObjectId, `__v` version key) in every JSON response, and Mongoose's built-in injection-prevention settings (`sanitizeFilter`, `strictQuery`) are not enabled. The schema also has no model-level guard against invalid date ranges (`endTime <= startTime`), leaving a defense-in-depth gap for code paths that bypass the API middleware.

## What Changes

- **`server/src/models/meeting.ts`**: Replace `IMeeting` interface (removed) with `MeetingDoc` type via `InferSchemaType`. Add `toJSON` transform to the schema (virtuals: true, versionKey: false, delete `_id`). Add `validate` on `endTime` enforcing `endTime > startTime`.
- **`server/src/db.ts`**: After `mongoose.connect()`, set `mongoose.set("sanitizeFilter", true)` and `mongoose.set("strictQuery", true)`.
- **`server/src/services/meetingService.ts`**: Fix compile error caused by removal of `IMeeting` — update import and return type annotation.

## Capabilities

### New Capabilities

- `mongoose-json-shape`: JSON responses from meeting endpoints always include `id` (string) and omit `_id` and `__v`.
- `mongoose-security-settings`: Global Mongoose settings harden query handling against NoSQL injection and unknown filter fields.
- `meeting-schema-validation`: Mongoose-level `endTime > startTime` validator on the meeting schema.

### Modified Capabilities

<!-- No existing spec requirements are changing — this is additive hardening. -->

## Impact

- **`server/src/models/meeting.ts`**: Complete rewrite (model file only, no API surface change).
- **`server/src/services/meetingService.ts`**: Import and return type annotation updated — no runtime behavior change.
- **`server/src/db.ts`**: Two `mongoose.set()` calls added post-connect — no API surface change.
- **All existing API routes**: JSON shape changes (removes `_id`, `__v`; adds `id`). This is a breaking change for any client comparing on `_id`.
- **No new dependencies**.
