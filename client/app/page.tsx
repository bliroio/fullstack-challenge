"use client";

// Home.tsx
import React, {useState} from "react";
import MeetingList from "./components/meetingList";
import Container from "@mui/material/Container";
import styles from "@/app/page.module.css"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from "@/app/components/Header";
import Drawer from '@mui/material/Drawer';
import { CreateMeeting } from "./components/CreateMeeting";

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
  const [drawerToggle, setDrawerToggle] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const triggerRefresh = () => setRefresh(r => r + 1);

  return (
    <ThemeProvider theme={theme}>
      <Header onSearch={setSearch} setDrawerToggle={setDrawerToggle} drawerToggle={drawerToggle}/>
      <Drawer
        anchor="right"
        open={drawerToggle}
        onClose={() => setDrawerToggle(false)}
      >
        <CreateMeeting setDrawerToggle={setDrawerToggle} onCreated={triggerRefresh}/>
      </Drawer>
      <Container maxWidth={false}>
        <div className={styles.main}>
          <MeetingList search={search} refresh={refresh}/>
        </div>
      </Container>
    </ThemeProvider>
  );
};

export default Home;
