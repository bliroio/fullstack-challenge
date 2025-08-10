"use client";

// Home.tsx
import React from "react";
import MeetingList from "./components/meetingList";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import styles from "@/app/page.module.css"

const Home: React.FC = () => {
  return (
    <Container maxWidth={false}>
      <div className={styles.main}>
        <MeetingList />
      </div>
    </Container>
  );
};

export default Home;
