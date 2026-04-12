## ADDED Requirements

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
