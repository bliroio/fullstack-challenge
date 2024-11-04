'use client'

// Home.tsx
import React from 'react';
import MeetingList from './components/meetingList';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const Home: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h2" gutterBottom>
        Meetings
      </Typography>
      <MeetingList />
    </Container>
  );
};

export default Home;
