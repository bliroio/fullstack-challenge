## MODIFIED Requirements

### Requirement: Meeting schema rejects endTime not after startTime
The meeting domain SHALL enforce that `endTime` is strictly greater than `startTime` at two layers: (1) the Zod `createMeetingSchema` in `shared/schemas/meeting.ts` rejects invalid API input with an error on the `endTime` path, and (2) the Mongoose meeting schema validator rejects documents at the database layer. Both validations use the same rule: `endTime` must be strictly greater than `startTime`.

#### Scenario: Valid meeting is saved successfully
- **WHEN** a meeting document is created with `endTime` strictly after `startTime`
- **THEN** Mongoose SHALL accept the document and persist it without a validation error

#### Scenario: Meeting with endTime equal to startTime is rejected
- **WHEN** a meeting document is created with `endTime` equal to `startTime`
- **THEN** Mongoose SHALL throw a `ValidationError` with message "endTime must be after startTime"

#### Scenario: Meeting with endTime before startTime is rejected
- **WHEN** a meeting document is created with `endTime` before `startTime`
- **THEN** Mongoose SHALL throw a `ValidationError` with message "endTime must be after startTime"

#### Scenario: API input with endTime not after startTime is rejected by Zod
- **WHEN** `createMeetingSchema.safeParse()` is called with `endTime` equal to or before `startTime`
- **THEN** the result SHALL be `{ success: false }` with an error on the `endTime` path with message "End time must be after start time"
