import { Request, Response } from "express";
import meetingRoomService from "../services/meetingRoomService";
import meetingService from "../services/meetingService";

const listRooms = async (_req: Request, res: Response) => {
  try {
    const rooms = await meetingRoomService.listRooms();
    res.json(rooms);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getRoomById = async (req: Request, res: Response) => {
  try {
    const room = await meetingRoomService.getRoomById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(room);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date || typeof date !== "string") {
      return res.status(400).json({ message: "date query parameter is required (YYYY-MM-DD)" });
    }

    const room = await meetingRoomService.getRoomById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const bookedSlots = await meetingService.getAvailability(id, date);

    res.json({
      date,
      businessHours: { start: "08:00", end: "20:00" },
      bookedSlots,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export default { listRooms, getRoomById, getAvailability };
