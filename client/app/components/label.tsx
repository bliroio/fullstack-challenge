type Props = {
    children: React.ReactNode;
    style?: React.CSSProperties;
    required?: boolean;
    htmlFor?: string;
}
export const Label = ({ children, style, htmlFor, required }: Props) => {
    return <label htmlFor={htmlFor} style={{ fontWeight: 600, fontSize: '14px', lineHeight: '22px', color: '#2B313C', ...style }}>{children} {required && <span style={{ color: '#F43641' }}>*</span>}</label>
}