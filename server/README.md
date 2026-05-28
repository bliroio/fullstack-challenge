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

## MongoDB (local via Docker)

The simplest way to run a database for local development is the bundled `docker-compose.yml` at the repo root:

```bash
# from the repo root
docker compose up -d mongo
```

This starts MongoDB 7 on `localhost:27017` with data persisted in a Docker volume. To stop it: `docker compose down`. To wipe the data: `docker compose down -v`.

You can then use this connection string in `.env`:

```bash
MONGODB_URI=mongodb://localhost:27017/bliro-challenge
```

If you'd rather use a hosted MongoDB Atlas cluster, see the alternative formats documented in `.env.example`.

## Environment Variables

Copy the `.env.example` file to a new file named `.env`.

```bash
cp .env.example .env
```

The default value in `.env.example` already points at the local Docker MongoDB instance, so no further edits are required if you went the Docker route.

### Optional variables (recommended for production)

```bash
# Public base URL of the API — used in Swagger docs and the startup log.
API_BASE_URL=https://api.example.com

# Comma-separated list of allowed CORS origins.
CORS_ORIGIN=https://app.example.com
```

If `API_BASE_URL` is unset the server falls back to `http://localhost:${PORT}`.
If `CORS_ORIGIN` is unset CORS is open to all origins (fine for local dev).

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
