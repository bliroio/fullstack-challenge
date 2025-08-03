// use client
"use client";

import React from "react";
import styled from "styled-components";
import { Header } from "./components/global/header";
import { MeetingsList } from "./components/meetingsList/meetingsList";
import { useHandleMeetingsList } from "./components/meetingsList/utils/useHandleMeetingsList";

const Home: React.FC = () => {
  const { meetings, handleSearchMeetings } = useHandleMeetingsList();

  return (
    <>
      <Header onSearch={handleSearchMeetings} />
      <Wrapper>
        <Container>
          <MeetingsList meetings={meetings} />
        </Container>
      </Wrapper>
    </>
  );
};

export default Home;

const Wrapper = styled.div`
  padding-top: 94px; // header-height + 30px
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Container = styled.div`
  max-width: 1137px;
  width: 100%;
`;
