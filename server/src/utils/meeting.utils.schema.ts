import * as z from "zod"

const createMeetingSchema = z.object({
    title: z.string(),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    description: z.string().optional()
});

type Meeting = z.infer<typeof createMeetingSchema>

export {createMeetingSchema, Meeting}
