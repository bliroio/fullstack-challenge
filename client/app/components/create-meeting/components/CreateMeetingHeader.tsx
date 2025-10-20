import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Typography } from "@mui/material";

interface DrawerHeaderProps {
  onClose: () => void;
}

export const CreateMeetingHeader = ({ onClose }: DrawerHeaderProps) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Box
      sx={{
        padding: "24px",
        borderBottom: "1px solid #E7E8E9",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            fontSize: "20px",
            lineHeight: "28px",
            marginBottom: "8px",
          }}
        >
          Create a new meeting
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#6B7280",
            fontSize: "14px",
            lineHeight: "20px",
          }}
        >
          Complete the information below in order to create a new meeting.
        </Typography>
      </Box>
      <IconButton
        onClick={handleClose}
        sx={{
          color: "#6B7280",
          "&:hover": {
            backgroundColor: "#F3F4F6",
          },
        }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
};
