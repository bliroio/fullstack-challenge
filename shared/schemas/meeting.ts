import { z } from "zod";

// --- Base meeting schema (represents a meeting as returned by the API) ---

export const meetingSchema = z.object({
  id: z.string(),
  title: z.string(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
});

export type Meeting = z.infer<typeof meetingSchema>;

// --- Schema for creating a new meeting (no id, validated inputs) ---

export const createMeetingSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title must be 200 characters or fewer"),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
  })
  .strict()
  .refine((data: { startTime: Date; endTime: Date }) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export type CreateMeetingInput = z.infer<typeof createMeetingSchema>;

// --- Schema for list/query parameters ---

export const listQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    sortBy: z.enum(["startTime", "endTime", "title"]).default("startTime"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
    title: z.string().max(200).optional(),
  })
  .strict();

export type ListQueryParams = z.infer<typeof listQuerySchema>;
