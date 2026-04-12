## ADDED Requirements

### Requirement: Delete meeting by ID
The server SHALL expose a `DELETE /api/meetings/:id` endpoint that removes a meeting from the database.

#### Scenario: Successful deletion
- **WHEN** a `DELETE /api/meetings/:id` request is made with a valid ObjectId that exists in the database
- **THEN** the server returns HTTP 204 with no response body and the meeting is permanently removed

#### Scenario: Meeting not found
- **WHEN** a `DELETE /api/meetings/:id` request is made with a valid ObjectId format that does not match any existing meeting
- **THEN** the server returns HTTP 404 with `{ "message": "Meeting not found" }`

#### Scenario: Invalid ID format
- **WHEN** a `DELETE /api/meetings/:id` request is made with a string that is not a valid MongoDB ObjectId (e.g., `not-an-id`)
- **THEN** the server returns HTTP 400

### Requirement: ID validation before database query
The service SHALL validate the meeting ID format using `mongoose.Types.ObjectId.isValid()` before issuing any database query.

#### Scenario: Invalid ID rejected before Mongoose
- **WHEN** `deleteMeeting` is called with an invalid ID string
- **THEN** an `AppError` with status 400 is thrown without any Mongoose query being executed

### Requirement: Delete button on meeting cards
The client UI SHALL render a delete icon button on each meeting card when an `onDelete` handler is provided.

#### Scenario: Delete button renders
- **WHEN** `MeetingList` is rendered with meetings and an `onDelete` prop
- **THEN** each meeting card displays a `DeleteOutlineIcon` icon button

#### Scenario: Delete button absent without handler
- **WHEN** `MeetingList` is rendered without an `onDelete` prop
- **THEN** no delete button is rendered on any card

#### Scenario: Delete triggers list refresh
- **WHEN** user clicks the delete button on a meeting card
- **THEN** the `onDelete` callback is called with that meeting's `id`, the server deletes the meeting, and the meeting list refreshes to reflect the deletion
