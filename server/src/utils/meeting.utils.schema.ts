import * as z from "zod"

const createMeetingSchema = z.object({
    title: z.string(),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    description: z.string().optional(),
    // tags: z.array(z.string()).optional(),
    tag: z.string().optional(),
    status: z.enum(["Scheduled", "Cancelled"]).default("Scheduled")
});

const updateMeetingSchema = createMeetingSchema.partial();

const mongoIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, {
  message: "Invalid MongoDB ObjectId",
});

type Meeting = z.infer<typeof createMeetingSchema>

export {createMeetingSchema, Meeting, updateMeetingSchema, mongoIdSchema}
