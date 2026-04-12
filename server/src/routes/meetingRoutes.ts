import express from "express";
import { listMeetings, createMeeting } from "../controllers/meetingController";
import { validate } from "../middleware/validate";
import { createMeetingSchema } from "shared/schemas/meeting";

export const router = express.Router();

/**
 * @openapi
 * /api/meetings:
 *   get:
 *     summary: Lists all the meetings
 *     tags: [Meetings]
 *     responses:
 *       200:
 *         description: A paginated list of meetings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 docs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Meeting'
 *                 totalDocs:
 *                   type: number
 *                 limit:
 *                   type: number
 *                 hasPrevPage:
 *                   type: boolean
 *                 hasNextPage:
 *                   type: boolean
 *                 page:
 *                   type: number
 *                 totalPages:
 *                   type: number
 *                 offset:
 *                   type: number
 *                 prevPage:
 *                   type: number
 *                   nullable: true
 *                 nextPage:
 *                   type: number
 *                   nullable: true
 *                 pagingCounter:
 *                   type: number
 *       500:
 *         description: Server error
 */
router.get("/", listMeetings);

/**
 * @openapi
 * /api/meetings:
 *   post:
 *     summary: Create a new meeting
 *     tags: [Meetings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - startTime
 *               - endTime
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Team Standup"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-01-15T09:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-01-15T09:30:00Z"
 *     responses:
 *       201:
 *         description: The created meeting
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meeting'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *                 errors:
 *                   type: object
 *       500:
 *         description: Server error
 */
router.post("/", validate(createMeetingSchema), createMeeting);
