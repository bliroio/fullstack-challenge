import path from "path";

const port = process.env.PORT || 3000;
const serverUrl = process.env.API_BASE_URL || `http://localhost:${port}`;

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Meeting API",
    version: "1.0.0",
    description: "A simple Express Meeting API",
  },
  servers: [
    {
      url: serverUrl,
      description: process.env.API_BASE_URL ? "Configured server" : "Development server",
    },
  ],
  components: {
    schemas: {
      Meeting: {
        type: "object",
        required: ["title", "startTime", "endTime", "roomId"],
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
          roomId: {
            type: "string",
            description: "Id of the room this meeting is booked in",
          },
        },
      },
      Room: {
        type: "object",
        required: ["name", "capacity"],
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          capacity: { type: "integer", minimum: 1 },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, "../routes/*.js")],
};

export default options;
