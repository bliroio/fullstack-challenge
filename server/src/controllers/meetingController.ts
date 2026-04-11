import { Request, Response } from "express";
import meetingService from "../services/meetingService";
import { createMeetingSchema } from "../validators/meeting";

const listMeetings = async (req: Request, res: Response) => {
  try {
    const meetings = await meetingService.listMeetings(req.query);
    res.json(meetings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const createMeeting = async (req: Request, res: Response) => {
  try {
    const result = await createMeetingSchema.safeParseAsync(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const meeting = await meetingService.createMeeting(result.data);
    res.status(201).json(meeting);
  } catch (error: any) {
    if (error.message === "ROOM_CONFLICT") {
      return res.status(409).json({
        message: "This room is already booked for the selected time slot",
      });
    }
    res.status(500).json({ message: error.message });
  }
};

export default { listMeetings, createMeeting };
