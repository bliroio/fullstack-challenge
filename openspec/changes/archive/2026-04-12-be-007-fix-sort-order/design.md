## Context

The `listMeetings` function in `server/src/services/meetingService.ts` passes a `sort` option to `mongoose-paginate-v2`. It currently uses `{ startTime: -1 }` (descending), placing the most recently created or future-dated meetings last and historical meetings first. Users expect to see upcoming meetings at the top.

## Goals / Non-Goals

**Goals:**
- Meetings returned by `GET /api/meetings` are ordered ascending by `startTime` so the nearest upcoming meeting is first.

**Non-Goals:**
- No client-side sorting changes.
- No pagination or filtering logic changes.
- No changes to the meeting schema, API contract, or response shape.

## Decisions

**Change `sort: { startTime: -1 }` to `sort: { startTime: 1 }`**

This is the only change required. The `mongoose-paginate-v2` library accepts a standard Mongoose sort object; `1` = ascending, `-1` = descending. No other options, indexes, or call sites are affected.

Alternatives considered:
- Client-side sort: rejected — sorting should happen at the database layer to ensure consistent ordering across all consumers and pagination boundaries.

## Risks / Trade-offs

- [Risk] Existing callers or tests that assert a specific (descending) order will break. → Mitigation: update any such tests to expect ascending order.

## Migration Plan

1. Apply the one-character change in `meetingService.ts`.
2. Restart the server (or let hot-reload pick it up).
3. Verify the meetings list shows the earliest `startTime` first.
4. Rollback: revert the single-character change if needed.
