import mongoose from "mongoose";
import Meeting, { IMeeting } from "../models/meeting";

const listMeetings = async (
  query: any,
): Promise<mongoose.PaginateResult<IMeeting>> => {
  // Extract options if they exist
  const { options, ...filter } = query;
  
  // Call paginate with filter and options as separate parameters
  return Meeting.paginate(filter, options || {});
};

export default { listMeetings };
