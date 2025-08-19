# Challenge submission documentation

## Work done

- Added missing pagination package to backend
- Added automatic restart on file change to dev server
- Fixed `meetingService` on the client not returning meetings
- Added backend route for creating a meeting
- Added form for creating a meeting to frontend
- Added pagination to meeting list shown in frontend and matching backend endpoint
- Returning meetings sorted by start time from backend
- Added meeting duration display for each meeting to frontend

## Future work

### Backend

- Use Zod's `parse` instead of `safeParse` as we want to throw an error anyway
- Send back correct HTTP status codes from backend based on Zod's parsing result when creating meetings (e.g. 400 for invalid requests)
- Add tests

### Frontend

#### UI/UX

- Add loading indicator for meeting list
- Use optimistic update when creating challenge
- Add visual feedback for successful meeting creation
- Add countdown until meeting start
- Make sorting order of meetings variable
- Show backend validation errors in frontend
- Improve visuals of form validation errors

#### Technical

- Retrieve server URL from an `.env` file
- Fix React errors
- Simplify `Home` component
- Add tests
- Upgrade MUI to newest version
