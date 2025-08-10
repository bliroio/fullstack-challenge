"use client";

// Home.tsx
import React, {useState} from "react";
import MeetingList from "./components/meetingList";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import styles from "@/app/page.module.css"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from "@/app/components/Header";

const theme = createTheme({
  typography: {
    fontFamily: [
      'Inter',
      'sans-serif',
    ].join(','),
  },
  palette: {
    primary: {
      main: '#F26835'
    }
  }
});

const Home: React.FC = () => {
  const [search, setSearch] = useState<string>("");

  return (
    <ThemeProvider theme={theme}>
      <Header onSearch={setSearch}/>
      <Container maxWidth={false}>
        <div className={styles.main}>
          <MeetingList search={search}/>
        </div>
      </Container>
    </ThemeProvider>
  );
};

export default Home;
