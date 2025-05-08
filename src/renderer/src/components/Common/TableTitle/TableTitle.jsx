import { cn } from '@/utils'
import React from 'react'

export default function TableTitle({ className, title, ...props }) {
  return (
    <h2 {...props} className={cn('text-base font-medium text-subHeading', className)}>
      {title}
    </h2>
  )
}
