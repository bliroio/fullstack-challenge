// use client
"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { CreateMeetingModal } from "./components/createMeeting/createMeetingModal";
import { Header } from "./components/global/header";
import { MeetingsList } from "./components/meetingsList/meetingsList";
import { useHandleMeetingsList } from "./components/meetingsList/utils/useHandleMeetingsList";

const Home: React.FC = () => {
  const { meetings, handleSearchMeetings, refreshMeetings } =
    useHandleMeetingsList();
  const [showCreateMeetingModal, setShowCreateMeetingModal] = useState(false);

  const handleCreateNewMeeting = () => {
    setShowCreateMeetingModal(!showCreateMeetingModal);
  };

  const onSuccess = () => {
    // Close the modal after successful creation
    setShowCreateMeetingModal(false);
    // alert the user about the successful creation
    alert("Meeting created successfully!");
    // Refresh the meetings list
    refreshMeetings();
  };

  const onClose = () => {
    setShowCreateMeetingModal(false);
  };

  return (
    <>
      <Header
        onSearch={handleSearchMeetings}
        onMainClick={handleCreateNewMeeting}
      />
      <Wrapper>
        <Container>
          <MeetingsList meetings={meetings} />
        </Container>
      </Wrapper>
      {showCreateMeetingModal && (
        <CreateMeetingModal onSuccess={onSuccess} onClose={onClose} />
      )}
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
