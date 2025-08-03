import { ButtonHTMLAttributes, forwardRef } from "react";
import { styled } from "styled-components";

type CustomButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  loading?: boolean;
};

export const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, loading, disabled, onClick, children, ...rest }, ref) => {
    return (
      <Button
        ref={ref}
        className={className}
        $disabled={disabled}
        $loading={loading}
        onClick={onClick}
        disabled={disabled || loading}
        $noClick={onClick === undefined && rest.onMouseDown === undefined}
        {...rest}
        draggable={false}
      >
        {children}
      </Button>
    );
  }
);

const Button = styled.button<{
  $disabled?: boolean;
  $noClick?: boolean;
  $loading?: boolean;
}>`
  border: none;
  outline: none;
  border-color: transparent;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  opacity: ${(props) => {
    if (props.$disabled) return 0.4;
    return 1;
  }};

  cursor: ${(props) =>
    props.$disabled || props.$noClick || props.$loading
      ? "default"
      : "pointer"};
  transition: opacity 0.1s ease-in-out;

  /* This will block ALL pointer events including touch when disabled */
  pointer-events: ${(props) => {
    if (props.$disabled || props.$loading) return "none";
    if (props.$noClick) return "none";
    return "auto";
  }};

  &:active {
    opacity: ${(props) =>
      props.$disabled ? 0.4 : props.$noClick || props.$loading ? 1 : 0.3};
  }
`;
