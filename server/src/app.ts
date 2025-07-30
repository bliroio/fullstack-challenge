import dotenv from "dotenv";
dotenv.config();
import meetingRoutes from "./routes/meetingRoutes";
import cors from "cors";
import express from "express";
import connectDB from "./db";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerOptions from "./config/swaggerConfig";
import { createServer } from "http";
import { initializeSocket } from "./socket/socketHandler";

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Initialize Socket.IO
initializeSocket(httpServer);

app.use(cors());

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use("/api/meetings", meetingRoutes);

httpServer.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Socket.IO server initialized`);
});
