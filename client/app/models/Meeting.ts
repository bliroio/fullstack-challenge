export interface Meeting {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

export interface CreateMeeting {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}
