import { Button, Typography } from "@mui/material";
import { differenceInMinutes } from "date-fns";
import { useMemo, useState } from "react";
import { Meeting } from "../models/Meeting";
import { DateTimePicker } from "./date-time-picker";
import { TextInput } from "./text-input";

type Props = {
    onClose: () => void;
    onCreateMeeting: (meeting: Omit<Meeting, "id">) => void;
}
export const CreateMeetingModal = ({ onClose, onCreateMeeting }: Props) => {
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [error, setError] = useState('');

    const isValid = useMemo(() => {
        return title.length > 0 && startTime < endTime;
    }, [title, startTime, endTime]);

    const handleCreateMeeting = () => {
        setError('');

        if (!title.length) {
            setError("Title is required");
            return;
        }
        if (!startTime || !endTime) {
            setError("Start and end time are required");
            return;
        }
        if (startTime >= endTime) {
            setError("Start time must be before end time");
            return;
        }

        // meeting should be at most 8 hours long
        const duration = differenceInMinutes(endTime, startTime);
        if (duration > 8 * 60) {
            setError("Meeting duration must be less than 8 hours");
            return;
        }

        onCreateMeeting({
            title,
            startTime: startTime.toISOString(), endTime: endTime.toISOString()
        });
    }

    return (
        <div style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h4">Create a new meeting</Typography>
                <Typography variant="h5" style={{ marginTop: '8px', marginBottom: '32px' }}>Complete the information below in order to create a new meeting.</Typography>
                <TextInput label="Meeting title" placeholder="Enter meeting title" value={title} onChange={setTitle} required />
                <DateTimePicker label="Start time" value={startTime} onChange={setStartTime} style={{ marginTop: '32px' }} required />
                <DateTimePicker label="End time" value={endTime} onChange={setEndTime} style={{ marginTop: '32px' }} required />
            </div>
            {error && <Typography variant="h6" style={{ color: '#F43641' }}>{error}</Typography>}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '16px',
                marginTop: '32px',
                padding: '32px',
                borderTop: '1px solid #E7E8E9'

            }}>
                <Button style={{ flex: 1 }} variant="outlined" color="secondary" onClick={onClose}>Cancel</Button>
                <Button style={{ flex: 1 }} variant="contained" color="primary" onClick={handleCreateMeeting}>Create</Button>
            </div>
        </div>
    );
};