"use client";

// Home.tsx
import React from "react";
import styled from "styled-components";
import MeetingList from "./components/meetingList";

const Home: React.FC = () => {
  return (
    <StyledContainer>
      <StyledTitle>Meetings</StyledTitle>
      <MeetingList />
    </StyledContainer>
  );
};

export default Home;

const StyledContainer = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
`;

const StyledTitle = styled.h2`
  font-size: 3.75rem;
  font-weight: 300;
  line-height: 1.2;
  letter-spacing: -0.00833em;
  margin: 0 0 16px 0;
  color: rgba(0, 0, 0, 0.87);
`;
