import { cn } from '@/utils'
import React from 'react'
const CollapseIcon = ({ className }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(className, 'CollapseIcon')}
  >
    <path
      d="M14.6466 10.0002V6.00016C14.6466 2.66683 13.3132 1.3335 9.9799 1.3335H5.9799C2.64657 1.3335 1.31323 2.66683 1.31323 6.00016V10.0002C1.31323 13.3335 2.64657 14.6668 5.9799 14.6668H9.9799C13.3132 14.6668 14.6466 13.3335 14.6466 10.0002Z"
      // stroke='#888888'
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.97998 1.3335V14.6668"
      // stroke='#888888'
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.31323 6.29346L7.0199 8.00012L5.31323 9.70679"
      // stroke='#888888'
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default CollapseIcon
