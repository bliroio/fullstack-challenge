import axios from 'axios';
import { Meeting } from '../models/Meeting';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + '/meetings';

export type MeetingRequest = {
  offset: number;
  limit: number;
  title: string;
}

export type MeetingResponse = {
  docs: Meeting[];
  totalDocs: number;
  offset: number;
  limit: number;
  prevPage: number;
  nextPage: number;
}

export const listMeetings = async ({ offset, limit, title }: MeetingRequest): Promise<MeetingResponse> => {
  try {
    const response = await axios.get<MeetingResponse>(API_BASE_URL, {
      params: {
        offset,
        limit,
        query: `{"title":{"$regex":"${title}","$options": "i"}}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching meetings:', error);
    throw error;
  }
};
