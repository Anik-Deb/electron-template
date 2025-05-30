import { cn } from '@/utils'
import React from 'react'
const DocumentTextIcon = ({ className }) => {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <path
        d="M14 4.66683V11.3335C14 13.3335 13 14.6668 10.6667 14.6668H5.33333C3 14.6668 2 13.3335 2 11.3335V4.66683C2 2.66683 3 1.3335 5.33333 1.3335H10.6667C13 1.3335 14 2.66683 14 4.66683Z"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.66675 3V4.33333C9.66675 5.06667 10.2667 5.66667 11.0001 5.66667H12.3334"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.33325 8.6665H7.99992"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.33325 11.3335H10.6666"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default DocumentTextIcon
