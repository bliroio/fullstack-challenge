## Context

The meeting management app has a working create/delete flow. The server uses Express + Mongoose with a layered architecture: routes → middleware → controllers → services. The client is Next.js 15 + React 18 + MUI with a drawer-based form for meeting creation. All previous BE, FE, and XTR-001 tasks are complete. The shared `Meeting` type and Zod schemas live in a workspace package (`shared/`) and are used on both server and client.

The create drawer (`CreateMeetingDrawer` → `CreateMeetingHeader` + `CreateMeetingForm`) is fully functional and uses react-hook-form. The goal is to reuse this drawer in edit mode rather than building a separate edit flow.

## Goals / Non-Goals

**Goals:**
- Add `PUT /api/meetings/:id` with proper validation (ID format, Mongoose validators, 404 handling)
- Reuse the existing drawer/form for edit mode with zero duplication of form logic
- Prefill form fields from the selected meeting using react-hook-form `reset()`
- Show contextual header text ("Edit meeting" vs "Create a new meeting")
- Wiring entirely through props — no global state, no context, no new libraries

**Non-Goals:**
- Partial updates (PATCH) — PUT with full body keeps it consistent with the create schema
- Optimistic UI updates — refresh via `fetchMeetings()` after save is sufficient
- Inline editing on the card itself
- Validation schema changes — existing `createMeetingSchema` already validates title + time range

## Decisions

### Decision: Reuse the create drawer rather than a separate edit drawer

The create drawer already handles the full form lifecycle (validation, submission, error display, reset on close). Adding optional `meeting` and `isEditing` props threads edit mode through the existing component tree without duplicating any UI or logic. The alternative — a separate `EditMeetingDrawer` — would duplicate ~200 lines of JSX and keep two form implementations in sync.

### Decision: Use react-hook-form `reset()` in a `useEffect` for prefill

When the `meeting` prop changes (a new meeting is selected for editing), `reset()` is called with its values. This is the idiomatic RHF pattern for externally-driven form population. The alternative (using `defaultValues` only) would not respond to changes when different meetings are selected sequentially.

### Decision: `findById` + `save()` instead of `findByIdAndUpdate`

Mongoose does not run schema validators on update operations by default — only `save()` validates automatically. The original plan was to use `findByIdAndUpdate` with `{ runValidators: true }`, but the `endTime > startTime` custom validator uses `this.startTime`, and with `findByIdAndUpdate` `this` refers to the query object — not the document — so `this.startTime` is `undefined` when only partial fields are updated. Using `findById` + `Object.assign` + `save()` ensures validators always run against the full document with correct `this` context.

### Decision: Unified `onSubmitMeeting` handler in `page.tsx`

Rather than passing separate `onCreateMeeting` and `onEditMeeting` callbacks to `Header`, a single `onSubmitMeeting` dispatches to create or update based on `selectedMeeting` state. This keeps the drawer interface stable — it always calls its `onCreateMeeting` prop — while the parent decides what to do with the data.

### Decision: `meetingToEdit` is passed to `Header`, which owns drawer open state

`Header` already owns `drawerOpen` state and the `CreateMeetingDrawer`. Adding a `useEffect` in `Header` that opens the drawer when `meetingToEdit` changes avoids lifting drawer state to `page.tsx`. The `onDrawerClose` callback notifies `page.tsx` to clear `selectedMeeting` when the drawer closes.

## Risks / Trade-offs

- **`runValidators` + Mongoose quirks** → Some validators behave differently in update context (e.g., `this` refers to the query, not the document). The `endTime > startTime` validator uses field references compatible with both contexts. Mitigation: test via curl after implementation.
- **`reset()` on every `meeting` prop change** → If parent re-renders cause the `meeting` object reference to change identity (even with same values), the effect fires repeatedly. Mitigation: the effect only calls `reset()` when `meeting` is truthy, so it is harmless in practice since RHF ignores resets to the current values.
- **No optimistic update** → There is a visible re-fetch after save. Acceptable for this scope; the list refreshes within one round-trip.

## Migration Plan

No database migrations needed. The PUT endpoint is additive. No breaking changes to existing endpoints or client behavior. Deploy server first (new route is inert until client ships), then client.
