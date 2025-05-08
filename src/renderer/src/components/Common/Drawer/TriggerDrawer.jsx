import React from 'react';
import { DrawerTrigger } from '@/components/ui/drawer';
import { cn } from '@/utils';

export default function TriggerDrawer({ children, className, ...props }) {
  return (
    <>
      <DrawerTrigger
        className={cn(
          'w-full px-2 h-7 text-[13px] text-start rounded hover:bg-accent hover:text-accent-foreground',
          className
        )}
        {...props}
      >
        {children}
      </DrawerTrigger>
    </>
  );
}
