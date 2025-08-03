import { useState } from "react";
import { Meeting } from "../../../models/Meeting";
import { createMeeting } from "../../../services/meetingService";

interface CreateMeetingData {
  title: string;
  startTime: string;
  endTime: string;
}

export const useHandleCreateNewMeeting = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateMeeting = async (
    meetingData: CreateMeetingData
  ): Promise<Meeting | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (
        !meetingData.title ||
        !meetingData.startTime ||
        !meetingData.endTime
      ) {
        throw new Error("Title, start time, and end time are required");
      }

      // Validate that end time is after start time
      const startTime = new Date(meetingData.startTime);
      const endTime = new Date(meetingData.endTime);

      if (endTime <= startTime) {
        throw new Error("End time must be after start time");
      }

      // Create the meeting
      const newMeeting = await createMeeting(meetingData);
      return newMeeting;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to create meeting";
      setError(errorMessage);
      console.error("Error creating meeting:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleCreateMeeting,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};
