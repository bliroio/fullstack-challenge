import meetingService from "../services/meetingService";
import Joi from "joi";

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

const createMeetingSchema = Joi.object({
  title: Joi.string().required().min(1).max(200).messages({
    'string.empty': 'Meeting title is required',
    'string.min': 'Meeting title cannot be empty',
    'string.max': 'Meeting title cannot exceed 200 characters'
  }),
  startTime: Joi.date().required().greater('now').messages({
    'date.base': 'Start time must be a valid date',
    'date.greater': 'Start time cannot be in the past',
    'any.required': 'Start time is required'
  }),
  endTime: Joi.date().required().greater(Joi.ref('startTime')).messages({
    'date.base': 'End time must be a valid date',
    'date.greater': 'End time must be after start time',
    'any.required': 'End time is required'
  })
});

const createMeeting = async (req: any, res: any) => {
  try {
    const { error, value } = createMeetingSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    // Mock user data (since we don't have auth)
    const currentUser = {
      id: 'user_1',
      name: 'Alex Potapov'
    };

    const meeting = await meetingService.createMeeting({
      ...value,
      userId: currentUser.id,
      attendees: [currentUser] // Add organizer as first attendee
    });
    
    res.status(201).json(meeting);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export default { listMeetings, createMeeting };
