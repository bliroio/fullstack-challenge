'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
// import { createMeeting, listMeetings } from '../services/meetingService';x
import { Meeting } from '../models/Meeting';
import { createMeeting, listMeetings } from '../services/meetingService';

interface MeetingContextType {
  meetings: Meeting[];
  loading: boolean;
  error: string | null;
  refreshMeetings: () => Promise<void>;
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

interface CreateMeetingProviderProps {
  children: ReactNode;
}

export const CreateMeetingProvider: React.FC<CreateMeetingProviderProps> = ({ children }) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchMeetings = useCallback(async () => {
    // Don't fetch if we already have data
    if (hasLoaded && meetings.length > 0) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await listMeetings();
      setMeetings(response.docs);
      setHasLoaded(true);
    } catch (err) {
      console.error('Error fetching meetings:', err);
      setError('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  }, [meetings, hasLoaded]);

  const addMeeting = useCallback(async (meeting: Meeting) => {
    try {
      const response = await createMeeting(meeting);
      setMeetings((prev) => [...prev, response]);
    } catch (err) {
      console.error('Error creating meeting:', err);
      setError('Failed to create meeting');
    }
  }, []);

  const refreshMeetings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await listMeetings();
      setMeetings(response.docs);
    } catch (err) {
      console.error('Error refreshing meetings:', err);
      setError('Failed to refresh meetings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch meetings only once when the app starts
    fetchMeetings();
  }, []);

  const value: MeetingContextType = {
    meetings,
    loading,
    error,
    refreshMeetings,
  };

  return <MeetingContext.Provider value={value}>{children}</MeetingContext.Provider>;
};

export const useMeeting = (): MeetingContextType => {
  const context = useContext(MeetingContext);
  if (context === undefined) {
    throw new Error('useMeeting must be used within a MeetingProvider');
  }
  return context;
};
