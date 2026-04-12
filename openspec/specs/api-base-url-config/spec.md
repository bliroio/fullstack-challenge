## ADDED Requirements

### Requirement: Client API base URL is configurable via environment variable
The client meeting service SHALL read `NEXT_PUBLIC_API_URL` from the environment and use it as the base URL for all HTTP requests. When the variable is not set, the service SHALL fall back to `http://localhost:3000/api`.

#### Scenario: Environment variable is set
- **WHEN** `NEXT_PUBLIC_API_URL` is set to a valid base URL (e.g. `http://api.example.com/api`)
- **THEN** all HTTP requests from the meeting service SHALL be sent to that base URL with the appropriate resource path appended

#### Scenario: Environment variable is not set
- **WHEN** `NEXT_PUBLIC_API_URL` is not defined in the environment
- **THEN** all HTTP requests from the meeting service SHALL be sent to `http://localhost:3000/api` with the appropriate resource path appended

### Requirement: Resource path is appended per call site
Each exported function in the meeting service SHALL append the `/meetings` resource path (and optional `/<id>` suffix) to `API_BASE_URL` when constructing request URLs. `API_BASE_URL` SHALL NOT include any resource path component.

#### Scenario: List meetings request URL
- **WHEN** `listMeetings` is called
- **THEN** the HTTP GET request SHALL be sent to `${API_BASE_URL}/meetings` with any query parameters appended

#### Scenario: Create meeting request URL
- **WHEN** `createMeeting` is called
- **THEN** the HTTP POST request SHALL be sent to `${API_BASE_URL}/meetings`

#### Scenario: Delete meeting request URL
- **WHEN** `deleteMeeting` is called with an id
- **THEN** the HTTP DELETE request SHALL be sent to `${API_BASE_URL}/meetings/${id}`

#### Scenario: Update meeting request URL
- **WHEN** `updateMeeting` is called with an id
- **THEN** the HTTP PUT request SHALL be sent to `${API_BASE_URL}/meetings/${id}`
