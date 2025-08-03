import axios from "axios";
import { Meeting } from "../models/Meeting";

const API_BASE_URL = "http://localhost:3000/api/meetings";

export const listMeetings = async (): Promise<Meeting[]> => {
  try {
    const response = await axios.get<{ docs: Meeting[] }>(API_BASE_URL);
    console.log("Response from API:", response.data);
    return response.data.docs;
  } catch (error) {
    console.error("Error fetching meetings:", error);
    throw error;
  }
};

export const createMeeting = async (meetingData: {
  title: string;
  startTime: string;
  endTime: string;
}): Promise<Meeting> => {
  try {
    const response = await axios.post<Meeting>(API_BASE_URL, meetingData);
    return response.data;
  } catch (error) {
    console.error("Error creating meeting:", error);
    throw error;
  }
};
