"use client";
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {createMeeting} from "@/app/services/meetingService";

interface Props {
    setDrawerToggle: (value: boolean) => void;
    onCreated: () => void;
}

export const CreateMeeting = ({ setDrawerToggle, onCreated }: Props) => {
    // Form state
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");
    const [description, setDescription] = useState("");

    // Error state
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleSubmit = (e: React.FormEvent) => {
        
        e.preventDefault();
        const newErrors: { [key: string]: string } = {};
        if (!title) newErrors.title = "Title is required";
        if (!startDate) newErrors.startDate = "Start date is required";
        if (!startTime) newErrors.startTime = "Start time is required";
        if (!endDate) newErrors.endDate = "End date is required";
        if (!endTime) newErrors.endTime = "End time is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Combine date and time fields into ISO strings
        const start = startDate && startTime ? new Date(`${startDate}T${startTime}`) : null;
        const end = endDate && endTime ? new Date(`${endDate}T${endTime}`) : null;

        createMeeting({
            title,
            startTime: start, //? start.toISOString() : ""
            endTime: end, //? end.toISOString() : ""
            description,
        }).then(() => {
            onCreated();
            // Optionally reset form and close drawer
            setTitle("");
            setStartDate("");
            setStartTime("");
            setEndDate("");
            setEndTime("");
            setDescription("");
            setErrors({});
            setDrawerToggle(false);
        });
        
    
    };

    const handleCancel = () => {
        setDrawerToggle(false);
    };

    return (
        <Box sx={{ width: 350, p: 3 }}>
            {/* Cross button */}
            <IconButton
                aria-label="close"
                onClick={handleCancel}
                sx={{ position: "absolute", top: 8, right: 8 }}
            >
                <CloseIcon />
            </IconButton>
            <Typography variant="h6" gutterBottom>
                Create a new meeting
            </Typography>
            <Typography variant="caption" gutterBottom>
                Complete the information below in order to create a new meeting.
            </Typography>
            <form onSubmit={handleSubmit} noValidate>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Title*</Typography>
                    <TextField
                        value={title}
                        placeholder="Write your meeting title"
                        onChange={e => {
                            setTitle(e.target.value);
                            setErrors(prev => ({ ...prev, title: "" }));
                        }}
                        fullWidth
                        required
                        margin="none"
                        size="small"
                        error={!!errors.title}
                        helperText={errors.title}
                    />
                </Box>
                <Typography variant="subtitle2" sx={{ mb: 0.5, mt: 2 }}>Start Time*</Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                        type="date"
                        value={startDate}
                        onChange={e => {
                            setStartDate(e.target.value);
                            setErrors(prev => ({ ...prev, startDate: "" }));
                        }}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        required
                        size="small"
                        error={!!errors.startDate}
                        helperText={errors.startDate}
                    />
                    <TextField
                        type="time"
                        value={startTime}
                        onChange={e => {
                            setStartTime(e.target.value);
                            setErrors(prev => ({ ...prev, startTime: "" }));
                        }}
                        fullWidth
                        required
                        size="small"
                        error={!!errors.startTime}
                        helperText={errors.startTime}
                    />
                </Box>
                <Typography variant="subtitle2" sx={{ mb: 0.5, mt: 2 }}>End Date*</Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                        type="date"
                        value={endDate}
                        onChange={e => {
                            setEndDate(e.target.value);
                            setErrors(prev => ({ ...prev, endDate: "" }));
                        }}
                        fullWidth
                        required
                        size="small"
                        error={!!errors.endDate}
                        helperText={errors.endDate}
                        
                        inputProps={{ min: startDate || undefined }}
                    />
                    <TextField
                        type="time"
                        value={endTime}
                        onChange={e => {
                            setEndTime(e.target.value);
                            setErrors(prev => ({ ...prev, endTime: "" }));
                        }}
                        fullWidth
                        required
                        size="small"
                        error={!!errors.endTime}
                        helperText={errors.endTime}
                        inputProps={{
                            min: endDate === startDate && startTime ? startTime : undefined,
                        }}
                    />
                </Box>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Description</Typography>
                    <TextField
                        value={description}
                        placeholder="Write any notes regarding the meeting"
                        onChange={e => setDescription(e.target.value)}
                        fullWidth
                        multiline
                        minRows={3}
                        margin="none"
                        size="small"
                    />
                </Box>
                {/* Action buttons at the bottom */}
                <Box sx={{ display: "flex", gap: 1, mt: 10 }}>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        // onClick={handleSubmit}
                    >
                        Create
                    </Button>
                </Box>
            </form>
        </Box>
    );
}