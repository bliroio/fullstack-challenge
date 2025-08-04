import { Box, TextField } from "@mui/material";
import { StaticDatePicker, StaticTimePicker } from "@mui/x-date-pickers";
import { formatDate } from "date-fns";
import { useState } from "react";
import { Label } from "./label";

type Props = {
    label: string;
    value: Date;
    onChange: (value: Date) => void;
    style?: React.CSSProperties;
    required?: boolean;
}
export const DateTimePicker = ({ label, value, onChange, style, required }: Props) => {
    const [dateFieldOpen, setDateFieldOpen] = useState(false);
    const [timeFieldOpen, setTimeFieldOpen] = useState(false);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', ...style }}>
            <Label required={required}>{label}</Label>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                <Box sx={{ flex: 1, position: 'relative' }}>
                    <TextField
                        sx={{ width: '100%' }}
                        value={formatDate(value, 'dd MMM. yyyy')}
                        onFocus={() => setDateFieldOpen(true)}
                    />
                    {dateFieldOpen && <StaticDatePicker
                        displayStaticWrapperAs="mobile"
                        disablePast
                        slots={{ toolbar: () => null }}
                        onAccept={() => setDateFieldOpen(false)}
                        value={value}
                        onClose={() => setDateFieldOpen(false)}
                        onChange={(pickerValue) => {
                            if (pickerValue) {
                                onChange(pickerValue)
                            }
                            setDateFieldOpen(false);
                        }}
                        sx={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            zIndex: 1000,
                            backgroundColor: 'white',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            borderRadius: '8px',
                            '& .MuiPickersInputBase-root': {
                                height: '40px',
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#E0E0E0',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#BDBDBD',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#000000',
                                },
                            },
                        }}
                    />}

                </Box>
                <Box sx={{ width: '100px', position: 'relative' }}>
                    <TextField
                        value={formatDate(value, 'HH:mm')}
                        onFocus={() => setTimeFieldOpen(true)}
                    />
                    {timeFieldOpen && <StaticTimePicker
                        displayStaticWrapperAs="mobile"
                        disablePast
                        value={value}
                        onAccept={() => setTimeFieldOpen(false)}
                        onClose={() => setTimeFieldOpen(false)}
                        onChange={(pickerValue) => {
                            if (pickerValue) {
                                onChange(pickerValue)
                            }
                        }}
                        sx={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            zIndex: 1000,
                            backgroundColor: 'white',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            borderRadius: '8px',
                            width: '100px',
                            '& .MuiPickersInputBase-root': {
                                height: '40px',
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#E0E0E0',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#BDBDBD',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#000000',
                                },
                            },
                        }}
                    />}
                </Box>
            </div>
        </div>
    )
}