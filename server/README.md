# Server
This is a basic setup guide for the Node.js Express environment for the server.

## Prerequisites
Node.js (version v18.18.2)
npm (usually comes with Node.js)

## Install Dependencies
Run the following command to install the required npm packages:

```bash
npm install
```

## Environment Variables
Copy the `.env.example` file to a new file named `.env`. 

```bash
cp .env.example .env
```

Then copy and paste your personal mongoDB access key as `[MY_PERSONAL_ACCESS_KEY]` into the `.env` file.

```bash
PORT=3000
MONGODB_URI=[MY_PERSONAL_ACCESS_KEY]
```

## Start the Server
To start the server, run:

```bash
npm start
```

Alternatively, if you're using nodemon for development:

```bash
npm run dev
```

This will start the server on the default port, usually http://localhost:3000.

**Note: It might take a few seconds until the database is reset :)**

## Testing
To ensure that the setup is correct and the server is running, you can test by pointing your browser to http://localhost:3000 or using a tool like Postman to make a request.

## Troubleshooting
If you encounter any issues with npm packages, try removing the node_modules directory and the package-lock.json file, then run npm install again.
Ensure that the .env file is not being pushed to version control and contains the correct environment variables for your development setup.
