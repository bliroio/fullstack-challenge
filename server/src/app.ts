import dotenv from "dotenv";
dotenv.config();
import meetingRoutes from "./routes/meetingRoutes";
import cors from "cors";
import express from "express";
import connectDB from "./db";
import http from "http";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerOptions from "./config/swaggerConfig";
import { Server } from "socket.io";
import meetingService from "./services/meetingService";
import { IMeeting } from "./models/meeting";

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // Allow all origins (change this in production)
});

// Notify clients when a meeting is updated
meetingService.onMeetingUpdated = (updatedMeeting: IMeeting) => {
  io.emit("meetingUpdated", updatedMeeting);
};

// Notify clients when a meeting is deleted
meetingService.onMeetingDeleted = (meetingId: string) => {
  io.emit("meetingDeleted", meetingId);
};

// Connect to MongoDB
connectDB();

app.use(cors());

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use("/api/meetings", meetingRoutes);

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
