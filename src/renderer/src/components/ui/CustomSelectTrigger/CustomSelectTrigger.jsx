/* eslint-disable react/react-in-jsx-scope */
import { cn } from '@/utils';
import { SelectTrigger } from '../select';

export default function CustomSelectTrigger({
  errors,
  className,
  value,
  children,
  ...props
}) {
  return (
    <SelectTrigger
      {...props}
      className={cn(
        errors && 'border-destructive-600',
        value ? 'text-gray-600' : 'text-gray-400',
        'h-9 text-xs capitalize placeholder:text-gray-300 w-full bg-transparent hover:border-paragraph focus:border-primary focus:ring-0 focus:ring-offset-0',
        className
      )}
    >
      {children}
    </SelectTrigger>
  );
}
