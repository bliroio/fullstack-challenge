# YouWork - Meeting Room Management

## Overview

Web application for YouWork tenants to browse meeting rooms and book available time slots. Calendly-style booking flow with privacy-first design — users only see available slots, never other people's bookings.

## Setup

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)

### Server
```bash
cd server
cp .env.example .env  # Set your MONGODB_URI
npm install
npm run dev           # Runs on port 3000
```

### Client
```bash
cd client
npm install
npm run dev           # Runs on port 3001
```

## User Flow

1. **Landing page** — Browse meeting rooms as cards with photos, name, location, and capacity
2. **Room page** — See the room image and details. Navigate months and weeks with calendar controls, choose a duration
3. **Available slots** — Only bookable time slots are shown (15-min intervals, 8AM-8PM). Booked slots are hidden — no information about other bookings is leaked
4. **Click a slot** — View transitions to confirmation step with time summary
5. **Enter details** — Meeting title, name, email (validated against allowlist if configured)
6. **Book** — Confirmation screen with "Add to calendar" (ICS download) and "Book another" options. Availability refreshes automatically after booking.

## What I Found (Gap Analysis)

Upon exploring the codebase, I identified the following issues and categorized them using MoSCoW prioritization:

### Must Have (Implemented)
| Issue | Category | Resolution |
|-------|----------|------------|
| Create meeting UI was removed | Feature | Built Calendly-style two-step booking flow |
| No meeting room concept | Data Model | Added `MeetingRoom` model — meetings now belong to rooms |
| No booker identity | Data Model | Added `bookedBy` (name, email) to meetings |
| Flat meeting list UX | UX | Rooms-first navigation: browse rooms → select room → book slot |
| No availability view | UX | Day-based availability grid with duration-aware slot computation |
| No calendar navigation | UX | Month slider and week strip for browsing dates |
| Room images missing | UX | Room photos on landing page cards and room detail page |
| No calendar export | Feature | ICS file download after booking (works with Apple Calendar, Google Calendar, Outlook) |
| Privacy: meeting details exposed | Security | Public API strips `bookedBy` and `title`. Availability endpoint returns only time ranges |
| NoSQL injection in title filter | Security | Escaped regex special characters in search input |
| Hardcoded `localhost:3000` API URL | Config | Moved to `NEXT_PUBLIC_API_URL` env variable |
| No loading/error/empty states | UX | Added throughout the application |
| Validation errors not surfaced | UX | Backend returns field-level Zod errors; frontend displays them |
| No room booking conflict detection | Business Logic | Backend rejects double-bookings with per-room mutex to prevent race conditions |
| No time interval enforcement | Business Logic | All bookings snap to 15-minute intervals, validated server-side |
| No email restrictions | Security | Email allowlist via `EMAIL_ALLOWLIST` env var — supports wildcard domains and exact matches |

### Should Have (Documented, not implemented due to time)
| Issue | Category | Notes |
|-------|----------|-------|
| CORS wide open | Security | `cors()` allows any origin — should restrict to known frontend domain |
| Authentication | Security | No user accounts — booking relies on self-reported name/email |

### Architectural Concerns (Won't fix for this release)
| Issue | Notes |
|-------|-------|
| **Separate Express server alongside Next.js** | Next.js has built-in API routes (`app/api/`). Consolidating would eliminate CORS configuration, simplify deployment, and allow shared TypeScript types. Deferred due to risk and time constraints. |
| **MongoDB for relational data** | Meetings, rooms, and (future) users are inherently relational. PostgreSQL would provide referential integrity, better transaction support, and native conflict queries. MongoDB works here but adds unnecessary application-level enforcement. |
| **Database resets on startup** | Intentional for demo/evaluation purposes — seeds 6 rooms and 50 meetings. Would be removed for production. |

## Data Model

### MeetingRoom
```
{ name, location, capacity, imageUrl }
```

### Meeting
```
{ title, startTime, endTime, roomId → MeetingRoom, bookedBy: { name, email } }
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/rooms` | List all meeting rooms |
| `GET` | `/api/rooms/:id` | Get a single room |
| `GET` | `/api/rooms/:id/availability?date=YYYY-MM-DD` | Get booked time ranges for a room on a date (no meeting details) |
| `GET` | `/api/meetings?page=1&limit=10&roomId=xxx` | Paginated meeting list (anonymized — no titles or booker info) |
| `POST` | `/api/meetings` | Book a meeting (with conflict detection + 15-min interval validation) |
| `GET` | `/api-docs` | Swagger documentation |

## Email Allowlist

Restricts which email addresses can book meetings. Configured via the `EMAIL_ALLOWLIST` environment variable.

**When the variable is empty or unset (default), all emails are accepted.** Once configured, only matching emails are allowed.

```bash
EMAIL_ALLOWLIST=*@youwork.com,*@partner.org,guest@external.com
```

| Pattern | Matches |
|---------|---------|
| `*@company.com` | Any email at `company.com` (wildcard domain) |
| `alice@partner.org` | Only that exact address |

Matching is case-insensitive.

## Decisions Made

- **Calendly-style UX** — rooms-first browsing, day-based availability, two-step booking flow. Users see what's available, not what's booked.
- **Privacy by design** — the availability endpoint returns booked time ranges only, never meeting titles, names, or emails. The public meetings API strips all PII.
- **Duration-driven availability** — changing the duration dynamically recalculates which slots can fit, accounting for existing bookings.
- **15-minute intervals** — all bookings snap to :00, :15, :30, :45. Enforced both client-side and server-side.
- **Race condition safety** — per-room mutex serializes conflict check + creation so concurrent requests can't double-book.
- **Kept the existing architecture** (separate client/server) rather than risk a migration under time pressure.
- **Added meeting rooms as a first-class entity** because the challenge is about meeting room management — not having rooms in the model was a domain gap.
