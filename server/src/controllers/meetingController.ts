import meetingService from "../services/meetingService";

const listMeetings = async (req: any, res: any) => {
  try {
    const query = {
      endTime: { $gte: new Date() },
      options: {
        sort: { startTime: 1 }
      }
    };
    
    const meetings = await meetingService.listMeetings(query);
    res.json(meetings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export default { listMeetings };
