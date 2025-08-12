import express from "express";
import meetingController from "../controllers/meetingController";

const router = express.Router();

/**
 * @openapi
 * /api/meetings:
 *   get:
 *     summary: Lists all the meetings
 *     tags: [Meetings]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
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
router.get("/", meetingController.listMeetings);

/**
 * @openapi
 * /api/meetings:
 *   post:
 *     summary: Creates a new meeting
 *     tags: [Meetings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMeeting'
 *     responses:
 *       201:
 *         description: The created meeting
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meeting'
 *       500:
 *         description: Server error
 */
router.post("/", meetingController.createMeeting);

export default router;
