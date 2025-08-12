import axios from "axios";
import { Meeting } from "../models/Meeting";

const API_BASE_URL = "http://localhost:3000/api/meetings";

type CreateMeeting = Omit<Meeting, "id">;

export const listMeetings = async (
  page: number,
  rowsPerPage: number
): Promise<{ meetings: Meeting[]; total: number }> => {
  try {
    const response = await axios.get<{ docs: Meeting[]; totalDocs: number }>(
      API_BASE_URL,
      {
        params: {
          page: page + 1, // Backend expects 1-based page
          limit: rowsPerPage,
        },
      }
    );
    return {
      meetings: response.data.docs ?? [],
      total: response.data.totalDocs ?? 0,
    };
  } catch (error) {
    console.error("Error fetching meetings:", error);
    throw error;
  }
};

export const createMeeting = async (
  meetingData: CreateMeeting
): Promise<Meeting> => {
  try {
    const response = await axios.post<Meeting>(API_BASE_URL, meetingData);
    return response.data;
  } catch (error) {
    console.error("Error creating meeting:", error);
    throw error;
  }
};
