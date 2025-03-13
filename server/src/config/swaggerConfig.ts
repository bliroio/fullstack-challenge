import path from "path";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Meeting API",
    version: "1.0.0",
    description: "A simple Express Meeting API",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  components: {
    schemas: {
      Meeting: {
        type: "object",
        required: ["title", "startTime", "endTime"],
        properties: {
          id: {
            type: "string",
            description: "The auto-generated id of the meeting",
          },
          title: {
            type: "string",
            description: "The title of the meeting",
          },
          startTime: {
            type: "string",
            format: "date-time",
            description: "The start time of the meeting",
          },
          endTime: {
            type: "string",
            format: "date-time",
            description: "The end time of the meeting",
          },
        },
      },
      MeetingUpdated: {
        type: "object",
        properties: {
          id: { type: "string", example: "60d5ec49f1a2c45724c3b6a3" },
          title: { type: "string", example: "Project Sync" },
          startTime: {
            type: "string",
            format: "date-time",
            example: "2025-03-13T10:00:00Z",
          },
          endTime: {
            type: "string",
            format: "date-time",
            example: "2025-03-13T11:00:00Z",
          },
        },
      },
      MeetingDeleted: {
        type: "object",
        properties: {
          id: { type: "string", example: "60d5ec49f1a2c45724c3b6a3" },
        },
      },
    },
  },
  paths: {
    "/ws": {
      get: {
        summary: "WebSocket connection",
        description:
          "Connect to the WebSocket server at `ws://localhost:3000` to receive real-time updates on meetings.",
        tags: ["WebSockets"],
        responses: {
          101: {
            description:
              "Switching Protocols - WebSocket connection established.",
          },
        },
      },
    },
    "/ws/events": {
      get: {
        summary: "WebSocket Events",
        description: "List of WebSocket events emitted by the server.",
        tags: ["WebSockets"],
        responses: {
          200: {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    meetingUpdated: {
                      $ref: "#/components/schemas/MeetingUpdated",
                    },
                    meetingDeleted: {
                      $ref: "#/components/schemas/MeetingDeleted",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, "../routes/*.js")], // Path to the API docs in dist folder
};

export default options;
