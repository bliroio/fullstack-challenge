export interface Meeting {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  attendees: { id: string; name: string }[];
  userId: string; // Meeting organizer/owner
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
  cancelled: boolean;
}
