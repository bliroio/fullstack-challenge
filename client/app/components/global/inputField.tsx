import { colors } from "@/app/styles/colors";
import { BodySmallSemiBold } from "@/app/styles/textStyles";
import { useState } from "react";
import styled from "styled-components";

type Props = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  initialValue?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
};

export const InputField = (props: Props) => {
  const [value, setValue] = useState(props.initialValue);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    props.onChange(e);
  };

  return (
    <Wrapper className={props.className}>
      {props.label && (
        <Label>
          {props.label}
          {props.required && <Astrix> *</Astrix>}
        </Label>
      )}
      <Input
        value={value}
        onChange={handleChange}
        type="text"
        placeholder={props.placeholder || "Enter text"}
      />
    </Wrapper>
  );
};
const Input = styled.input`
  width: 100%;
  height: 40px;
  background-color: ${colors.white};
  padding: 8px 16px; // the actual padding and the size of the icon and the gap all together 16 + 20 + 8
  border: 1px solid ${colors.dark6};
  border-radius: 4px;
  ::placeholder {
    font-weight: 400;
    font-size: 14px;
    font-style: normal;
    line-height: 22px;
    color: ${colors.dark5};
  }
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled(BodySmallSemiBold)`
  color: ${colors.dark2};
`;

const Astrix = styled.span`
  color: ${colors.red};
`;
