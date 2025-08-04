type Props = {
    children: React.ReactNode;
    style?: React.CSSProperties;
    htmlFor?: string;
}
export const Label = ({ children, style, htmlFor }: Props) => {
    return <label htmlFor={htmlFor} style={{ fontWeight: 600, fontSize: '14px', lineHeight: '22px', color: '#2B313C', ...style }}>{children}</label>
}