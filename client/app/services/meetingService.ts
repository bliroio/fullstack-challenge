import axios from 'axios';
import { Meeting, CreateMeeting } from '../models/Meeting';

const API_BASE_URL = 'http://localhost:3000/api';

interface MeetingResponse {
  docs: Meeting[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export const listMeetings = async (): Promise<MeetingResponse> => {
  try {
    const response = await axios.get<MeetingResponse>(API_BASE_URL + '/meetings');
    return response.data;
  } catch (error) {
    console.error('Error fetching meetings:', error);
    throw error;
  }
};

export const createMeeting = async (meeting: CreateMeeting): Promise<Meeting> => {
  try {
    const response = await axios.post<Meeting>(API_BASE_URL + '/meetings', meeting);
    return response.data;
  } catch (error) {
    console.error('Error creating meeting:', error);
    throw error;
  }
};
