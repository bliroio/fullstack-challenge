import axios from "axios";
import { Meeting } from "../models/Meeting";

const API_BASE_URL = "http://localhost:3000/api/meetings";

export const listMeetings = async (): Promise<Meeting[]> => {
  try {
    const response = await axios.get<{ docs: Meeting[] }>(API_BASE_URL);
    return response.data.docs ?? [];
  } catch (error) {
    console.error("Error fetching meetings:", error);
    throw error;
  }
};
