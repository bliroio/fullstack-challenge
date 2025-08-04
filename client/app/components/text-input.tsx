import { TextField } from "@mui/material";
import { Label } from "./label";

type Props = {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}
export const TextInput = ({ label, placeholder, value, onChange }: Props) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Label htmlFor={label}>{label}</Label>
            <TextField
                style={{
                    height: '40px',
                }}
                fullWidth
                name={label}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#E0E0E0',
                        },
                        '&:hover fieldset': {
                            borderColor: '#BDBDBD',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#000000', // Black border when focused
                        },
                    },
                }}
            />
        </div>
    )
}