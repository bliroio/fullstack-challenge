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

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3001";
app.use(
  cors({
    origin: (requestOrigin, callback) => {
      if (!requestOrigin || requestOrigin === allowedOrigin) {
        callback(null, requestOrigin || allowedOrigin);
      } else {
        callback(null, false);
      }
    },
  })
);

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json({ limit: "1mb" }));
app.use(mongoSanitize());
app.use("/api/meetings", meetingRoutes);

// Global error handler — must be after all routes
const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) return next(err);
  const httpStatus = (err as { status?: number }).status;
  if (!httpStatus || httpStatus >= 500) console.error(err);
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  // Pass through HTTP errors with a status code set by middleware (e.g. 413 PayloadTooLarge)
  if (httpStatus && httpStatus >= 400 && httpStatus < 500) {
    res.status(httpStatus).json({ message: err.message || "Request error" });
    return;
  }
  res.status(500).json({ message: "Internal server error" });
};
app.use(errorHandler);

export default app;
