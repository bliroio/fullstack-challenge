import { AppBar, Button, Toolbar } from "@mui/material";
import createMeetingIcon from "./icons/arrow-up-right-square.svg";

export default function Header() {
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
                <Button variant="contained" color="primary">
                    <img src={createMeetingIcon.src} alt="Create Meeting" style={{ height: 20, width: 20, marginRight: 8 }} />
                    Create Meeting
                </Button>
            </Toolbar>
        </AppBar>
    );
}