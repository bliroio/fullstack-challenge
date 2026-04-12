## Purpose

Defines the requirements for loading, error, and empty states in the meetings list UI, ensuring users receive visual feedback during data fetching, on failures, and when no meetings exist.

## Requirements

### Requirement: Loading spinner shown while fetching
The meetings list SHALL display a centered orange `CircularProgress` spinner while the API request is in flight. The spinner SHALL appear immediately on initial page mount before the first response is received.

#### Scenario: Spinner visible during fetch
- **WHEN** the page renders and the API request has not yet resolved
- **THEN** a `progressbar` role element is present in the DOM

#### Scenario: Spinner disappears after fetch completes
- **WHEN** the API request resolves successfully
- **THEN** the `progressbar` role element is no longer present in the DOM

### Requirement: Error alert shown when API fails
The meetings list SHALL display a MUI `Alert` with severity "error" and the text "Failed to load meetings. Please try again." when `listMeetings` rejects.

#### Scenario: Error text visible after API failure
- **WHEN** the API request fails (network error or non-2xx response)
- **THEN** the text "Failed to load meetings. Please try again." is visible in the DOM

#### Scenario: Meeting cards not shown during error state
- **WHEN** the API request fails
- **THEN** no meeting card elements are rendered

### Requirement: Empty state shown when no meetings returned
The meetings list SHALL display centered text "No meetings found" when the API returns an empty `docs` array.

#### Scenario: Empty state text visible for empty response
- **WHEN** the API returns a paginated response with `docs: []`
- **THEN** the text "No meetings found" is visible in the DOM

#### Scenario: Meeting cards not shown during empty state
- **WHEN** the API returns an empty docs array
- **THEN** no meeting card elements are rendered

### Requirement: Meeting cards shown when meetings returned
The meetings list SHALL render one card per meeting in the API response when `docs` is non-empty.

#### Scenario: Meeting titles displayed
- **WHEN** the API returns a paginated response with one or more meetings
- **THEN** each meeting's title is visible in the DOM
