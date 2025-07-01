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
import { Meeting, CreateMeeting } from '../models/Meeting';
import { createMeeting, listMeetings } from '../services/meetingService';

interface LoadingState {
  loading: boolean;
  error: string | null;
}

interface MeetingContextType {
  meetings: Meeting[];
  loadingState: LoadingState;
  creationState: LoadingState;
  refreshMeetings: () => Promise<void>;
  addMeeting: (meeting: CreateMeeting) => Promise<void>;
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

interface CreateMeetingProviderProps {
  children: ReactNode;
}

export const MeetingProvider: React.FC<CreateMeetingProviderProps> = ({ children }) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>({ loading: true, error: null });
  const [creationState, setCreationState] = useState<LoadingState>({ loading: false, error: null });

  const fetchMeetings = useCallback(
    async (forceRefresh = false) => {
      // Don't fetch if we already have data and not forcing refresh
      if (!forceRefresh && !loadingState.loading && meetings.length > 0) {
        return;
      }

      try {
        setLoadingState((prev) => ({ ...prev, loading: true }));
        const response = await listMeetings();
        setMeetings(response.docs);
        setLoadingState({ loading: false, error: null });
      } catch (err) {
        console.error('Error fetching meetings:', err);
        const errorMessage = 'Failed to fetch meetings: ' + JSON.stringify(err);
        setLoadingState({ loading: false, error: errorMessage });
        throw new Error(errorMessage);
      }
    },
    [meetings, loadingState.loading]
  );

  const addMeeting = useCallback(
    async (meeting: CreateMeeting) => {
      try {
        setCreationState((prev) => ({ ...prev, loading: true }));
        await createMeeting(meeting);
        await fetchMeetings(true); // Force refresh after creating
        setCreationState({ loading: false, error: null });
      } catch (err) {
        console.error('Error creating meeting:', err);
        setCreationState({
          loading: false,
          error: 'Failed to create meeting: ' + JSON.stringify(err),
        });
      }
    },
    [fetchMeetings]
  );

  const refreshMeetings = useCallback(async () => {
    await fetchMeetings(true); // Force refresh
  }, [fetchMeetings]);

  useEffect(() => {
    // Fetch meetings only once when the app starts
    fetchMeetings();
  }, []);

  const value: MeetingContextType = {
    meetings,
    loadingState,
    creationState,
    refreshMeetings,
    addMeeting,
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
