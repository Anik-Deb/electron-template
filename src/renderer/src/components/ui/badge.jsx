import * as React from 'react'
import { cva } from 'class-variance-authority'

import { cn } from '@/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary-50 text-primary',
        secondary: 'border-transparent bg-secondary-50 text-secondary',
        destructive:
          'border-transparent bg-destructive-50 text-destructive',
        outline: 'text-foreground'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
