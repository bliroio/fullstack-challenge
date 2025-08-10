import { IMeeting } from "../models/meeting";
import { createMeetingSchema, Meeting } from "./meeting.utils.schema";

import z, { ZodError } from "zod";

const validateCreateMeeting = (data: unknown): Meeting => {
    try {
        return createMeetingSchema.parse(data);
    } catch (error: any) {
        if(error instanceof ZodError){
            throw new Error(error.message)
        } 
        throw new Error("Bad Request");
    }
}

export {validateCreateMeeting}