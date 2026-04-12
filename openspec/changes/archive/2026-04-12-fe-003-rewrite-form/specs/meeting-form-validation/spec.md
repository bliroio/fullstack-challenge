## ADDED Requirements

### Requirement: Form renders with valid default values
The CreateMeetingForm component SHALL initialize with `title` empty, `startTime` set to the current time, and `endTime` set to one hour after `startTime`, such that the form is valid on mount and the Save button is enabled.

#### Scenario: Default state on open
- **WHEN** the CreateMeetingForm renders
- **THEN** the title input is empty, startTime is approximately now, endTime is approximately now + 1 hour, and the Save button is enabled

### Requirement: Title field shows inline validation error
The CreateMeetingForm SHALL display "Meeting title is required" inline beneath the title input when the title field is cleared after having content, without requiring a form submission attempt.

#### Scenario: Title cleared after typing
- **WHEN** the user types text into the title field and then clears it
- **THEN** the text "Meeting title is required" appears beneath the title field and the Save button becomes disabled

### Requirement: Save button reflects form validity
The Save button SHALL be disabled whenever the form is invalid (title empty, or endTime not after startTime) and enabled when all fields are valid.

#### Scenario: Submit button disabled when title empty
- **WHEN** the title field is cleared
- **THEN** the Save button is disabled

#### Scenario: Submit button enabled when form is valid
- **WHEN** the title has content and endTime is after startTime
- **THEN** the Save button is enabled

### Requirement: Valid submission calls onSubmit with Date objects
The form SHALL call the `onSubmit` prop exactly once with `{ title: string, startTime: Date, endTime: Date }` when the user submits a valid form.

#### Scenario: Successful submit
- **WHEN** the user fills in a valid title and clicks Save
- **THEN** `onSubmit` is called once with `title` as a string, `startTime` as a Date instance, and `endTime` as a Date instance

### Requirement: Double-submit prevention
The form SHALL prevent duplicate submissions by disabling the Save button while a submission is in progress, ensuring `onSubmit` is called at most once per user action regardless of click speed.

#### Scenario: Double-click on Save
- **WHEN** the user double-clicks the Save button while the first submission is still pending
- **THEN** `onSubmit` is called exactly once

### Requirement: Cancel resets form and calls onClose
Clicking the Cancel button SHALL reset all form fields to their default values and call the `onClose` prop.

#### Scenario: Cancel after typing in title
- **WHEN** the user types in the title field and then clicks Cancel
- **THEN** `onClose` is called once and the title field is empty

### Requirement: End time validation
The form SHALL display "End time must be after start time" beneath the endTime field when endTime is not after startTime, and SHALL prevent submission in that state.

#### Scenario: End time equal to or before start time
- **WHEN** the user sets endTime to the same value as or before startTime
- **THEN** "End time must be after start time" appears beneath the endTime field and the Save button is disabled
