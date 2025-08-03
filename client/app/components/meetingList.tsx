"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import BliroLogo from "../assets/svgs/bliroLogo.svg";
import { Meeting } from "../models/Meeting";
import { listMeetings } from "../services/meetingService";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat("default", {
    dateStyle: "long",
    timeStyle: "short",
  });
  return formatter.format(date);
};

const MeetingList: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    listMeetings().then(setMeetings);
  }, []);

  return (
    <StyledPaper>
      <BliroLogo />
      <StyledList>
        {meetings.map((meeting, index) => (
          <React.Fragment key={meeting.id}>
            <StyledListItem>
              <StyledListItemText>
                <PrimaryText>{meeting.title}</PrimaryText>
                <SecondaryText>
                  <div>Start: {formatDate(meeting.startTime)}</div>
                  <div>End: {formatDate(meeting.endTime)}</div>
                </SecondaryText>
              </StyledListItemText>
            </StyledListItem>
            {index < meetings.length - 1 && <StyledDivider />}
          </React.Fragment>
        ))}
      </StyledList>
    </StyledPaper>
  );
};

export default MeetingList;

const StyledPaper = styled.div`
  background: white;
  border-radius: 4px;
  box-shadow:
    0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14),
    0px 1px 3px 0px rgba(0, 0, 0, 0.12);
  overflow: hidden;
`;

const StyledList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const StyledListItem = styled.li`
  padding: 16px;
  display: flex;
  align-items: flex-start;
`;

const StyledListItemText = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const PrimaryText = styled.div`
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.87);
  margin-bottom: 4px;
`;

const SecondaryText = styled.div`
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.43;
  color: rgba(0, 0, 0, 0.6);
`;

const StyledDivider = styled.hr`
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  margin: 0;
  margin-left: 72px;
`;
