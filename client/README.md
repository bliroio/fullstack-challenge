# Client
This guide outlines the setup process for the Next.js client environment.

## Prerequisites
- Node.js (version v18.18.2)
- npm (usually comes with Node.js)

## Install Dependencies
Execute the following command to install the required npm packages:

```bash
npm install
```

## Environment Variables
Duplicate the .env.local.example file to a new file named .env.local, and populate it with your specific variables for the environment.

```bash
cp .env.local.example .env.local
```

Edit the .env.local file to include necessary environment variables such as API endpoints.

## Run the Development Server
To run the client in development mode with hot-reloading:

```bash
npm run dev
```

Your Next.js client will start on http://localhost:3001 by default.

## Build and Start for Production
To build the application for production usage:

```bash
npm run build
```

## Then start the Next.js application:

```bash
npm start
```

## Testing
To check that your client setup is functioning correctly, navigate to http://localhost:3001 in your web browser. You should see your Next.js application running.

## Troubleshooting
If npm packages are causing issues, delete the node_modules folder and package-lock.json file and reinstall the dependencies with npm install.
Ensure that .env.local is included in your .gitignore to prevent committing sensitive environment data to version control.
