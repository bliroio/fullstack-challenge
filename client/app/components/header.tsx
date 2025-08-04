import { AppBar, Button, Drawer, Toolbar } from "@mui/material";
import { useState } from "react";
import { CreateMeetingModal } from "./create-meeting-modal";
import createMeetingIcon from "./icons/arrow-up-right-square.svg";

export default function Header() {
    const [drawerOpen, setDrawerOpen] = useState(false);
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
                        <CreateMeetingModal onClose={() => setDrawerOpen(false)} />
                    </Drawer>
                </>
            </Toolbar>
        </AppBar>
    );
}