import z from 'zod';
import meetingService from "../services/meetingService";
import { createMeetingSchema, mongoIdSchema, updateMeetingSchema} from "../utils/meeting.utils.schema";

const listMeetings = async (req: any, res: any) => {
  try {
    // search title
    const {title} = req.query;
    let filters: any = {};
    if (title) {
      filters.title = { $regex: title, $options: "i" };
    }
    console.log("filters: ", filters)

    const now = new Date();
    const upcomingMeetingsFilter = {...filters, startTime: {$gte: now}};
    const upcomingMeetings = await meetingService.listMeetings(upcomingMeetingsFilter, {sort: {startTime: 1}});

    const pastMeetingsFilter = {...filters, startTime: {$lte: now}};
    const pastMeetings = await meetingService.listMeetings(pastMeetingsFilter, {sort: {startTime: -1}});

    return res.json({upcomingMeetings, pastMeetings});
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

const updateMeeting = async (req: any, res: any) => {
  try {
    const {meetingId} = req.params;
    const validatedId = mongoIdSchema.parse(meetingId);
    const validatedBody = updateMeetingSchema.parse(req.body);

    const updatedMeeting = await meetingService.updateMeeting(validatedId, validatedBody);
    if (!updatedMeeting) return res.status(404).json({message: "Meeting not found!"})

    return res.status(200).json(updatedMeeting);
  } catch (error: any) {
    if(error instanceof z.ZodError){
      return res.status(400).json({message: error.issues});
    }
    return res.status(500).json({message: error.message});
  }
 }

export default { listMeetings, createMeeting, updateMeeting };
