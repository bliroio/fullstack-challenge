import {Meeting} from "@/app/models/Meeting";
import {Box, Button, Drawer, Stack, TextField, Typography } from "@mui/material";
import {FormEvent, useEffect, useState } from "react";

type Props = {
    open: boolean;
    onClose: () => void;
    onCreateMeeting: (meeting: Omit<Meeting, "id">) => Promise<void>;
};

const CreateMeetingDrawer = ({ open, onClose, onCreateMeeting }: Props) => {
    const [title, setTitle] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const reset = () => {
        setTitle("");
        setStartTime("");
        setEndTime("");
    }

    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open]);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        try {
            await onCreateMeeting({ title, startTime, endTime });
        } catch(error) {
            reset();
        }
    };

    return (
      <>
        <Drawer anchor="bottom" open={open} onClose={onClose}>
            <Box
                sx={{
                    p: 3,
                    minWidth: { xs: '100%', sm: 500 },
                    margin: '0 auto',
                    boxSizing: 'border-box'
                }}
            >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h6" component="h2">
                        Create a New Meeting
                    </Typography>
                </Stack>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Meeting Title"
                            variant="outlined"
                            fullWidth
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <TextField
                            label="Start Time"
                            type="datetime-local"
                            variant="outlined"
                            fullWidth
                            required
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="End Time"
                            type="datetime-local"
                            variant="outlined"
                            fullWidth
                            required
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                            >
                                Create Meeting
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={onClose}
                                fullWidth
                            >
                                Cancel
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </Box>
        </Drawer>
      </>
    );
};

export default CreateMeetingDrawer;