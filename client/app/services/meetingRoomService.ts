import axios from "axios";
import { MeetingRoom } from "../models/MeetingRoom";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export type AvailabilityResponse = {
  date: string;
  businessHours: { start: string; end: string };
  bookedSlots: { start: string; end: string }[];
};

export const listRooms = async (): Promise<MeetingRoom[]> => {
  const response = await axios.get<MeetingRoom[]>(`${API_BASE_URL}/rooms`);
  return response.data;
};

export const getRoomById = async (id: string): Promise<MeetingRoom> => {
  const response = await axios.get<MeetingRoom>(`${API_BASE_URL}/rooms/${id}`);
  return response.data;
};

export const getRoomAvailability = async (
  roomId: string,
  date: string,
): Promise<AvailabilityResponse> => {
  const response = await axios.get<AvailabilityResponse>(
    `${API_BASE_URL}/rooms/${roomId}/availability?date=${date}`,
  );
  return response.data;
};
