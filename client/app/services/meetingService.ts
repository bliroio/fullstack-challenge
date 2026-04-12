import axios from "axios";
import type { Meeting } from "shared/schemas/meeting";
import { meetingSchema } from "shared/schemas/meeting";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

/** Validate API response data against the shared Zod schema. */
const parseMeeting = (data: unknown): Meeting => meetingSchema.parse(data);

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

export const listMeetings = async (params?: { page?: number; limit?: number; title?: string }): Promise<PaginatedResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set("page", String(params.page));
    if (params?.limit) queryParams.set("limit", String(params.limit));
    if (params?.title) queryParams.set("title", params.title);
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/meetings${queryString ? `?${queryString}` : ""}`;
    const response = await axios.get<PaginatedResponse>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching meetings:", error);
    throw error;
  }
};

export const createMeeting = async (meeting: Omit<Meeting, "id">) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/meetings`, meeting);
    return parseMeeting(response.data);
  } catch (error) {
    console.error("Error creating meeting:", error);
    throw error;
  }
};

export const deleteMeeting = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/meetings/${id}`);
  } catch (error) {
    console.error("Error deleting meeting:", error);
    throw error;
  }
};

export const updateMeeting = async (id: string, meeting: Omit<Meeting, "id">): Promise<Meeting> => {
  try {
    const response = await axios.put<Meeting>(`${API_BASE_URL}/meetings/${id}`, meeting);
    return response.data;
  } catch (error) {
    console.error("Error updating meeting:", error);
    throw error;
  }
};
