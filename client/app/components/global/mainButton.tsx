import { colors } from "@/app/styles/colors";
import { BodySmallSemiBold } from "@/app/styles/textStyles";
import styled from "styled-components";
import { CustomButton } from "./customButton";

type Props = {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  color?: string;
  className?: string;
  icon?: React.ReactNode;
  $textColor?: string;
  $borderColor?: string;
};

export const MainButton = (props: Props) => {
  return (
    <StyledCustomButton
      onClick={props.onClick}
      disabled={props.disabled}
      $color={props.color}
      $borderColor={props.$borderColor}
      className={props.className}
    >
      {props.icon}
      <StyledButtonText $textColor={props.$textColor}>
        {props.text}
      </StyledButtonText>
    </StyledCustomButton>
  );
};

const StyledCustomButton = styled(CustomButton)<{
  $color?: string;
  $borderColor?: string;
}>`
  padding: 0 16px;
  border-radius: 4px;
  height: 40px;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  gap: 8px;
  background-color: ${(props) => props.$color || colors.bliroOrange};
  border: ${(props) => `1px solid ${props.$borderColor || colors.bliroOrange}`};
`;

const StyledButtonText = styled(BodySmallSemiBold)<{ $textColor?: string }>`
  color: ${(props) => props.$textColor || colors.white};
  position: relative;
  z-index: 1;
`;
