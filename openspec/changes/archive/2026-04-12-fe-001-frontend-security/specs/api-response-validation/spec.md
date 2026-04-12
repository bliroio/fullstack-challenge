## ADDED Requirements

### Requirement: Meeting list responses are validated with Zod
The `listMeetings` service function SHALL validate each meeting object in the API response using `meetingSchema.parse()` from the shared schemas before returning the data.

#### Scenario: Valid API response passes validation
- **WHEN** the API returns a list of meetings with correct shape (id, title, startTime, endTime)
- **THEN** the service SHALL return the parsed meetings array without error

#### Scenario: Malformed API response triggers validation error
- **WHEN** the API returns meeting data that does not conform to `meetingSchema` (e.g., missing `id` field)
- **THEN** the service SHALL throw a ZodError with diagnostics about the invalid fields

### Requirement: Meeting creation responses are validated with Zod
The `createMeeting` service function SHALL validate the API response using `meetingSchema.parse()` from the shared schemas before returning the data.

#### Scenario: Valid creation response passes validation
- **WHEN** the API returns a created meeting with correct shape
- **THEN** the service SHALL return the parsed meeting object without error

#### Scenario: Malformed creation response triggers validation error
- **WHEN** the API returns a created meeting that does not conform to `meetingSchema`
- **THEN** the service SHALL throw a ZodError with diagnostics about the invalid fields
