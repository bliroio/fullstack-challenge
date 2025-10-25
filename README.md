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

## Changes:

### Frontend:
- button in header to create meeting
- drawer component to show meeting creation form
- meeting form contains fields for title, start, end
- user feedback
- validation of meeting data in meetingService
- I changed meetingService to return mock data instead of actual db data, since I could not connect to it (I verified that the server code received the correct connection string with my username and password, but it still did not work and I got this error:)
```
  MongoDB connection error: MongoServerError: bad auth : authentication failed
    at Connection.sendCommand (E:\Github\fullstack-challenge\server\node_modules\mongodb\lib\cmap\connection.js:305:27)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async Connection.command (E:\Github\fullstack-challenge\server\node_modules\mongodb\lib\cmap\connection.js:333:26)
    at async continueScramConversation (E:\Github\fullstack-challenge\server\node_modules\mongodb\lib\cmap\auth\scram.js:131:15)
    at async executeScram (E:\Github\fullstack-challenge\server\node_modules\mongodb\lib\cmap\auth\scram.js:80:5)
    at async ScramSHA1.auth (E:\Github\fullstack-challenge\server\node_modules\mongodb\lib\cmap\auth\scram.js:39:16)
    at async performInitialHandshake (E:\Github\fullstack-challenge\server\node_modules\mongodb\lib\cmap\connect.js:104:13)
    at async connect (E:\Github\fullstack-challenge\server\node_modules\mongodb\lib\cmap\connect.js:24:9) {
  errorLabelSet: Set(2) { 'HandshakeError', 'ResetPool' },
  errorResponse: {
    ok: 0,
    errmsg: 'bad auth : authentication failed',
    code: 8000,
    codeName: 'AtlasError'
  },
  ok: 0,
  code: 8000,
  codeName: 'AtlasError',
  connectionGeneration: 0
}
```
- not sure if it was a simple syntax error or something else

### Backend:
- adjusted zod validator for meeting

### Assumptions:
- Backend validation is primary form of validation, frontend validation only done for better user experience
- meeting time formats are valid