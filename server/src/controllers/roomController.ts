import { Request, Response } from "express";
import * as roomService from "../services/roomService";

export const listRooms = async (_req: Request, res: Response) => {
  try {
    const rooms = await roomService.listRooms();
    res.json(rooms);
  } catch (error) {
    console.error("listRooms error:", error);
    res.status(500).json({ message: "Failed to list rooms" });
  }
};
