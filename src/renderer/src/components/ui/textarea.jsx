/* eslint-disable react/prop-types */
import * as React from 'react';

import { cn } from '@/utils';

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-input px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-[13px] file:font-medium focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-transparent text-xs placeholder:text-gray-400 font-normal text-gray-600 hover:border-paragraph focus-visible:ring-0 focus-visible:ring-offset-0',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
