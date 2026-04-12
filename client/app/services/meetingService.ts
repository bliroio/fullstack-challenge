import axios from "axios";
import type { Meeting } from "shared/schemas/meeting";
import { meetingSchema } from "shared/schemas/meeting";

const API_BASE_URL = "http://localhost:3000/api/meetings";

/** Validate API response data against the shared Zod schema. */
const parseMeeting = (data: unknown): Meeting => meetingSchema.parse(data);
const parseMeetings = (data: unknown[]): Meeting[] => data.map(parseMeeting);

type PaginatedResponse = {
  docs: Meeting[];
  totalDocs: number,
  limit: number,
  hasPrevPage: boolean,
  hasNextPage: boolean,
  page: number,
  totalPages: number,
  offset: number,
  prevPage: number | null,
  nextPage: number | null,
  pagingCounter: number
}
export const listMeetings = async (params?: { title?: string }): Promise<Meeting[]> => {
  try {
    let url = API_BASE_URL + "?limit=100";
    if (params?.title) {
      url += "&title=" + encodeURIComponent(params.title);
    }
    const response = await axios.get<PaginatedResponse>(url);
    return parseMeetings(response.data.docs);
  } catch (error) {
    console.error("Error fetching meetings:", error);
    throw error;
  }
};

export const createMeeting = async (meeting: Omit<Meeting, "id">) => {
  try {
    const response = await axios.post(API_BASE_URL, meeting);
    return parseMeeting(response.data);
  } catch (error) {
    console.error("Error creating meeting:", error);
    throw error;
  }
};

export const deleteMeeting = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting meeting:", error);
    throw error;
  }
};
