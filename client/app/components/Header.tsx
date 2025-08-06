import Image from 'next/image';

import bliroLogo from '../public/bliro.svg';
import {Button} from '@mui/material';

export const Header = () => {
  return (
    <header className="top-0 w-full h-16 flex flex-row justify-between bg-white shadow-sm border-b border-gray-200 items-center py-3 px-6">
      <Image src={bliroLogo} alt="Bliro Logo" width={120} height={120} />
      <Button variant={'contained'} color={'warning'} className={'h-10'}>
        Create meeting
      </Button>
    </header>
  );
};
