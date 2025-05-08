import React from 'react';
import { cn } from '@/utils';
import { AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';

const AlertTrigger = ({ variant, title, type, className, icon }) => {
  const Icon = icon ? icon : Trash;

  return (
    <AlertDialogTrigger asChild>
      <Button
        title="Delete"
        // variant={variant || 'transparent'}
        variant={variant || 'transparent'}
        className={cn('h-9 ', type === 'icon' && 'h-4 w-4 p-0', className)}
      >
        {/* type check for button and icon */}
        {type === 'icon' ? (
          <Icon
            className={cn(
              'size-4 stroke-destructive stroke-[2px] font-semibold',
              className
            )}
          />
        ) : (
          title || 'Delete'
        )}
      </Button>
    </AlertDialogTrigger>
  );
};

export default AlertTrigger;
