import express from "express";
import meetingRoomController from "../controllers/meetingRoomController";

const router = express.Router();

/**
 * @openapi
 * /api/rooms:
 *   get:
 *     summary: Lists all available meeting rooms
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: A list of meeting rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MeetingRoom'
 *       500:
 *         description: Server error
 */
router.get("/", meetingRoomController.listRooms);

/**
 * @openapi
 * /api/rooms/{id}:
 *   get:
 *     summary: Get a meeting room by ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A meeting room
 *       404:
 *         description: Room not found
 */
router.get("/:id", meetingRoomController.getRoomById);

/**
 * @openapi
 * /api/rooms/{id}/availability:
 *   get:
 *     summary: Get room availability for a specific date
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Room availability with booked time slots
 *       404:
 *         description: Room not found
 */
router.get("/:id/availability", meetingRoomController.getAvailability);

export default router;
