import axios, { AxiosError } from 'axios';
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

// Wiederverwendbare Fehlerbehandlung
const handleAxiosError = (error: unknown, operation: string): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    console.error(`Error ${operation}:`, {
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      data: axiosError.response?.data,
      message: axiosError.message,
    });

    // Spezifische Behandlung je nach Status-Code
    switch (axiosError.response?.status) {
      case 400:
        throw new Error('Invalid data provided');
      case 401:
        throw new Error('Unauthorized access');
      case 404:
        throw new Error('Resource not found');
      case 409:
        throw new Error('Resource already exists');
      case 500:
        throw new Error('Server error occurred');
      default:
        throw new Error(`Request failed: ${axiosError.message}`);
    }
  }
  throw error;
};

export const listMeetings = async (): Promise<MeetingResponse> => {
  try {
    const response = await axios.get<MeetingResponse>(API_BASE_URL + '/meetings');
    return response.data;
  } catch (error) {
    return handleAxiosError(error, 'fetching meetings');
  }
};

export const createMeeting = async (meeting: CreateMeeting): Promise<Meeting> => {
  try {
    const response = await axios.post<Meeting>(API_BASE_URL + '/meetings', meeting);
    return response.data;
  } catch (error) {
    return handleAxiosError(error, 'creating meeting');
  }
};
