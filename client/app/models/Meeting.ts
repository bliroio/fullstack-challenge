export interface Meeting {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  status?: 'Delivered' | 'Scheduled' | 'In Progress' | 'Cancelled';
  attendeeCount?: number;
  attendees?: string[];
  callType?: 'Sales calls' | 'Marketing calls' | 'Discovery calls' | 'General';
}
