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

## Assumptions & Notes
- After reviewing the figma design and requirements, there are some inconsistencies regarding the provided designs e.g. the mockups include a few elements such as participant lists, meeting tags and action menu that aren't included in the requirements. 
- Similarly, some requirements such as the countdown and meeting status are not present in the mockup. The functional requirements from the CTO take precedence and I will prioritize these. 
- To implement real time updates for meeting status, there should ideally be some ground work which includes managing user sessions and being able to assign meetings to users (participants etc). However, this will bloat the scope. We can possibly instead just send out universal updates.

## User Stories & Requirements

### 1. Display list of meetings
- Basic list API is already provided
- Frontend should be able to list meetings according to the mockups

### 2. Users should be able to create new meetings
- Develop a Create API that is able to create new meetings with input validation
- Users are able to create new meeting via a form on the frontend
- Form should have form validation

### 3. Show a count down for each upcoming meeting - Required
- As users forget about meetings, a countdown timer should be shown for each meeting

### 4. Users should be able to lookup meetings
- Users are able to lookup meetings via search -> List API will need to be updated
- Implement pagination for performance - nice to have

### 5. Resolve frontend bugs
- All the existing frontend bugs need to be resolved

### 6. Meeting updates are provided in real time - Nice to have
- In case a meeting is cancelled or updated, these should be reflected in real time to other users -> will require sockets/server side events
