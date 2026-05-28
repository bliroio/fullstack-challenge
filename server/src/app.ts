import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./config/swaggerConfig";
import connectDB from "./db";
import { router as meetingRoutes } from "./routes/meetingRoutes";
import { router as roomRoutes } from "./routes/roomRoutes";

const app = express();
const port = process.env.PORT || 3000;
const corsOrigin = process.env.CORS_ORIGIN;

// Connect to MongoDB
connectDB();

app.use(
  cors(
    corsOrigin
      ? { origin: corsOrigin.split(",").map((o) => o.trim()) }
      : undefined
  )
);

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use("/api/meetings", meetingRoutes);
app.use("/api/rooms", roomRoutes);

app.listen(port, () => {
  const url = process.env.API_BASE_URL || `http://localhost:${port}`;
  console.log(`Server running on ${url}`);
});
