## MODIFIED Requirements

### Requirement: MeetingList accepts loading and error props
The `MeetingList` component SHALL accept `loading: boolean` and `error: string | null` as required props in addition to `meetings: Meeting[]`. All call sites SHALL pass these props.

#### Scenario: MeetingList renders spinner when loading is true
- **WHEN** `<MeetingList meetings={[]} loading={true} error={null} />` is rendered
- **THEN** a `progressbar` role element is present and no meeting cards are rendered

#### Scenario: MeetingList renders error alert when error is set
- **WHEN** `<MeetingList meetings={[]} loading={false} error="Failed to load meetings. Please try again." />` is rendered
- **THEN** the error text is visible and no meeting cards are rendered

#### Scenario: MeetingList renders empty state when meetings is empty and not loading
- **WHEN** `<MeetingList meetings={[]} loading={false} error={null} />` is rendered
- **THEN** "No meetings found" text is visible

### Requirement: Home page manages loading and error state
The `Home` component SHALL maintain `loading: boolean` (initialized to `true`) and `error: string | null` (initialized to `null`) state variables. `fetchMeetings` SHALL be async and SHALL set loading/error state correctly across the request lifecycle.

#### Scenario: loading initialized to true
- **WHEN** Home mounts before fetchMeetings resolves
- **THEN** the loading state is true and the spinner is visible

#### Scenario: loading set to false after fetch completes
- **WHEN** fetchMeetings resolves or rejects
- **THEN** the loading state is false

#### Scenario: error set on fetch failure
- **WHEN** listMeetings rejects
- **THEN** the error state is set to "Failed to load meetings. Please try again."

#### Scenario: page.tsx passes loading and error to MeetingList
- **WHEN** page.tsx renders MeetingList
- **THEN** it passes the current loading and error state values as props
