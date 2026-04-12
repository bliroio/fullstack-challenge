## MODIFIED Requirements

### Requirement: Loading spinner shown while fetching
The meetings list SHALL display a centered orange `CircularProgress` spinner while the API request is in flight. The spinner SHALL appear immediately on initial page mount before the first response is received, and also during page navigation fetches.

#### Scenario: Spinner visible during fetch
- **WHEN** the page renders and the API request has not yet resolved
- **THEN** a `progressbar` role element is present in the DOM

#### Scenario: Spinner disappears after fetch completes
- **WHEN** the API request resolves successfully
- **THEN** the `progressbar` role element is no longer present in the DOM

#### Scenario: Spinner visible during page change fetch
- **WHEN** the user selects a different page and the fetch has not yet resolved
- **THEN** a `progressbar` role element is present in the DOM
