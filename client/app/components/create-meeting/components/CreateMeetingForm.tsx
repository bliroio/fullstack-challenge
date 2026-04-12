import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addHours } from "date-fns";
import { z } from "zod";
import type { Meeting } from "shared/schemas/meeting";

// Form-level schema: Date objects (what DateTimePicker produces)
const createMeetingFormSchema = z.object({
  title: z.string().min(1, "Meeting title is required").max(200, "Title must be under 200 characters"),
  startTime: z.date(),
  endTime: z.date(),
}).refine(
  (data) => data.startTime < data.endTime,
  { message: "End time must be after start time", path: ["endTime"] }
);

type CreateMeetingFormData = z.infer<typeof createMeetingFormSchema>;

interface CreateMeetingFormProps {
  onSubmit: (meeting: Omit<Meeting, "id">) => Promise<void>;
  onClose: () => void;
}

export const CreateMeetingForm = ({ onSubmit, onClose }: CreateMeetingFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateMeetingFormData>({
    resolver: zodResolver(createMeetingFormSchema),
    defaultValues: {
      title: "",
      startTime: new Date(),
      endTime: addHours(new Date(), 1),
    },
    mode: "onChange",
  });

  const onFormSubmit = async (data: CreateMeetingFormData) => {
    // Pass Date objects directly — the shared Meeting type uses Date for startTime/endTime.
    // axios will serialize them to ISO strings automatically via JSON.stringify.
    await onSubmit({
      title: data.title,
      startTime: data.startTime,
      endTime: data.endTime,
    });
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onFormSubmit)}
      sx={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column" }}
    >
      {errors.root && (
        <Alert severity="error" sx={{ marginBottom: "16px" }}>
          {errors.root.message}
        </Alert>
      )}

      <Stack spacing={3} sx={{ flex: 1 }}>
        {/* Title field */}
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500, marginBottom: "8px", color: "#374151" }}>
            Meeting title *
          </Typography>
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="Write your meeting title"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
              />
            )}
          />
        </Box>

        {/* Start time field */}
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500, marginBottom: "8px", color: "#374151" }}>
            Start time *
          </Typography>
          <Controller
            name="startTime"
            control={control}
            render={({ field, fieldState }) => (
              <DateTimePicker
                value={field.value}
                onChange={(newValue) => field.onChange(newValue)}
                inputRef={field.ref}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!fieldState.error,
                    helperText: fieldState.error?.message,
                    sx: { "& .MuiOutlinedInput-root": { borderRadius: "8px" } },
                  },
                }}
              />
            )}
          />
        </Box>

        {/* End time field */}
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500, marginBottom: "8px", color: "#374151" }}>
            End time *
          </Typography>
          <Controller
            name="endTime"
            control={control}
            render={({ field, fieldState }) => (
              <DateTimePicker
                value={field.value}
                onChange={(newValue) => field.onChange(newValue)}
                inputRef={field.ref}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!fieldState.error,
                    helperText: fieldState.error?.message,
                    sx: { "& .MuiOutlinedInput-root": { borderRadius: "8px" } },
                  },
                }}
              />
            )}
          />
        </Box>
      </Stack>

      {/* Action buttons */}
      <Box sx={{ display: "flex", gap: "12px", paddingTop: "24px", borderTop: "1px solid #E7E8E9", marginTop: "auto" }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            flex: 1, height: "44px", borderRadius: "8px", borderColor: "#D1D5DB",
            color: "#374151", textTransform: "none", fontWeight: 500,
            "&:hover": { borderColor: "#9CA3AF", backgroundColor: "#F9FAFB" },
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!isValid || isSubmitting}
          sx={{
            flex: 1, height: "44px", borderRadius: "8px", backgroundColor: "#F97316",
            color: "white", textTransform: "none", fontWeight: 500,
            "&:hover": { backgroundColor: "#EA580C" },
            "&:disabled": { backgroundColor: "#D1D5DB", color: "#9CA3AF" },
          }}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Box>
  );
};
