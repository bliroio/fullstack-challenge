import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useCreateMeetingForm } from "../hooks/useCreateMeetingForm";
import { Meeting } from "../../../models/Meeting";

interface CreateMeetingFormProps {
  onSubmit: (meeting: Omit<Meeting, "id">) => Promise<void>;
  onClose: () => void;
}

export const CreateMeetingForm = ({
  onSubmit,
  onClose,
}: CreateMeetingFormProps) => {
  const {
    formData,
    errors,
    isSubmitting,
    isFormValid,
    handleSubmit,
    handleClose,
    updateField,
  } = useCreateMeetingForm({ onSubmit, onClose });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        flex: 1,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {errors.general && (
        <Alert severity="error" sx={{ marginBottom: "16px" }}>
          {errors.general}
        </Alert>
      )}

      <Stack spacing={3} sx={{ flex: 1 }}>
        <Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              marginBottom: "8px",
              color: "#374151",
            }}
          >
            Meeting title *
          </Typography>
          <TextField
            fullWidth
            placeholder="Write your meeting title"
            value={formData.title}
            onChange={(e) => updateField("title", e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
        </Box>

        <Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              marginBottom: "8px",
              color: "#374151",
            }}
          >
            Start time *
          </Typography>
          <DateTimePicker
            value={formData.startTime}
            onChange={(newValue) => updateField("startTime", newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!errors.startTime,
                helperText: errors.startTime,
                sx: {
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                },
              },
            }}
          />
        </Box>

        <Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              marginBottom: "8px",
              color: "#374151",
            }}
          >
            End time *
          </Typography>
          <DateTimePicker
            value={formData.endTime}
            onChange={(newValue) => updateField("endTime", newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!errors.endTime,
                helperText: errors.endTime,
                sx: {
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                },
              },
            }}
          />
        </Box>
      </Stack>

      <Box
        sx={{
          display: "flex",
          gap: "12px",
          paddingTop: "24px",
          borderTop: "1px solid #E7E8E9",
          marginTop: "auto",
        }}
      >
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            flex: 1,
            height: "44px",
            borderRadius: "8px",
            borderColor: "#D1D5DB",
            color: "#374151",
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              borderColor: "#9CA3AF",
              backgroundColor: "#F9FAFB",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!isFormValid || isSubmitting}
          sx={{
            flex: 1,
            height: "44px",
            borderRadius: "8px",
            backgroundColor: "#F97316",
            color: "white",
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "#EA580C",
            },
            "&:disabled": {
              backgroundColor: "#D1D5DB",
              color: "#9CA3AF",
            },
          }}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Box>
  );
};
