'use client';

import React from 'react';
import MeetingList from '../MeetingList/meetingList';
import CreateMeetingDrawer from '../CreateMeetingDrawer/CreateMeetingDrawer';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const CreateMeetingPage: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container maxWidth='md'>
        <Typography variant='h2' gutterBottom>
          Meetings
        </Typography>
        <MeetingList />
      </Container>
      <CreateMeetingDrawer open={true} />
    </Box>
  );
};

export default CreateMeetingPage;
