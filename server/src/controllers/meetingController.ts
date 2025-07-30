import meetingService from "../services/meetingService";
import Joi from "joi";
import { meetingEvents } from "../events/meetingEvents";

const listMeetings = async (req: any, res: any) => {
  try {
    const query = {
      endTime: { $gte: new Date() },
      cancelled: { $ne: true }, // Exclude cancelled meetings
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
  }),
  attendees: Joi.array().items(
    Joi.string().trim().min(1).max(100).messages({
      'string.empty': 'Attendee name cannot be empty',
      'string.min': 'Attendee name cannot be empty',
      'string.max': 'Attendee name cannot exceed 100 characters'
    })
  ).optional().default([])
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

    // Convert attendee names to attendee objects and add organizer
    const attendeeObjects = value.attendees ? value.attendees.map((name: string, index: number) => ({
      id: `attendee_${Date.now()}_${index}`,
      name: name.trim()
    })) : [];

    // Add organizer as first attendee
    const allAttendees = [currentUser, ...attendeeObjects];

    const meeting = await meetingService.createMeeting({
      ...value,
      userId: currentUser.id,
      attendees: allAttendees
    });
    
    res.status(201).json(meeting);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const cancelMeeting = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const currentUserId = 'user_1'; // Mock current user
    
    // Find the meeting and check ownership
    const meeting = await meetingService.getMeeting(id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    
    if (meeting.userId !== currentUserId) {
      return res.status(403).json({ message: 'You can only cancel your own meetings' });
    }
    
    if (meeting.cancelled) {
      return res.status(400).json({ message: 'Meeting is already cancelled' });
    }
    
    const updatedMeeting = await meetingService.cancelMeeting(id);
    
    // Collect all users to notify (organizer + attendees, but deduplicated)
    const usersToNotify = new Set<string>();
    usersToNotify.add(meeting.userId); // Add organizer
    
    // Add all attendees
    meeting.attendees.forEach(attendee => {
      usersToNotify.add(attendee.id);
    });
    
    // Emit event for each unique user
    usersToNotify.forEach(userId => {
      console.log(`Emitting meeting cancelled event for meeting ${id}, user ${userId}`);
      meetingEvents.emitMeetingCancelled(id, userId);
    });
    
    res.json(updatedMeeting);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export default { listMeetings, createMeeting, cancelMeeting };
