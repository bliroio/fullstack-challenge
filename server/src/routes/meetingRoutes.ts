import express from "express";
import meetingController from "../controllers/meetingController";

const router = express.Router();

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
router.get("/", meetingController.listMeetings);

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
 *             $ref: '#/components/schemas/Meeting'
 *     responses:
 *       201:
 *         description: Meeting created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meeting'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 */
router.post("/", meetingController.createMeeting);

/**
 * @openapi
 * /api/meetings/{meetingId}:
 *   put:
 *     summary: Update an existing meeting
 *     tags: [Meetings]
 *     parameters:
 *       - in: path
 *         name: meetingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the meeting to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Meeting'
 *     responses:
 *       200:
 *         description: Meeting updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meeting'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Meeting not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.put("/:meetingId", meetingController.updateMeeting);

export default router;
