import path from 'path';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Meeting API',
    version: '1.0.0',
    description: 'A simple Express Meeting API',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  components: {
    schemas: {
      Meeting: {
        type: 'object',
        required: ['title', 'startTime', 'endTime'],
        properties: {
          id: {
            type: 'string',
            description: 'The auto-generated id of the meeting',
          },
          title: {
            type: 'string',
            description: 'The title of the meeting',
          },
          startTime: {
            type: 'string',
            format: 'date-time',
            description: 'The start time of the meeting',
          },
          endTime: {
            type: 'string',
            format: 'date-time',
            description: 'The end time of the meeting',
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, '../routes/*.js')], // Path to the API docs in dist folder
};

export default options;
