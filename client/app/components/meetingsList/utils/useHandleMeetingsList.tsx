import { Meeting } from "@/app/models/Meeting";
import { listMeetings } from "@/app/services/meetingService";
import { useEffect, useState } from "react";

export const useHandleMeetingsList = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [originalMeetings, setOriginalMeetings] = useState<Meeting[]>([]);

  const fetchMeetings = async () => {
    try {
      const fetchedMeetings = await listMeetings();
      setMeetings(fetchedMeetings);
      setOriginalMeetings(fetchedMeetings);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  const handleSearchMeetings = (searchTerm: string) => {
    if (!searchTerm) {
      setMeetings(originalMeetings);
      return;
    }
    const filteredMeetings = originalMeetings.filter((meeting) =>
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setMeetings(filteredMeetings);
  };

  const refreshMeetings = () => {
    fetchMeetings();
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  return { meetings, handleSearchMeetings, refreshMeetings };
};
