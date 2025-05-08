import React from 'react';

import { cn } from '@/utils';

const SearchIcon = ({ className }) => {
  return (
    <svg
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={cn('SearchIcon', className)}
    >
      <path
        d='M9.58268 17.4998C13.9549 17.4998 17.4993 13.9554 17.4993 9.58317C17.4993 5.21092 13.9549 1.6665 9.58268 1.6665C5.21043 1.6665 1.66602 5.21092 1.66602 9.58317C1.66602 13.9554 5.21043 17.4998 9.58268 17.4998Z'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M18.3332 18.3334L15.5 15.5'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default SearchIcon;
