import path from "path";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "YouWork Meeting Room API",
    version: "1.0.0",
    description: "API for managing meeting room bookings",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  components: {
    schemas: {
      MeetingRoom: {
        type: "object",
        properties: {
          _id: { type: "string", description: "Room ID" },
          name: { type: "string", description: "Room name" },
          location: { type: "string", description: "Room location" },
          capacity: { type: "number", description: "Max capacity" },
          imageUrl: { type: "string", description: "Room image URL" },
        },
      },
      Meeting: {
        type: "object",
        required: ["title", "startTime", "endTime", "roomId", "bookedBy"],
        properties: {
          _id: { type: "string", description: "Meeting ID" },
          title: { type: "string", description: "Meeting title" },
          startTime: {
            type: "string",
            format: "date-time",
            description: "Start time",
          },
          endTime: {
            type: "string",
            format: "date-time",
            description: "End time",
          },
          roomId: {
            type: "string",
            description: "Room ID reference",
          },
          bookedBy: {
            type: "object",
            properties: {
              name: { type: "string", description: "Booker name" },
              email: {
                type: "string",
                format: "email",
                description: "Booker email",
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
  apis: [path.join(__dirname, "../routes/*.js")],
};

export default options;
