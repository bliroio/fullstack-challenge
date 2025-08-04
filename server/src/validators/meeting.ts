import { z } from "zod";

const dateSchema = z.string().transform((val) => new Date(val));
export const createMeetingSchema = z.object({
    title: z.string().min(1),
    startTime: dateSchema,
    endTime: dateSchema,
});

export type CreateMeetingSchema = z.infer<typeof createMeetingSchema>;