import axios from "axios";
import { Room } from "../models/Room";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
const ROOMS_URL = `${API_BASE_URL.replace(/\/$/, "")}/rooms`;

export const listRooms = async (): Promise<Room[]> => {
  try {
    const response = await axios.get<Room[]>(ROOMS_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};
