import { differenceInMinutes } from "date-fns";
import { z } from "zod";
import { isEmailAllowed } from "../utils/emailAllowlist";

const dateSchema = z.string().transform((val) => new Date(val));

const isOn15MinInterval = (date: Date): boolean => {
  return date.getMinutes() % 15 === 0 && date.getSeconds() === 0;
};

export const createMeetingSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    startTime: dateSchema,
    endTime: dateSchema,
    roomId: z.string().min(1, "Room is required"),
    bookedBy: z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email address"),
    }),
  })
  .refine((data) => isOn15MinInterval(data.startTime), {
    message: "Start time must be on a 15-minute interval",
    path: ["startTime"],
  })
  .refine((data) => isOn15MinInterval(data.endTime), {
    message: "End time must be on a 15-minute interval",
    path: ["endTime"],
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "Start time must be before end time",
    path: ["startTime"],
  })
  .refine(
    (data) => differenceInMinutes(data.endTime, data.startTime) >= 15,
    {
      message: "Meeting must be at least 15 minutes",
      path: ["endTime"],
    },
  )
  .refine(
    (data) => differenceInMinutes(data.endTime, data.startTime) <= 8 * 60,
    {
      message: "Meeting duration must be less than 8 hours",
      path: ["endTime"],
    },
  )
  .refine(
    (data) => isEmailAllowed(data.bookedBy.email),
    {
      message: "This email address is not allowed to book meetings",
      path: ["bookedBy", "email"],
    },
  );

export type CreateMeetingSchema = z.infer<typeof createMeetingSchema>;
