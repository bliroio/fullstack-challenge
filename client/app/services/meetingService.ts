import axios from "axios";
import { Meeting } from "../models/Meeting";
import {Paginate} from "../models/Paginate";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

interface PaginatedMeetings {
  upcomingMeetings: Paginate<Meeting>;
  pastMeetings: Paginate<Meeting>;
}

export const listMeetings = async (params = {}): Promise<PaginatedMeetings> => {
  try {
    const query = new URLSearchParams(params).toString();
    const listURL = `${API_BASE_URL}/meetings?${query}`;
    const response = await axios.get<PaginatedMeetings>(listURL);
    return response.data;
  } catch (error) {
    // console.error("Error fetching meetings:", error);
    throw error;
  }
};
