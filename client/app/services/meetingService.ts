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
    throw error;
  }
};

export const createMeeting = async (data = {}): Promise<Meeting> => {
  try {
    const createURL = `${API_BASE_URL}/meetings`;
    const response = await axios.post<Meeting>(createURL, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const cancelMeeting = async (id: string) => {
  try {
    const cancelURL = `${API_BASE_URL}/meetings/${id}`;
    const response = await axios.put<Meeting>(cancelURL, {status: "Cancelled"});
    return response.data;
  } catch (error) {
    throw error;
  }
}