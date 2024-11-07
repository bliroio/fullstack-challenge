'use client'

import React, { useEffect, useState } from 'react';
import MeetingList from './components/MeetingList';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Header from "@/app/components/Header";
import { Meeting } from "@/app/models/Meeting";
import { listMeetings, MeetingResponse } from "@/app/services/meetingService";
import { useDebounce } from 'use-debounce';

const LIMIT = Number(process.env.NEXT_MEETING_LIMIT || 12);

const Home: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [metadata, setMetadata] = useState<Omit<MeetingResponse, 'docs'> | null>(null);
  const [search, setSearch] = useState<string>('');
  const [title] = useDebounce(search, 1000);

  useEffect(() => {
    listMeetings({ offset: 0, limit: LIMIT, title }).then((result) => {
      const { docs, ...rest } = result;
      setMeetings(docs);
      setMetadata(rest);
    });
  }, [title]);

  const handleLoadMore = () => {
    if (metadata?.nextPage) {
      const offset = (metadata.nextPage - 1) * LIMIT;

      listMeetings({ offset, limit: LIMIT, title }).then((result) => {
        const { docs, ...rest } = result;
        setMeetings([...meetings, ...docs]);
        setMetadata(rest);
      });
    }
  };

  return (
    <>
      <Header search={search} onChangeSearch={setSearch} />
      <Container maxWidth="md" sx={{ paddingTop: 4, paddingBottom: 10 }}>
        <Typography
          variant="h5"
          component="h1"
          fontWeight="bold"
          marginBottom={1.5}
        >
          Meetings
        </Typography>
        <MeetingList
          meetings={meetings}
          hasMore={metadata?.nextPage !== null}
          onNext={handleLoadMore}
        />
      </Container>
    </>
  );
};

export default Home;
