import { cn } from '@/utils';
import React from 'react'
const DangerIcon = ({ className }) => (
  <svg
  
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className={cn(className)}
  >
    <path
      d='M12 9V14'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M11.9999 21.41H5.93993C2.46993 21.41 1.01993 18.93 2.69993 15.9L5.81993 10.28L8.75993 5.00003C10.5399 1.79003 13.4599 1.79003 15.2399 5.00003L18.1799 10.29L21.2999 15.91C22.9799 18.94 21.5199 21.42 18.0599 21.42H11.9999V21.41Z'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M11.9946 17H12.0036'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export default DangerIcon;
