import meetingService from "../services/meetingService";

const createMeeting = async (req: any, res: any) => {
  try {
    const newMeeting = await meetingService.createMeeting(req.body);
    res.status(201).json(newMeeting);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const getMeeting = async (req: any, res: any) => {
  try {
    const meeting = await meetingService.getMeetingById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    res.json(meeting);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const updateMeeting = async (req: any, res: any) => {
  try {
    const updatedMeeting = await meetingService.updateMeeting(
      req.params.id,
      req.body
    );
    if (!updatedMeeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    res.json(updatedMeeting);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMeeting = async (req: any, res: any) => {
  try {
    const deletedMeeting = await meetingService.deleteMeeting(req.params.id);
    if (!deletedMeeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const listMeetings = async (req: any, res: any) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const filters: any = {};
    if (req.query.title) {
      filters.title = { $regex: req.query.title, $options: "i" }; // Case-insensitive search
    }
    if (req.query.startDate && req.query.endDate) {
      filters.startTime = {
        $gte: new Date(req.query.startDate as string),
        $lte: new Date(req.query.endDate as string),
      };
    }
    const meetings = await meetingService.listMeetings(filters, page, limit);
    res.json(meetings);
  } catch (error: any) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ message: error.message });
  }
};

export default {
  createMeeting,
  getMeeting,
  updateMeeting,
  deleteMeeting,
  listMeetings,
};
