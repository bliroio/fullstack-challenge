'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { listMeetings } from '../services/meetingService';
import { Meeting } from '../models/Meeting';

interface CreateMeetingContextType {
  meetings: Meeting[];
  loading: boolean;
  error: string | null;
  refreshMeetings: () => Promise<void>;
}

const CreateMeetingContext = createContext<CreateMeetingContextType | undefined>(undefined);

interface CreateMeetingProviderProps {
  children: ReactNode;
}

export const CreateMeetingProvider: React.FC<CreateMeetingProviderProps> = ({ children }) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchMeetings = async () => {
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
  };

  const refreshMeetings = async () => {
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
  };

  useEffect(() => {
    // Fetch meetings only once when the app starts
    fetchMeetings();
  }, []);

  const value: CreateMeetingContextType = {
    meetings,
    loading,
    error,
    refreshMeetings,
  };

  return <CreateMeetingContext.Provider value={value}>{children}</CreateMeetingContext.Provider>;
};

export const useCreateMeeting = (): CreateMeetingContextType => {
  const context = useContext(CreateMeetingContext);
  if (context === undefined) {
    throw new Error('useCreateMeeting must be used within a CreateMeetingProvider');
  }
  return context;
};
