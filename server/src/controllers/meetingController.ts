import * as meetingService from "../services/meetingService";
import type { Request, Response } from "express";
import type { IMeeting } from "../models/meeting";

type ApiErrorResponse = { message: string };

type ListMeetingsQuery = {
  page?: string;
  limit?: string;
  title?: string;
};

type CreateMeetingBody = {
  title: string;
  startTime: string;
  endTime: string;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return "Unexpected error";
};

export const listMeetings = async (
  req: Request<{}, unknown, undefined, ListMeetingsQuery>,
  res: Response
) => {
  try {
    const meetings = await meetingService.listMeetings(req.query);
    res.json(meetings);
  } catch (error: unknown) {
    res.status(500).json({ message: getErrorMessage(error) } satisfies ApiErrorResponse);
  }
};

export const createMeeting = async (
  req: Request<{}, unknown, CreateMeetingBody, undefined>,
  res: Response<IMeeting | ApiErrorResponse>
) => {
  try {
    const created = await meetingService.createMeeting(req.body);
    res.status(201).json(created);
  } catch (error: unknown) {
    // Validation/contract errors
    if (
      error instanceof Error &&
      (error.message.includes("required") ||
        error.message.includes("invalid") ||
        error.message.includes("after"))
    ) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: "Failed to create meeting" });
  }
};
