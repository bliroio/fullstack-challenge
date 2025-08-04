import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./config/swaggerConfig";
import connectDB from "./db";
import meetingRoutes from "./routes/meetingRoutes";

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.use(cors());

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use("/api/meetings", meetingRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
