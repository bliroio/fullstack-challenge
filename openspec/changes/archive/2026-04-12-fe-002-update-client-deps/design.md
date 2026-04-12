## Context

ALL-006 established `shared/schemas/meeting.ts` as the single source of truth for the `Meeting` type across the stack. The project uses npm workspaces with `shared` as a workspace dependency. The client still has a local duplicate at `client/app/models/Meeting.ts` that must be removed. Additionally, the client needs `react-hook-form` and `@hookform/resolvers` for upcoming form work, and `zod` for runtime schema validation in service calls.

Current state:
- `client/app/models/Meeting.ts` exports `interface Meeting { id, title, startTime, endTime }`
- 7 files import `Meeting` from that relative path
- `client/package.json` has no `zod`, `react-hook-form`, or `@hookform/resolvers`
- `meetingService.ts` has a `as unknown as Meeting` cast that was a workaround for the type mismatch

## Goals / Non-Goals

**Goals:**
- Install `zod`, `react-hook-form`, `@hookform/resolvers` as client runtime dependencies
- Delete `client/app/models/Meeting.ts`
- Migrate all 7 consumer files to `import type { Meeting } from "shared/schemas/meeting"`
- Remove the redundant double cast in `meetingService.ts`
- Maintain zero TypeScript errors after migration

**Non-Goals:**
- Changing any runtime behavior or component logic
- Updating form components to use `react-hook-form` (deferred to later tasks)
- Modifying the shared schema shape

## Decisions

**Decision 1: Use workspace imports, not tsconfig paths**
The project uses npm workspaces with `"shared": "*"` already in client dependencies. Instead of a `@shared/*` tsconfig paths alias pointing at `../shared/*` (which bypasses the workspace's build output and couples the client to shared's source layout), we use proper workspace imports via subpath exports in `shared/package.json`. This respects the workspace contract: client depends on shared's published API (`dist/`), not its raw source files.

**Decision 2: Use `import type` not `import`**
`Meeting` is only used as a TypeScript type annotation in all 7 files — never as a value. Using `import type` makes this explicit, ensures the import is erased at compile time, and avoids accidental runtime coupling to the module's side effects.

**Decision 3: Same version of `zod` as server**
The server already uses `zod ^4.0.14`. Installing the same version range in the client ensures the shared schema module can be imported without version mismatch issues when compiled as a monorepo.

**Decision 4: Remove the `as unknown as Meeting` cast**
The cast was introduced because the local `Meeting` interface and `z.infer<typeof meetingSchema>` had subtly different structural types. Now that `Meeting` IS `z.infer<typeof meetingSchema>`, `meetingSchema.parse()` already returns `Meeting` — the cast is both wrong and unnecessary.

## Risks / Trade-offs

- [Risk] Subpath exports not resolved by Next.js → Mitigation: Next.js with `moduleResolution: "bundler"` natively resolves package `exports` fields. No `next.config.js` changes needed.
- [Risk] Deleted file leaves a dangling import somewhere not listed → Mitigation: Verification step runs `grep -r "models/Meeting"` to confirm zero remaining references before calling the task done.
- [Risk] `tsc --noEmit` reveals type errors after switching to shared type → Mitigation: The shared `Meeting` type (`z.infer<typeof meetingSchema>`) is structurally identical to the old interface. No consuming code changes are needed beyond the import statement.
