import React, { ChangeEvent } from 'react';
import Image from "next/image";
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { CiSearch } from "react-icons/ci";
import styles from './header.module.css';

type Props = {
  search: string;
  onChangeSearch: (value: string) => void;
}

const Header: React.FC<Props> = ({ search, onChangeSearch }) => {
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeSearch(e.target.value);
  };

  return (
    <header className={styles.header}>
      <Image className={styles.logo} src="/logo.svg" alt="app-logo" width={168} height={60} />

      <FormControl className={styles.searchInputWrapper}>
        <OutlinedInput
          className={styles.searchInput}
          value={search}
          onChange={handleChangeSearch}
          startAdornment={(
            <InputAdornment position="start">
              <CiSearch />
            </InputAdornment>
          )}
          placeholder="Search..."
        />
      </FormControl>
    </header>
  )
}

export default Header;
