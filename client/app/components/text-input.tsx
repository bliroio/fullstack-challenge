import { TextField } from "@mui/material";
import { useState } from "react";
import { Label } from "./label";

type Props = {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    requiredMessage?: string;
}
export const TextInput = ({ label, placeholder, value, onChange, required, requiredMessage = `${label} is required` }: Props) => {
    const [hasBlurred, setHasBlurred] = useState(false);
    const [error, setError] = useState(false);

    const handleBlur = () => {
        setHasBlurred(true);
        if (required && !value.trim()) {
            setError(true);
        } else {
            setError(false);
        }
    };

    const handleChange = (newValue: string) => {
        onChange(newValue);
        if (hasBlurred && required) {
            if (newValue.trim()) {
                setError(false);
            } else {
                setError(true);
            }
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Label htmlFor={label} required={required}>{label}</Label>
            <TextField
                style={{
                    height: '40px',
                }}
                fullWidth
                name={label}
                placeholder={placeholder}
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
                error={error}
                helperText={error ? requiredMessage : ''}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: error ? '#F43641' : '#E0E0E0',
                        },
                        '&:hover fieldset': {
                            borderColor: error ? '#F43641' : '#BDBDBD',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: error ? '#F43641' : '#000000',
                        },
                    },
                    '& .MuiFormHelperText-root': {
                        marginLeft: 0,
                        paddingLeft: 0,
                    },
                }}
            />
        </div>
    )
}