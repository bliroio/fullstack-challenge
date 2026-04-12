## Context

The Express/Mongoose server returns meeting documents directly from `Model.paginate()`. Currently each serialized document includes `_id` (raw ObjectId) and `__v` (Mongoose version key), which are MongoDB internals that should not leak to clients. Additionally, Mongoose's `sanitizeFilter` and `strictQuery` global settings are off by default in Mongoose 8, leaving NoSQL query injection vectors open. The `IMeeting` interface manually duplicates the schema shape and will be replaced by `InferSchemaType` for type safety without duplication.

## Goals / Non-Goals

**Goals:**
- JSON responses always present `id` (string) and never `_id` or `__v`.
- `sanitizeFilter` and `strictQuery` are enabled globally immediately after `mongoose.connect()`.
- The meeting schema rejects documents where `endTime <= startTime` at the Mongoose validation layer.
- The TypeScript build passes with zero errors after removing `IMeeting`.

**Non-Goals:**
- Changing the API contract beyond the `id`/`_id`/`__v` shape fix.
- Replacing `meetingService.ts` logic (deferred to BE-003).
- Adding a Zod shared schema (deferred to ALL-006).
- Changing pagination behavior or query logic.

## Decisions

**D1: toJSON transform on the schema, not a DTO layer.**
A `toJSON` options object on `new mongoose.Schema(...)` is the idiomatic Mongoose approach for uniform serialization. It runs automatically on `.toJSON()` / `JSON.stringify()`, which Express calls via `res.json()`. The alternative — explicit DTO functions — adds indirection for a single model with a uniform response shape. DTO functions are appropriate when different endpoints need different views of the same document; that is not the case here.

**D2: `versionKey: false` in toJSON options, not `schema.set("versionKey", false)`.**
Setting `versionKey: false` in `toJSON` options suppresses `__v` only in serialized output. Setting it at the schema level would disable version key storage entirely, which could affect document update concurrency checks. Suppressing at the serialization level is the safer, narrower change.

**D3: `mongoose.set()` calls placed after `mongoose.connect()`, inside `connectDB`.**
Placing them after `connect()` ensures they take effect on the live connection. Placing them before connect would also work for these particular settings (they are global, not connection-specific), but after-connect placement documents intent clearly: "these harden the active connection."

**D4: `InferSchemaType` + `& mongoose.Document` for the `MeetingDoc` type.**
`InferSchemaType<typeof meetingSchema>` infers field types directly from the schema definition. Adding `& mongoose.Document` gives access to Mongoose instance methods (`save`, `toJSON`, etc.). This is the documented Mongoose 8 pattern for typed models without a separate interface.

**D5: Minimal fix to `meetingService.ts` — change import and return type only.**
The service file has deeper issues (raw `any` query, unescaped RegExp, mixed concerns) that are addressed in BE-003. Touching only the compile-error-causing import and return type keeps this change focused and minimizes diff noise.

## Risks / Trade-offs

- **[Risk] JSON shape is a breaking change for existing clients reading `_id`.** The Next.js client currently uses `_id` as the React `key` prop and for delete requests. This change must be coordinated with the frontend. Mitigation: the frontend changes are in scope for a later task (FE series) that will switch to `id`.
- **[Risk] `sanitizeFilter` wraps `$` operators in filter values.** If any existing query intentionally passes `$regex` or `$in` inside a filter value (not a top-level operator), it will be neutralized. Review of `meetingService.ts` confirms this is not currently the case — `$regex` is set as a top-level operator key, which is unaffected.
- **[Trade-off] Duplicated schema shape between Mongoose and Zod.** Intentional: there is no reliable auto-generation path. The duplication is 3 fields and is documented in PLANS/ALL-005_CONFIGURE_MONGOOSE.md.

## Migration Plan

1. Apply file changes (meeting.ts, db.ts, meetingService.ts).
2. Run `npm run build` in `server/` — zero errors expected.
3. Restart the server and confirm JSON shape via `curl /api/meetings`.
4. No database migration required — no schema storage changes.
5. Rollback: revert the three files; no data is affected.

## Open Questions

None. All decisions are resolved by the plan.
