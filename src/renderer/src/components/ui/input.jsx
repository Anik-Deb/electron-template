import * as React from 'react';

import { cn } from '@/utils';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded border border-input px-3 py-2 text-[13px] ring-offset-background file:border-0 file:bg-transparent file:text-[13px] file:font-medium placeholder:text-sm placeholder:text-muted-foreground focus-visible:outline focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
