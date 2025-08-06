import React from 'react';
import {Meeting} from '@/app/models/Meeting';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';

const MeetingList: React.FC = async () => {
  const BASE_URL = process.env.BASE_API_URL;

  const meetingsResponse = await fetch(`${BASE_URL}/meetings`);
  const meetings: Meeting[] = await meetingsResponse.json();

  return (
    <Paper elevation={3}>
      <List>
        {meetings.map((meeting, index) => (
          <React.Fragment key={meeting.id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={meeting.title}
                secondary={
                  <>
                    {/*<div>Start: {formatDate(meeting.startTime)}</div>*/}
                    {/*<div>End: {formatDate(meeting.endTime)}</div>*/}
                  </>
                }
              />
            </ListItem>
            {index < meetings.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default MeetingList;
