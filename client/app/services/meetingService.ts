import axios from "axios";
import { Meeting } from "../models/Meeting";

const API_BASE_URL = "http://localhost:3000/api/meetings";

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
export const listMeetings = async (): Promise<Meeting[]> => {
  try {
    //const response = await axios.get<PaginatedResponse>(API_BASE_URL + '?limit=100');
    //return response.data.docs;
    return [
      {
        id: "1",
        title: "Team Sync",
        startTime: "2025-10-25T10:00:00Z",
        endTime: "2025-10-25T11:00:00Z"
      },
      {
        id: "2",
        title: "Project Kickoff",
        startTime: "2025-10-26T14:00:00Z",
        endTime: "2025-10-26T15:30:00Z"
      }
    ]
  } catch (error) {
    console.error("Error fetching meetings:", error);
    throw error;
  }
};

export const createMeeting = async (meeting: Omit<Meeting, "id">) => {
  if (!meeting.title || !meeting.startTime || !meeting.endTime) {
    throw new Error("Missing required meeting fields");
  }
  if (meeting.title.trim().length < 3) {
    throw new Error("Title must be at least 3 characters long");
  }
  if (new Date(meeting.startTime) >= new Date(meeting.endTime)) {
    throw new Error("startTime must be before endTime");
  }

  try {
    const response = await axios.post(API_BASE_URL, meeting);
    return response.data;
  } catch (error) {
    console.error("Error creating meeting:", error);
    throw error;
  }
};
