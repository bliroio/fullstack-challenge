import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/meetings";

export const listMeetings = async (page: number = 1, limit: number = 5) => {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: { page, limit },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching meetings:", error);
    throw error;
  }
};
