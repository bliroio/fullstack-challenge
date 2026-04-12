import {
  AppBar,
  Toolbar,
  Button,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Meeting } from "shared/schemas/meeting";
import CreateMeetingDrawer from "./create-meeting/components/CreateMeetingDrawer";
import SearchIcon from "@mui/icons-material/Search";

type Props = {
  onCreateMeeting: (meeting: Omit<Meeting, "id">) => Promise<void>;
  onSearch: (query: string) => void;
  meetingToEdit?: Meeting | null;
  onDrawerClose?: () => void;
};
export default function Header({ onCreateMeeting, onSearch, meetingToEdit, onDrawerClose }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (meetingToEdit) {
      setDrawerOpen(true);
    }
  }, [meetingToEdit]);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        onSearch(value);
      }, 300);
    },
    [onSearch]
  );

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    onDrawerClose?.();
  };

  const handleCreateMeeting = async (meeting: Omit<Meeting, "id">) => {
    try {
      await onCreateMeeting(meeting);
      handleDrawerClose();
    } catch (error) {
      console.error("Error creating meeting:", error);
    }
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{ backgroundColor: "white", boxShadow: "none" }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            borderBottom: "1px solid #E7E8E9",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <img
              src="/bliro_logo.svg"
              alt="Bliro Logo"
              style={{ height: 24 }}
            />
            <TextField
              placeholder="Search..."
              size="small"
              onChange={handleSearchChange}
              sx={{
                width: "300px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#F9FAFB",
                  "& fieldset": {
                    borderColor: "#E7E8E9",
                  },
                  "&:hover fieldset": {
                    borderColor: "#D1D5DB",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#F97316",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#6B7280", fontSize: "20px" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Button
            variant="contained"
            onClick={() => setDrawerOpen(true)}
            sx={{
              backgroundColor: "#F97316",
              color: "white",
              textTransform: "none",
              fontWeight: 500,
              borderRadius: "8px",
              padding: "8px 16px",
              "&:hover": {
                backgroundColor: "#EA580C",
              },
            }}
          >
            Create Meeting
          </Button>
        </Toolbar>
      </AppBar>

      <CreateMeetingDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        onCreateMeeting={handleCreateMeeting}
        meetingToEdit={meetingToEdit || undefined}
      />
    </>
  );
}
