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
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Meeting created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
/**
 * @openapi
 * /api/meetings/{id}/cancel:
 *   patch:
 *     summary: Cancel a meeting
 *     tags: [Meetings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Meeting ID
 *     responses:
 *       200:
 *         description: Meeting cancelled successfully
 *       403:
 *         description: Not authorized to cancel this meeting
 *       404:
 *         description: Meeting not found
 *       400:
 *         description: Meeting already cancelled
 *       500:
 *         description: Server error
 */

router.get("/", meetingController.listMeetings);
router.post("/", meetingController.createMeeting);
router.patch("/:id/cancel", meetingController.cancelMeeting);

export default router;
