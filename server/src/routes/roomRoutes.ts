import express from "express";
import { listRooms } from "../controllers/roomController";

export const router = express.Router();

/**
 * @openapi
 * /api/rooms:
 *   get:
 *     summary: Lists all meeting rooms
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: A list of rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *       500:
 *         description: Server error
 */
router.get("/", listRooms);
