import axios from "axios";
import { Meeting } from "../models/Meeting";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export type PaginatedResponse = {
  docs: Meeting[];
  totalDocs: number;
  limit: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  page: number;
  totalPages: number;
  offset: number;
  prevPage: number | null;
  nextPage: number | null;
  pagingCounter: number;
};

export type CreateMeetingPayload = {
  title: string;
  startTime: string;
  endTime: string;
  roomId: string;
  bookedBy: {
    name: string;
    email: string;
  };
};

export const listMeetings = async (
  page = 1,
  limit = 10,
  roomId?: string,
): Promise<PaginatedResponse> => {
  let url = `${API_BASE_URL}/meetings?page=${page}&limit=${limit}`;
  if (roomId) url += `&roomId=${roomId}`;
  const response = await axios.get<PaginatedResponse>(url);
  return response.data;
};

export const createMeeting = async (
  meeting: CreateMeetingPayload,
): Promise<Meeting> => {
  const response = await axios.post(`${API_BASE_URL}/meetings`, meeting);
  return response.data;
};
