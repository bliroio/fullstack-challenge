import z from 'zod';
import meetingService from "../services/meetingService";
import { createMeetingSchema} from "../utils/meeting.utils.schema";

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
    // validate input
    const validatedData = createMeetingSchema.parse(req.body);

    const newMeeting = await meetingService.createMeeting(validatedData);

    return res.status(201).json(newMeeting);
  } catch (error: any) {
    if(error instanceof z.ZodError){
      // return bad request status
      return res.status(400).json({message: error.issues});
    }
    return res.status(500).json({message: error.message});
  }
}

export default { listMeetings, createMeeting };
