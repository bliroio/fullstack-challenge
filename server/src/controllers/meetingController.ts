import * as meetingService from "../services/meetingService";

export const listMeetings = async (req: any, res: any) => {
  try {
    const meetings = await meetingService.listMeetings(req.query);
    res.json(meetings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
