import { DesktopDatePicker, DesktopTimePicker } from "@mui/x-date-pickers";
import { Label } from "./label";

type Props = {
    label: string;
    value: Date;
    onChange: (value: Date) => void;
    style?: React.CSSProperties;
}
export const DateTimePicker = ({ label, value, onChange, style }: Props) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', ...style }}>
            <Label>{label}</Label>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                <DesktopDatePicker
                    value={value}
                    onChange={(pickerValue) => {
                        if (pickerValue) {
                            onChange(pickerValue)
                        }
                    }}
                    format="dd MMM. yyyy"
                    sx={{
                        flex: 1,
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
                />
                <DesktopTimePicker
                    value={value}
                    format="HH:mm"
                    onChange={(pickerValue) => {
                        if (pickerValue) {
                            onChange(pickerValue)
                        }
                    }}
                    sx={{
                        width: '100px',
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
                />
            </div>
        </div>
    )
}