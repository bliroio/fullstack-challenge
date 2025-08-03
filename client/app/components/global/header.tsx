import { colors } from "@/app/styles/colors";
import { styled } from "styled-components";
import BliroLogo from "../../assets/svgs/bliroLogoFull.svg";
import SearchIcon from "../../assets/svgs/create.svg";
import { MainButton } from "./mainButton";
import { SearchBar } from "./searchBar";

type Props = {
  onSearch?: (value: string) => void;
  onMainClick?: () => void;
};

export const Header = (props: Props) => {
  return (
    <Container>
      <BliroLogo />
      {props.onSearch && (
        <SearchBar onChange={(e) => props.onSearch?.(e.target.value)} />
      )}
      <MainButton
        text="Create Meeting"
        onClick={props.onMainClick}
        icon={<SearchIcon />}
      />
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  min-height: 64px;
  width: calc(100% - 48px); /* Adjusted for potential side margins */
  padding: 0 24px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${colors.dark7};
  gap: 10px;
  z-index: 0;
`;
