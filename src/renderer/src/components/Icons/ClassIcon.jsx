import { cn } from '@/utils'
import React from 'react'
export default function ClassIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 64 64"
      className={cn('fill-none stroke-2', className)}
    >
      <path d="M32 4L2 20l30 16 30-16L32 4zm0 26l-20-10v10l20 10 20-10V20L32 30zm0 8l-10-5v10l10 5 10-5V33l-10 5z" />
    </svg>
  )
}
