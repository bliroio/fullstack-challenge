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

## Install

```bash
npm install
```

## Environment Variables

```bash
cp server/.env.example server/.env
cp client/.env.local.example client/.env.local
```

Fill in your MongoDB connection string in `server/.env`.

## Build

```bash
npm run build
```

## Run

```bash
npm run dev:server    # Express on http://localhost:3000
npm run dev:client    # Next.js on http://localhost:3001
```

## Test

```bash
npm test
```

## Seed Database (optional)

```bash
cd server
SEED_DB=true npm run seed
```
