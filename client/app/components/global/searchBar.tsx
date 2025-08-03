import { colors } from "@/app/styles/colors";
import { useState } from "react";
import styled from "styled-components";
import SearchIcon from "../../assets/svgs/search.svg";

type Props = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  initialValue?: string;
};

export const SearchBar = (props: Props) => {
  const [value, setValue] = useState(props.initialValue);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    props.onChange(e);
  };

  return (
    <Wrapper>
      <Container
        value={value}
        onChange={handleChange}
        type="text"
        placeholder="Search..."
        aria-label="Search meetings"
      />
      <IconWrapper>
        <SearchIcon />
      </IconWrapper>
    </Wrapper>
  );
};
const Container = styled.input`
  width: 780px;
  height: 40px;
  background-color: ${colors.white};
  padding: 0 44px; // the actual padding and the size of the icon and the gap all together 16 + 20 + 8
  border: 1px solid ${colors.dark6};
  ::placeholder {
    font-weight: 400;
    font-size: 14px;
    font-style: normal;
    line-height: 22px;
    color: ${colors.dark5};
  }
`;

const Wrapper = styled.div`
  position: relative;
  width: 780px;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 16px;
  top: 25%;
  pointer-events: none;
  display: flex;
  align-items: center;
`;
