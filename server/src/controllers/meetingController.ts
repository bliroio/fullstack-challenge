import { Request, Response } from "express";
import * as meetingService from "../services/meetingService";
import { ValidationError } from "../services/meetingService";

export const listMeetings = async (req: Request, res: Response) => {
  try {
    const meetings = await meetingService.listMeetings(req.query);
    res.json(meetings);
  } catch (error) {
    console.error("listMeetings error:", error);
    res.status(500).json({ message: "Failed to list meetings" });
  }
};

export const createMeeting = async (req: Request, res: Response) => {
  try {
    const meeting = await meetingService.createMeeting(req.body);
    res.status(201).json(meeting);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    console.error("createMeeting error:", error);
    res.status(500).json({ message: "Failed to create meeting" });
  }
};
