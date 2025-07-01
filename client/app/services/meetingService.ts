import axios from 'axios';
import { Meeting } from '../models/Meeting';

const API_BASE_URL = 'http://localhost:3000/api/meetings';

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
    const response = await axios.get<MeetingResponse>(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching meetings:', error);
    throw error;
  }
};
