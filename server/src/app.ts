import dotenv from 'dotenv';
dotenv.config();
import meetingRoutes from './routes/meetingRoutes';
import cors from 'cors';
import express from 'express';
import connectDB from './db';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from './config/swaggerConfig';

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.use(cors());

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use('/api/meetings', meetingRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
