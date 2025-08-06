import React from 'react';
import Typography from '@mui/material/Typography';
import MeetingList from '@/app/components/MeetingList';
import {Container} from '@mui/material';

const Home: React.FC = () => {
  return (
    <Container maxWidth={'md'}>
      <Typography variant="h2" gutterBottom>
        Meetings
      </Typography>
      <MeetingList />
    </Container>
  );
};

export default Home;
