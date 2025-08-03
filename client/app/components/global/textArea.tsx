import { colors } from "@/app/styles/colors";
import { BodySmallSemiBold } from "@/app/styles/textStyles";
import { useState } from "react";
import styled from "styled-components";

type Props = {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  initialValue?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  rows?: number;
};

export const TextArea = (props: Props) => {
  const [value, setValue] = useState(props.initialValue);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      <TextAreaInput
        value={value}
        onChange={handleChange}
        placeholder={props.placeholder || "Enter text"}
        rows={props.rows || 4}
      />
    </Wrapper>
  );
};

const TextAreaInput = styled.textarea`
  width: 100%;
  min-height: 80px;
  background-color: ${colors.white};
  padding: 8px 16px;
  border: 1px solid ${colors.dark6};
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.4;
  ::placeholder {
    font-weight: 400;
    font-size: 14px;
    font-style: normal;
    line-height: 22px;
    color: ${colors.dark5};
  }
  &:focus {
    outline: none;
    border-color: ${colors.dark4};
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
