import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/utils';
import React from 'react';
const ModalTrigger = ({ variant, type, className, children, ...props }) => {
  return (
    <DialogTrigger asChild>
      <Button
        variant={variant || 'primary'}
        type={type}
        {...props}
        className={cn(
          'text-[13px] text-white text-sm px-3 flex gap-1 items-center',
          className
        )}
      >
        {children}
      </Button>
    </DialogTrigger>
  );
};

export default ModalTrigger;
