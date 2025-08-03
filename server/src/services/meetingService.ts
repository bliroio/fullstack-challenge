import { PaginateResult } from "mongoose";
import Meeting, { IMeeting } from "../models/meeting";

const listMeetings = async (query: any): Promise<PaginateResult<IMeeting>> => {
  return Meeting.paginate(query);
};

export default { listMeetings };
