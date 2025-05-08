import { cn } from '@/utils'
import React from 'react'

const ArrowDownIcon = ({ className }) => {
  return (
    <svg
      className={cn('stroke-black', className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.0699 14.4299L11.9999 20.4999L5.92993 14.4299"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 3.5V20.33" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default ArrowDownIcon
