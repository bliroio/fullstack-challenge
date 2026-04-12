## ADDED Requirements

### Requirement: Meeting list is sorted chronologically ascending
The `listMeetings` service function SHALL sort meetings by `startTime` in ascending order (`1`) so that the meeting with the earliest `startTime` appears first in the result set.

#### Scenario: Earliest meeting appears first
- **WHEN** multiple meetings exist with different `startTime` values
- **THEN** the meeting with the smallest (earliest) `startTime` is returned first in the paginated result

#### Scenario: Most future meeting appears last
- **WHEN** multiple meetings exist with different `startTime` values
- **THEN** the meeting with the largest (latest) `startTime` is returned last in the paginated result
