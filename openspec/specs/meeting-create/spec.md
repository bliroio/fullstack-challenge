## ADDED Requirements

### Requirement: POST /api/meetings creates a meeting with valid input
The system SHALL accept a POST request to `/api/meetings` with a JSON body containing `title`, `startTime`, and `endTime`. When the input passes Zod validation, the system SHALL persist the document in MongoDB and return HTTP 201 with the created meeting document including `id`, `title`, `startTime`, and `endTime`.

#### Scenario: Valid meeting is created and returned
- **WHEN** a POST request is sent to `/api/meetings` with a valid `title`, `startTime`, and `endTime` where `endTime` is after `startTime`
- **THEN** the system returns HTTP 201 with a JSON body containing `id`, `title`, `startTime`, and `endTime`

#### Scenario: Created meeting is persisted in MongoDB
- **WHEN** a POST request creates a meeting successfully
- **THEN** the meeting document is retrievable via `GET /api/meetings`

### Requirement: POST /api/meetings rejects invalid input with HTTP 400
The system SHALL validate the request body against `createMeetingSchema` using the `validate` middleware. If validation fails, the system SHALL return HTTP 400 with a JSON body containing `message: "Validation failed"` and a `errors` object mapping field names to arrays of error messages.

#### Scenario: Missing title returns 400
- **WHEN** a POST request is sent without a `title` field
- **THEN** the system returns HTTP 400 with `errors.title` containing an error message

#### Scenario: endTime before startTime returns 400
- **WHEN** a POST request is sent where `endTime` is earlier than or equal to `startTime`
- **THEN** the system returns HTTP 400 with `errors.endTime` containing `"End time must be after start time"`

#### Scenario: Invalid datetime format returns 400
- **WHEN** a POST request is sent with a `startTime` value that is not a valid ISO 8601 datetime string
- **THEN** the system returns HTTP 400 with a validation error

### Requirement: POST /api/meetings validation uses the shared createMeetingSchema
The system SHALL use `createMeetingSchema` from `shared/schemas/meeting` as the Zod schema passed to the `validate` middleware for the POST route. This ensures the same schema governs both client-side and server-side validation.

#### Scenario: Schema is wired to the POST route via validate middleware
- **WHEN** the POST route is defined in `meetingRoutes.ts`
- **THEN** `validate(createMeetingSchema)` is the first handler before the controller

### Requirement: POST /api/meetings OpenAPI documentation is present
The system SHALL include a `@openapi` JSDoc block on the POST route that documents the request body schema, the 201 response, and the 400 response.

#### Scenario: Swagger UI shows POST endpoint
- **WHEN** the Swagger UI is accessed at `/api-docs`
- **THEN** the POST `/api/meetings` endpoint is listed under the Meetings tag with request body and response schemas

### Requirement: Create drawer supports optional edit mode props without breaking create flow
The create drawer (`CreateMeetingDrawer`) SHALL accept an optional `meetingToEdit` prop. When `meetingToEdit` is absent or `undefined`, the drawer SHALL behave identically to the previous create-only behavior: the header SHALL display "Create a new meeting", the form fields SHALL be empty with default values, and submitting SHALL call the create path. Existing create behavior SHALL NOT be affected by this extension.

#### Scenario: Drawer without meetingToEdit behaves as before
- **WHEN** the drawer is opened without a `meetingToEdit` prop
- **THEN** the header SHALL display "Create a new meeting"
- **THEN** the form title field SHALL be empty
- **THEN** submitting the form SHALL create a new meeting

#### Scenario: Closing drawer in create mode does not affect selected meeting state
- **WHEN** the user opens the drawer via "Create Meeting" button and then closes it
- **THEN** no meeting SHALL remain selected and the next open SHALL still be in create mode
