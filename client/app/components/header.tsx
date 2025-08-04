import { AppBar, Button, Drawer, Toolbar } from "@mui/material";
import { useState } from "react";
import { Meeting } from "../models/Meeting";
import { CreateMeetingModal } from "./create-meeting-modal";
import createMeetingIcon from "./icons/arrow-up-right-square.svg";

type Props = {
    onCreateMeeting: (meeting: Omit<Meeting, "id">) => Promise<void>;
}
export default function Header({ onCreateMeeting }: Props) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const handleCreateMeeting = async (meeting: Omit<Meeting, "id">) => {
        try {
            await onCreateMeeting(meeting);
            setDrawerOpen(false);
        } catch (error) {
            console.error("Error creating meeting:", error);
        }
    }
    return (
        <AppBar position="static">
            <Toolbar sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}>
                <img
                    src="/bliro_logo.svg"
                    alt="Bliro Logo"
                    style={{ height: 24 }}
                />
                <>
                    <Button variant="contained" color="primary" onClick={() => setDrawerOpen(true)}>
                        <img src={createMeetingIcon.src} alt="Create Meeting" style={{ height: 20, width: 20, marginRight: 8 }} />
                        Create Meeting
                    </Button>
                    <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                        <CreateMeetingModal onClose={() => setDrawerOpen(false)} onCreateMeeting={handleCreateMeeting} />
                    </Drawer>
                </>
            </Toolbar>
        </AppBar>
    );
}