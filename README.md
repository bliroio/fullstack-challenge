# Notes from Alexander Potapov

# Summary after 3 hours of work:

Project is ready to be demoed. Expected workflow:

- Open the app and see the list of meetings
- Click on a Create meeting button
- Fill in the form
- Make mistakes while filling the form to show validation errors: end time before start time, etc.
- Check that the meeting was created successfully
- Note that the countdown is showing time until the next meeting
- Click on the three-dot menu of the newly created meeting and choose "Cancel"
- Note the toast notification delivered in real-time

The design is not pixel-perfect but I used the global css variables to make it consistent and to allow for easy changes in the future.

No testing was done. Not much sense in unit-testing for any of the implemented functionality. I would go with just (manual) E2E testing.

# Notes before starting the work:

Stated requirements:
- "provide a meeting booking functionality that is sufficiently designed for enterprise customers"
- "there are only 180 minutes left until the follow up meeting where the lead check whether the system is sufficient to their needs"
- "The CTO makes you the one responsible to pass the demo in the meeting."

Given this goal and a strict time limit, I will focus on delivering the core functionality first and will allow myself to "fake" things like authentication.

## Assumptions

- The user is already logged in with user id 1
- Timezone is UTC
- No need to write migrations due to the DB being nuked on every startup

## Implementation details

- date-fns to format dates and times
- joi for input validation

## User stories:

### ✅ User story 1:
As a business user, I want to view a list of all my booked meetings.
- Display meetings in chronological order
- Show meeting title, start datetime, end datetime, and duration
- Show meeting status (upcoming, in progress, completed, cancelled)
- Include attendee count or key attendees

### ✅ User story 2: 
As a business user, I want to see the countdown until my next upcoming meeting prominently so that I don't miss important appointments.

Note: "For each meeting a countdown that counts down the time until the next meeting starts" - This story is unclear. Is it meant that there should be a countdown for the user's next meeting or should we list the countdown for all meetings in the list? I think the former is more likely.

### ✅ User story 3:
As a business user, I want to create a new meeting so that I can schedule time with colleagues and clients.

- Form with required fields: title, start datetime, end datetime
- Date/time picker with validation
- Display validation errors
- Save meeting to backend successfully

### ✅ User story 4:
As a business user, I want to add attendees to my meeting so that all relevant people are notified.

## Nice-to-haves

### ✅ Live updates
It would be cool to have meeting updates being displayed live in the frontend. E.g.
if a meeting is moved or cancelled.

Note: hard to implement without user system in place.

I decided to implement a simple event system that dispatches an event when a meeting is cancelled. Since no user system is in place - I notify just the meeting organizer. This makes it possible to showcase functionality in the demo.

CUTOFF. Did not get to this.

### Performance
There will be millions of meetings in the database and users will have 20 meetings a
week booked through the portal. The app should be performant and also people
will need to look up historic meetings.

## More stories

Following stories are not listed in the requirements but seem pretty obvious and are actually reflected in the overview page design.

### User story 5:
As a business user, I want to add tags to my meetings so that I can easily find them later.

### User story 6:
As a business user, I want to see the list of my past meetings.

### User story 7:
As a business user, I want to see the paginated list of my meetings.


# Bliro's Engineer Challenge Repo

## Prerequisites:
- Familiarity with TypeScript, React, Node.js, and Express.
- Understanding of RESTful APIs and database operations.
- Setup:
  - Clone the provided repository containing the initial code for both the client (app) and server (server). 
  - Set up the environment to run both applications using the corresponding README.md files you find in each repository.

## Deliverables:

- A README.md file documenting the work done and any assumptions made.
- A new branch with your complete project code, including commit history to show your work progress.

Please ensure that you dont exceed the given timeframe. Good luck!

