import meetingService from "../services/meetingService";

const listMeetings = async (req: any, res: any) => {
  try {
    const meetings = await meetingService.listMeetings(req.query);
    res.json(meetings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const createMeeting = async (req: any, res: any) => {
  try {
    const meeting = await meetingService.createMeeting(req.body);
    res.status(201).json(meeting);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export default { listMeetings, createMeeting };
