import React from 'react'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utils'

export const ModalContent = ({
  className,
  title,
  isSeparatorHidden = false,
  description,
  children
}) => {
  return (
    <DialogContent className={cn('border-none p-0 overflow-hidden gap-1', className)}>
      <DialogHeader className="p-0 pt-3 px-5 justify-center">
        <DialogTitle className="text-subHeading text-base capitalize">{title}</DialogTitle>
        <DialogDescription className="text-gray-500 text-[13px] font-normal text-xs">
          {description}
        </DialogDescription>
      </DialogHeader>
      {!isSeparatorHidden && <Separator className={'h-[0.2px] block'} />}
      <div className="mt-2 p-5 pt-0">{children}</div>
    </DialogContent>
  )
}
