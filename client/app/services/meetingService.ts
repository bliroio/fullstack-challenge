import axios from "axios";
import { Meeting } from "../models/Meeting";

// Env should contain only the API host, e.g. `http://localhost:3000`.
// For backward compatibility, if `NEXT_PUBLIC_API_BASE_URL` includes `/api/meetings`,
// we strip it and still construct the correct endpoint.
const API_HOST =
  process.env.NEXT_PUBLIC_API_HOST ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:3000";

const normalizedApiHost = API_HOST
  .replace(/\/$/, "")
  .replace(/\/api\/meetings\/?$/, "");

const MEETINGS_API_URL = `${normalizedApiHost}/api/meetings`;

type ApiMeetingDoc = {
  _id?: string;
  id?: string;
  title?: string;
  startTime?: string | Date;
  endTime?: string | Date;
};

type PaginatedResponse = {
  docs: ApiMeetingDoc[];
  totalDocs: number;
  limit: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  page: number;
  totalPages: number;
  offset: number;
  prevPage: number | null;
  nextPage: number | null;
  pagingCounter: number;
};

const toMeeting = (doc: ApiMeetingDoc): Meeting | null => {
  const id = doc.id ?? doc._id;
  if (!id || !doc.title || !doc.startTime || !doc.endTime) return null;

  const start = new Date(doc.startTime);
  const end = new Date(doc.endTime);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

  return {
    id,
    title: doc.title,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  };
};
export const listMeetings = async (): Promise<Meeting[]> => {
  try {
    const response = await axios.get<PaginatedResponse>(
      MEETINGS_API_URL + "?limit=100"
    );
    return response.data.docs.map(toMeeting).filter((m): m is Meeting => m !== null);
  } catch (error) {
    console.error("Error fetching meetings:", error);
    throw error;
  }
};

export const createMeeting = async (meeting: Omit<Meeting, "id">) => {
  try {
    const response = await axios.post(MEETINGS_API_URL, meeting);
    return response.data;
  } catch (error) {
    console.error("Error creating meeting:", error);
    throw error;
  }
};
