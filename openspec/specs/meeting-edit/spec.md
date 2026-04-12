## ADDED Requirements

### Requirement: PUT endpoint updates an existing meeting
The server SHALL expose a `PUT /api/meetings/:id` endpoint that accepts a full meeting body (`title`, `startTime`, `endTime`) and updates the matching document. The endpoint SHALL run Mongoose schema validators on the update (including the `endTime > startTime` invariant). On success the updated meeting document SHALL be returned as JSON. On invalid ObjectId format the server SHALL return 400. On no matching document the server SHALL return 404.

#### Scenario: Successful update
- **WHEN** a PUT request is sent to `/api/meetings/:id` with a valid ID and valid body
- **THEN** the server SHALL return 200 with the updated meeting document

#### Scenario: Invalid ObjectId
- **WHEN** a PUT request is sent with a non-ObjectId string as `:id`
- **THEN** the server SHALL return 400 with an error message

#### Scenario: Meeting not found
- **WHEN** a PUT request is sent with a valid ObjectId that does not match any document
- **THEN** the server SHALL return 404 with an error message

#### Scenario: Validation failure on update
- **WHEN** a PUT request is sent with `endTime` equal to or before `startTime`
- **THEN** the server SHALL return 400 with a validation error (Mongoose validators run on update)

### Requirement: Edit button on meeting card
Each meeting card in the list SHALL display an edit (pencil) icon button. Clicking it SHALL open the create/edit drawer in edit mode prefilled with that meeting's current data.

#### Scenario: Edit button visible on each card
- **WHEN** the meeting list is rendered with `onEdit` prop provided
- **THEN** each card SHALL display an edit icon button

#### Scenario: Clicking edit opens the drawer
- **WHEN** the user clicks the edit button on a meeting card
- **THEN** the drawer SHALL open with the form prefilled with that meeting's title, startTime, and endTime

### Requirement: Edit mode drawer prefills form and shows contextual header
When the drawer is opened in edit mode the form fields SHALL be prefilled with the selected meeting's current values. The drawer header SHALL display "Edit meeting" as the title and "Update the meeting details below." as the description.

#### Scenario: Form is prefilled in edit mode
- **WHEN** the drawer opens with a `meetingToEdit` prop
- **THEN** the title field SHALL contain the meeting's current title
- **THEN** the startTime field SHALL contain the meeting's current start time
- **THEN** the endTime field SHALL contain the meeting's current end time

#### Scenario: Header shows edit title
- **WHEN** the drawer is opened in edit mode
- **THEN** the header SHALL display "Edit meeting"

#### Scenario: Header shows create title in create mode
- **WHEN** the drawer is opened without a meeting to edit
- **THEN** the header SHALL display "Create a new meeting"

### Requirement: Saving in edit mode updates the meeting
Submitting the form in edit mode SHALL call the PUT endpoint for the selected meeting. On success the meeting list SHALL be refreshed to reflect the updated values.

#### Scenario: Save updates the meeting
- **WHEN** the user edits a meeting and clicks Save
- **THEN** the client SHALL call PUT /api/meetings/:id with the new values
- **THEN** the meeting list SHALL refresh and show the updated meeting data
