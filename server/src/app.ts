import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import express, { ErrorRequestHandler } from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./config/swaggerConfig";
import { AppError } from "./utils/AppError";
import { router as meetingRoutes } from "./routes/meetingRoutes";
import { mongoSanitize } from "./middleware/sanitize";

const app = express();

// Security headers
app.use(helmet());

// Request logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // 100 requests per window per IP
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later" },
});
app.use("/api/", apiLimiter);

app.use(cors());

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(mongoSanitize());
app.use("/api/meetings", meetingRoutes);

// Global error handler — must be after all routes
const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) return next(err);
  console.error(err);
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  res.status(500).json({ message: "Internal server error" });
};
app.use(errorHandler);

export default app;
