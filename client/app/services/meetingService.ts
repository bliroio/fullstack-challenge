import axios from "axios";
import { Meeting } from "../models/Meeting";
import {Paginate} from "../models/Paginate";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const listMeetings = async (): Promise<Paginate<Meeting>> => {
  try {
    const listUrl = `${API_BASE_URL}/meetings`
    const response = await axios.get<Paginate<Meeting>>(listUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching meetings:", error);
    throw error;
  }
};
