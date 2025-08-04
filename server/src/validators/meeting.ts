import { differenceInMinutes } from "date-fns";
import { z } from "zod";

const dateSchema = z.string().transform((val) => new Date(val));
export const createMeetingSchema = z.object({
    title: z.string().min(1),
    startTime: dateSchema,
    endTime: dateSchema,
}).refine(
    (data) => data.startTime < data.endTime,
    {
        message: "Start time must be before end time",
        path: ["startTime"],
    }
).refine(
    (data) => differenceInMinutes(data.endTime, data.startTime) <= 8 * 60,
    {
        message: "Meeting duration must be less than 8 hours",
        path: ["endTime"],
    }
);

export type CreateMeetingSchema = z.infer<typeof createMeetingSchema>;