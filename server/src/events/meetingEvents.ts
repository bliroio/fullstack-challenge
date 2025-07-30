import { EventEmitter } from 'events';

export class MeetingEventEmitter extends EventEmitter {
  // Event types
  static readonly MEETING_CANCELLED = 'meeting:cancelled';
  static readonly MEETING_CREATED = 'meeting:created';
  static readonly MEETING_UPDATED = 'meeting:updated';

  // Emit meeting cancelled event
  emitMeetingCancelled(meetingId: string, userId: string) {
    this.emit(MeetingEventEmitter.MEETING_CANCELLED, {
      meetingId,
      userId,
      timestamp: new Date()
    });
  }

  // Emit meeting created event
  emitMeetingCreated(meetingId: string, userId: string) {
    this.emit(MeetingEventEmitter.MEETING_CREATED, {
      meetingId,
      userId,
      timestamp: new Date()
    });
  }
}

// Global singleton instance
export const meetingEvents = new MeetingEventEmitter();